import React, { useState } from "react";
import {
  Typography, Box, Alert, CircularProgress,
  ToggleButton, ToggleButtonGroup, Button, Chip
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import StarIcon    from "@mui/icons-material/Star";
import { usePriorityNotifications } from "../hooks/useNotifications";
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";

const TOP_N_OPTIONS = [10, 15, 20];

export default function PriorityInboxPage() {
  const [topN, setTopN]       = useState(10);
  const [filter, setFilter]   = useState("All");
  const [readIds, setReadIds] = useState(new Set());

  const type = filter === "All" ? "" : filter;
  const { notifications, loading, error, refetch } = usePriorityNotifications({ topN, type });

  const markRead = (id) => setReadIds((prev) => new Set([...prev, id]));

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, mt: 1, flexWrap: "wrap", gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            <StarIcon sx={{ mr: 1, verticalAlign: "middle", color: "secondary.main" }} />
            Priority Inbox
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ranked by importance + recency · Placement &gt; Result &gt; Event
          </Typography>
        </Box>
        <Button startIcon={<RefreshIcon />} onClick={refetch} variant="outlined" size="small">
          Refresh
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          Show top:
        </Typography>
        <ToggleButtonGroup
          value={topN}
          exclusive
          onChange={(_, val) => val && setTopN(val)}
          size="small"
        >
          {TOP_N_OPTIONS.map((n) => (
            <ToggleButton key={n} value={n} sx={{ fontWeight: 600, px: 2 }}>
              {n}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Chip label={`Showing top ${notifications.length}`} color="primary" size="small" variant="outlined" />
      </Box>

      <FilterBar selected={filter} onChange={setFilter} />

      {loading && <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}><CircularProgress /></Box>}
      {error   && <Alert severity="error" sx={{ mb: 2 }}>⚠ {error}</Alert>}

      {!loading && !error && (
        <>
          {notifications.length === 0 && <Alert severity="info">No notifications found.</Alert>}
          {notifications.map((n, i) => (
            <NotificationCard
              key={n.ID}
              notification={n}
              rank={i + 1}
              isRead={readIds.has(n.ID)}
              onRead={markRead}
            />
          ))}
        </>
      )}
    </Box>
  );
}