import React from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  LinearProgress,
  Divider,
} from "@mui/material";
import colors from "../../styles/colors";

export function ReportContent({ isDaily = false }) {
  // --- Data inside component, branch by isDaily ---
  const metrics = isDaily
    ? { conversations: 120, messages: 350, success: "75%" }
    : { conversations: 570, messages: 864, success: "87%" };

  const topics = isDaily
    ? [
        { title: "Baggage policies", value: 15 },
        { title: "Prohibited items", value: 23 },
        { title: "Gate locations", value: 29 },
        { title: "Security rules", value: 19 },
        { title: "Assistance for reduced mobility", value: 15 },
        { title: "WiFi availability", value: 7 },
        { title: "Parking & fees", value: 49 },
      ] // no topics on daily
    : [
        { title: "Baggage policies", value: 15 },
        { title: "Prohibited items", value: 43 },
        { title: "Terminal info", value: 7 },
        { title: "Gate locations", value: 69 },
        { title: "Security rules", value: 69 },
        { title: "Wait time estimate", value: 1 },
        { title: "Assistance for reduced mobility", value: 15 },
        { title: "Dining/shopping options", value: 43 },
        { title: "WiFi availability", value: 7 },
        { title: "Parking & fees", value: 69 },
      ];

  const toAdd = isDaily
    ? [
        "Add shuttle schedule for tomorrow.",
        "Ensure daily WiFi password is displayed.",
      ]
    : [
        "Add shuttle schedule to downtown Atlanta.",
        "Missing baggage weight limits for Delta Airlines.",
        "Users can’t find the customer service desk.",
        "Add open‑restaurant info for Terminal F.",
        "Include protocol for unaccompanied minors.",
        "Make WiFi password clearly visible.",
      ];

  const recommendations = isDaily
    ? ["Follow up on daily lost‑and‑found inquiries."]
    : [
        "Include direct link to cancel orders (ID: 1585).",
        "Review inaccurate gate‑location responses.",
        "Improve audio detection for French conversations.",
        "Low satisfaction in lost‑and‑found inquiries.",
      ];

  // Helper to render bullet‑point blocks
  const renderBullets = (arr) => (
    <Typography
      sx={{
        fontFamily: "Inter",
        fontSize: "0.875rem",
        color: colors.gray700,
        whiteSpace: "pre-line",
        lineHeight: "1.75rem",
      }}
    >
      {arr.map((item) => `• ${item}`).join("\n")}
    </Typography>
  );

  return (
    <Grid container spacing={2}>
      {/* LEFT COLUMN */}
      <Grid item xs={12} md={7}>
        {/* KPIs */}
        <Box
          sx={{
            p: 3,
            bgcolor: "white",
            borderRadius: "1rem",
            border: `1px solid ${colors.gray300}`,
            mb: 2,
          }}
        >
          <Typography sx={{ fontFamily: "Inter", fontWeight: 600, mb: 2 }}>
            {isDaily ? "Daily KPIs" : "Weekly KPIs"}
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              bgcolor: colors.gray200,
              p: "1rem 0",
              borderRadius: "0.5rem",
            }}
          >
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.75rem",
                  color: "grey.600",
                  mb: 0.5,
                }}
              >
                Conversations
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                {metrics.conversations}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.75rem",
                  color: "grey.600",
                  mb: 0.5,
                }}
              >
                Messages
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                {metrics.messages}
              </Typography>
            </Box>

            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.75rem",
                  color: "grey.600",
                  mb: 0.5,
                }}
              >
                Success Rate
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                {metrics.success}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Topics (weekly only) */}

        <Box
          sx={{
            p: 3,
            bgcolor: "white",
            borderRadius: "1rem",
            border: `1px solid ${colors.gray300}`,
          }}
        >
          <Typography sx={{ fontFamily: "Inter", fontWeight: 600, mb: 2 }}>
            Topics Covered
          </Typography>
          {topics.map((t) => (
            <Box
              key={t.title}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.75rem",
                  color: colors.gray700,
                  width: "35%",
                }}
              >
                {t.title}
              </Typography>
              <Box sx={{ flex: 1, mx: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(t.value / 69) * 100}
                  sx={{
                    height: "1rem",
                    borderRadius: "0.25rem",
                    bgcolor: colors.gray200,
                    "& .MuiLinearProgress-bar": {
                      bgcolor: colors.primary,
                    },
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.75rem",
                  color: colors.gray500,
                  width: "10%",
                  textAlign: "right",
                }}
              >
                {t.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Grid>

      {/* RIGHT COLUMN */}
      <Grid item xs={12} md={5}>
        <Box
          sx={{
            p: 3,
            bgcolor: "white",
            borderRadius: "1rem",
            border: `1px solid ${colors.gray300}`,
            pb: "4rem",
          }}
        >
          {/* To‑Add */}
          <Typography sx={{ fontFamily: "Inter", fontWeight: 600, mb: 2 }}>
            Add the following information
          </Typography>
          {renderBullets(toAdd)}

          <Divider sx={{ my: 2 }} />

          {/* Recommendations */}
          <Typography sx={{ fontFamily: "Inter", fontWeight: 600, mb: 2 }}>
            Recommendations & Actions
          </Typography>
          {renderBullets(recommendations)}
        </Box>
      </Grid>
    </Grid>
  );
}
