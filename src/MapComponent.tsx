import React, { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import ZoomControl from 'ol/control/Zoom';
import { Box } from '@mui/material';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import 'ol/ol.css';

interface Location {
  latitude: number;
  longitude: number;
  zoom?: number;
}

export interface PointData {
  latitude: number;
  longitude: number;
  iconSize?: number; // Desired size in pixels
}

interface MapComponentProps {
  location: Location;
  points?: PointData[];
}

const MapComponent: React.FC<MapComponentProps> = ({ location, points = [] }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);

  useEffect(() => {
    // Validate location coordinates
    if (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) {
      console.warn('Invalid location coordinates provided');
      return;
    }

    if (mapRef.current && !mapInstance.current) {
      // Initialize vector source and layer
      vectorSourceRef.current = new VectorSource();

      const vectorLayer = new VectorLayer({
        source: vectorSourceRef.current,
      });

      // Initialize map
      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([location.longitude, location.latitude]),
          zoom: location.zoom ?? 17,
        }),
        controls: [new ZoomControl()],
      });
    }

    // Update points
    if (vectorSourceRef.current) {
      vectorSourceRef.current.clear(); // Clear previous features

      const features = points.map((point) => {
        if (!Number.isFinite(point.latitude) || !Number.isFinite(point.longitude)) {
          console.warn(`Invalid point coordinates: ${JSON.stringify(point)}`);
          return null;
        }

        const feature = new Feature({
          geometry: new Point(fromLonLat([point.longitude, point.latitude])),
        });

        // Calculate scale to make icon approximately 5px
        const desiredSize = point.iconSize ?? 5; // Default to 5px if not specified
        // Assuming original icon is 512x512px (based on Flaticon source)
        const scale = desiredSize / 512; // Adjust scale based on original size

        feature.setStyle(
          new Style({
            image: new Icon({
              src: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
              scale,
            }),
          })
        );

        return feature;
      }).filter((feature): feature is Feature => feature !== null);

      vectorSourceRef.current.addFeatures(features);
    }

    // Update view if location changes
    if (mapInstance.current) {
      mapInstance.current.getView().setCenter(fromLonLat([location.longitude, location.latitude]));
      mapInstance.current.getView().setZoom(location.zoom ?? 17);
      mapInstance.current.updateSize();
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
        vectorSourceRef.current = null;
      }
    };
  }, [location, points]);

  return (
    <Box
      ref={mapRef}
      sx={{
        width: '100%',
        height: '400px',
        position: 'relative',
        '& .ol-viewport': {
          width: '100% !important',
          height: '100% !important',
        },
      }}
    />
  );
};

export default MapComponent;