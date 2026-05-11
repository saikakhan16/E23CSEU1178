import React, { useState } from "react";
import {
  Typography, Box, Alert, CircularProgress, Divider, Button
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNotifications } from "../hooks/useNotifications";
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";

export default function AllNotificationsPage() {
  const [filter, setFilter]   = useState("All");
  const [readIds, setReadIds] = useState(new Set());

  const type = filter === "All" ? "" : filter;
  const { notifications, loading, error, refetch } = useNotifications({ type });

  const markRead = (id) => setReadIds((prev) => new Set([...prev, id]));

  const unread = notifications.filter((n) => !readIds.has(n.ID));
  const read   = notifications.filter((n) =>  readIds.has(n.ID));

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mt: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>All Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            {notifications.length} total · {unread.length} unread
          </Typography>
        </Box>
        <Button startIcon={<RefreshIcon />} onClick={refetch} variant="outlined" size="small">
          Refresh
        </Button>
      </Box>

      <FilterBar selected={filter} onChange={setFilter} />

      {loading && <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}><CircularProgress /></Box>}
      {error   && <Alert severity="error" sx={{ mb: 2 }}>⚠ {error}</Alert>}

      {!loading && !error && (
        <>
          {unread.length > 0 && (
            <>
              <Typography variant="overline" color="primary" fontWeight={700}>
                Unread ({unread.length})
              </Typography>
              {unread.map((n) => (
                <NotificationCard key={n.ID} notification={n} isRead={false} onRead={markRead} />
              ))}
            </>
          )}

          {read.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="overline" color="text.secondary" fontWeight={700}>
                Read ({read.length})
              </Typography>
              {read.map((n) => (
                <NotificationCard key={n.ID} notification={n} isRead={true} onRead={markRead} />
              ))}
            </>
          )}

          {notifications.length === 0 && (
            <Alert severity="info">No notifications found.</Alert>
          )}
        </>
      )}
    </Box>
  );
}