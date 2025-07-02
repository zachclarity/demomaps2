// src/App.tsx
import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import MapContainer from './MapContainer';
import { PointData } from './MapComponent';
import LayoutWithMap from './LayoutWithMap';

export default function App() {
  const [open, setOpen] = useState(true);   // sidebar state
  const sidebarWidth = open ? 320 : 0;      // px

  const location = {
  latitude: 32.38,
  longitude: -86.31,
  zoom: 15,
};

const examplePoints: PointData[] = [
  { latitude: 32.3792, longitude: -86.3077, iconSize: 64 },
  { latitude: 32.38, longitude: -86.31, iconSize: 32 },
  { latitude: 32.381, longitude: -86.312, iconSize: 16 },
];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ───── Header ───── */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Collapsible-Sidebar Template
          </Typography>
        </Toolbar>
      </AppBar>

     <LayoutWithMap/>
     
    </Box>
  );
}
