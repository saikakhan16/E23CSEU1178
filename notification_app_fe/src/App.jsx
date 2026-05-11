import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, Tabs, Tab, Box, CssBaseline,
  ThemeProvider, createTheme, useMediaQuery
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import AllNotificationsPage from "./pages/AllNotificationsPage";
import PriorityInboxPage from "./pages/PriorityInboxPage";

const theme = createTheme({
  palette: {
    primary:    { main: "#1a237e" },
    secondary:  { main: "#ff6f00" },
    background: { default: "#f5f5f5" },
  },
  typography: {
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
});

function NavTabs() {
  const location = useLocation();
  const value = location.pathname === "/priority" ? 1 : 0;
  return (
    <Tabs value={value} textColor="inherit" indicatorColor="secondary">
      <Tab icon={<NotificationsIcon />} iconPosition="start" label="All Notifications" component={Link} to="/" />
      <Tab icon={<StarIcon />} iconPosition="start" label="Priority Inbox" component={Link} to="/priority" />
    </Tabs>
  );
}

export default function App() {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="sticky">
          <Toolbar sx={{ flexDirection: isMobile ? "column" : "row", py: isMobile ? 1 : 0 }}>
            <Typography variant="h6" sx={{ mr: 3, fontWeight: 700 }}>
              📬 Campus Notifications
            </Typography>
            <NavTabs />
          </Toolbar>
        </AppBar>
        <Box sx={{ maxWidth: 1100, mx: "auto", p: { xs: 1, sm: 3 } }}>
          <Routes>
            <Route path="/"         element={<AllNotificationsPage />} />
            <Route path="/priority" element={<PriorityInboxPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}