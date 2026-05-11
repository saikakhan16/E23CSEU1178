import React from "react";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";

const TYPES = ["All", "Placement", "Result", "Event"];

export default function FilterBar({ selected, onChange }) {
  return (
    <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        Filter:
      </Typography>
      <ToggleButtonGroup
        value={selected}
        exclusive
        onChange={(_, val) => val && onChange(val)}
        size="small"
      >
        {TYPES.map((t) => (
          <ToggleButton key={t} value={t} sx={{ fontWeight: 600, px: 2 }}>
            {t}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}