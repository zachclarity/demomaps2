import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Fullscreen,
  FullscreenExit,
} from "@mui/icons-material";
import { PointData } from "./MapComponent";
import MapContainer from "./MapContainer";
import MapComponentV2 from "./MapComponentV2";

const HANDLE_WIDTH = 20; // arrow strip

export default function LayoutWithMap() {
  const [openSidebar, setOpenSidebar] = useState(true); // show / hide column 2
  const [fullView, setFullView] = useState(false); // Component 1 full screen?

  /* ---------- dynamic widths ---------- */
  const leftWidth = fullView
    ? "0%" // hidden in full screen
    : openSidebar
    ? `calc(50% - ${HANDLE_WIDTH}px)` // normal half (minus handle strip)
    : `calc(100% - ${HANDLE_WIDTH}px)`; // sidebar collapsed → almost 100 %

  const rightWidth = fullView
    ? "100%" // full view takes everything
    : openSidebar
    ? "50%" // normal half
    : "0%"; // collapsed

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
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Collapsible Sidebar + Full-View Demo
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Body */}
      <Box sx={{ flexGrow: 1, display: "flex", position: "relative" }}>
        {/* Left Column */}
        <Box
          sx={{
            width: leftWidth,
            transition: "width 0.3s",
            overflow: "auto",
            p: 2,
            bgcolor: "background.default",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Main Content
          </Typography>
          <Typography paragraph>
            When the right column is collapsed, this area widens to fill the
            page (minus the arrow handle).
          </Typography>
        </Box>

        {/* Arrow Handle (always 20 px wide) */}
        {!fullView && (
          <Box
            sx={{
              width: `${HANDLE_WIDTH}px`,
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              pt: 2,
              bgcolor: "background.paper",
              borderLeft: openSidebar ? 1 : 0,
              borderColor: "divider",
              transition: "border-color 0.3s",
              zIndex: 2,
            }}
          >
            <IconButton
              size="small"
              onClick={() => setOpenSidebar(!openSidebar)}
              sx={{
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              {openSidebar ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Box>
        )}

        {/* Right Column */}
        <Box
          sx={{
            width: rightWidth,
            transition: "width 0.3s",
            overflow: "auto",
            bgcolor: "background.paper",
          }}
        >
          <Container sx={{ py: 3 }}>
            <Grid container direction="column" spacing={2}>
              {/* Component 1 with full-view icon */}
              <Grid item>
                <Paper sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="subtitle1">
                    Details
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (!fullView) setOpenSidebar(true);
                        setFullView((v) => !v);
                      }}
                    >
                      {fullView ? <FullscreenExit /> : <Fullscreen />}
                    </IconButton>
                  </Box>
                  <Typography>
                  <MapContainer location={location} points={examplePoints}/>
                  <MapComponentV2/>
                  </Typography>
                </Paper>
              </Grid>

              {/* Components 2 & 3 hidden in full view */}
              {!fullView && (
                <>
                  <Grid item>
                    <Paper sx={{ p: 2 }}>
                      <Typography>Component 2</Typography>
                    </Paper>
                  </Grid>
                  <Grid item>
                    <Paper sx={{ p: 2 }}>
                      <Typography>Component 3</Typography>
                    </Paper>
                  </Grid>
                </>
              )}
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 2, bgcolor: "grey.100" }}>
        <Container>
          <Typography align="center" variant="body2">
            © 2025 Your Company – All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
