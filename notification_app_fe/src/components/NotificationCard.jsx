import React from "react";
import { Card, CardContent, Typography, Chip, Box, Tooltip } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon   from "@mui/icons-material/School";
import EventIcon    from "@mui/icons-material/Event";
import FiberNewIcon from "@mui/icons-material/FiberNew";

const TYPE_CONFIG = {
  Placement: { color: "primary", icon: <BusinessIcon fontSize="small" /> },
  Result:    { color: "success", icon: <SchoolIcon   fontSize="small" /> },
  Event:     { color: "warning", icon: <EventIcon    fontSize="small" /> },
};

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts)) / 60000);
  if (diff < 1)  return "just now";
  if (diff < 60) return `${diff}m ago`;
  const h = Math.floor(diff / 60);
  if (h < 24)    return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationCard({ notification, rank, isRead, onRead }) {
  const { Type, Message, Timestamp, score } = notification;
  const cfg = TYPE_CONFIG[Type] || TYPE_CONFIG.Event;

  return (
    <Card
      onClick={() => onRead && onRead(notification.ID)}
      sx={{
        mb: 1.5,
        borderLeft: "5px solid",
        borderLeftColor: isRead ? "grey.300" : `${cfg.color}.main`,
        backgroundColor: isRead ? "grey.50" : "white",
        opacity: isRead ? 0.75 : 1,
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": { boxShadow: 4, transform: "translateY(-1px)" },
      }}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
          {rank && (
            <Typography variant="caption" sx={{
              background: "#1a237e", color: "white", borderRadius: "50%",
              width: 24, height: 24, display: "flex", alignItems: "center",
              justifyContent: "center", fontWeight: 700, fontSize: 11, flexShrink: 0
            }}>
              {rank}
            </Typography>
          )}
          <Chip icon={cfg.icon} label={Type} color={cfg.color} size="small" sx={{ fontWeight: 600 }} />
          {!isRead && (
            <Tooltip title="New"><FiberNewIcon color="error" fontSize="small" /></Tooltip>
          )}
          <Box sx={{ ml: "auto", display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary">{timeAgo(Timestamp)}</Typography>
            {score && (
              <Typography variant="caption" color="text.disabled" sx={{ fontFamily: "monospace" }}>
                {score.toFixed(0)}
              </Typography>
            )}
          </Box>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: isRead ? 400 : 600, color: isRead ? "text.secondary" : "text.primary" }}>
          {Message}
        </Typography>
      </CardContent>
    </Card>
  );
}