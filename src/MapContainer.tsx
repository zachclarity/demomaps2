import React, { useState } from "react";
import { Collapse, Box, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MapComponent, { type PointData } from "./MapComponent";

interface Location {
  latitude: number;
  longitude: number;
  zoom?: number;
}

interface MapContainerProps {
  location: Location;
  points: PointData[];
}

const examplePoints: PointData[] = [
  { latitude: 32.3792, longitude: -86.3077, iconSize: 64 },
  { latitude: 32.38, longitude: -86.31, iconSize: 32 },
  { latitude: 32.381, longitude: -86.312, iconSize: 16 },
];

const MapContainer: React.FC<MapContainerProps> = ({
  location,
  points = { examplePoints },
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Box>
      <Box
        onClick={handleToggle}
        sx={{
          // Ensure container spans at least full viewport height
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start", // Added for left alignment
          cursor: "pointer",
          userSelect: "none",
          backgroundColor: expanded ? "grey.100" : "transparent",
          "&:hover": {
            backgroundColor: "grey.200",
          },
        }}
      >
        <Typography
          sx={{
            mr: 1,
            width: "400px", // This width will push the icon further right if the text doesn't fill it
          }}
        >
          {expanded ? "Close Map" : "Expand Map"}
        </Typography>
        <ArrowDropDownIcon
          sx={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            fontSize: "2rem",
          }}
        />
      </Box>
      <Collapse in={expanded} timeout="auto">
        <MapComponent location={location} points={points} />
      </Collapse>
    </Box>
  );
};

export default MapContainer;
