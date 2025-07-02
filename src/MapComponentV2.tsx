import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L, { LatLng, LatLngBounds, Layer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './MapComponent.css';

// Define interfaces for type safety
interface Point {
  documentId: string;
  lat: number;
  lng: number;
  name: string;
}

// Sample static JSON data
const pointsData: Point[] = [
  { documentId: '1', lat: 51.505, lng: -0.09, name: 'Point 1' },
  { documentId: '2', lat: 51.51, lng: -0.08, name: 'Point 2' },
  { documentId: '3', lat: 51.5, lng: -0.1, name: 'Point 3' },
  { documentId: '4', lat: 51.52, lng: -0.07, name: 'Point 4' },
];

// Component to handle map interactions
const MapInteraction: React.FC<{
  points: Point[];
  setFilteredPoints: (points: Point[]) => void;
}> = ({ points, setFilteredPoints }) => {
  const map = useMap();
  const [featureGroup, setFeatureGroup] = useState<L.FeatureGroup | null>(null);

  // Handle shape creation
  const onCreated = (e: any) => {
    const layer = e.layer as Layer;
    let filtered: Point[] = [];

    if (e.layerType === 'circle') {
      const circle = layer as L.Circle;
      const center = circle.getLatLng();
      const radius = circle.getRadius();

      filtered = points.filter((point) => {
        const pointLatLng = new L.LatLng(point.lat, point.lng);
        const distance = center.distanceTo(pointLatLng);
        return distance <= radius;
      });
    } else if (e.layerType === 'rectangle') {
      const rectangle = layer as L.Rectangle;
      const bounds = rectangle.getBounds();

      filtered = points.filter((point) => {
        const pointLatLng = new L.LatLng(point.lat, point.lng);
        return bounds.contains(pointLatLng);
      });
    }

    setFilteredPoints(filtered);

    // Clear previous shapes and add new one
    if (featureGroup) {
      featureGroup.clearLayers();
      featureGroup.addLayer(layer);
    }
  };

  // Handle shape deletion
  const onDeleted = () => {
    setFilteredPoints([]);
  };

  return (
    <FeatureGroup
      ref={(ref) => {
        if (ref) setFeatureGroup(ref);
      }}
    >
      <EditControl
        position="topright"
        onCreated={onCreated}
        onDeleted={onDeleted}
        draw={{
          polyline: false,
          polygon: false,
          circle: true,
          rectangle: true,
          marker: false,
          circlemarker: false,
        }}
        edit={{
          edit: false,
          remove: true,
        }}
      />
    </FeatureGroup>
  );
};

// Main Map Component
interface MapComponentProps {
  points: Point[];
}

const MapComponent: React.FC<MapComponentProps> = ({ points }) => {
  const [filteredPoints, setFilteredPoints] = useState<Point[]>([]);

  // Memoize markers to prevent unnecessary re-renders
  const markers = useMemo(
    () =>
      points.map((point) => (
        <Marker
          key={point.documentId}
          position={[point.lat, point.lng]}
          title={point.name}
        />
      )),
    [points]
  );

  return (
    <div className="map-container">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers}
        <MapInteraction points={points} setFilteredPoints={setFilteredPoints} />
      </MapContainer>
      <div className="points-list">
        <h3>Points in Shape</h3>
        <ul>
          {filteredPoints.map((point) => (
            <li key={point.documentId}>
              ID: {point.documentId}, Name: {point.name}, Lat: {point.lat}, Lng: {point.lng}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Export with static data
export default () => <MapComponent points={pointsData} />;