import React from "react";
import { OpportunityResponse } from "../../../sharedTypes";
import {
  Card,
  CardActions,
  Button,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { PLACEHOLDER_IMAGE_URL } from "../constants";

interface OpportunityCardProps {
  opportunity: OpportunityResponse;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const start = new Date(opportunity.start);
  const end = new Date(opportunity.end);

  // local date and time for both start and end
  const startDate = start.toLocaleDateString();
  const startTime = start.toLocaleTimeString();
  const endDate = end.toLocaleDateString();
  const endTime = end.toLocaleTimeString();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        sx={{ minHeight: 140 }}
        image={
          opportunity.imageUrl ? opportunity.imageUrl : PLACEHOLDER_IMAGE_URL
        }
        title={opportunity.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {opportunity.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="left">
          {opportunity.description}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {opportunity.location}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="left">
          {startDate} {startTime} to {endDate} {endTime}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="left">
          Total Volunteering Hours: {opportunity.durationMinutes / 60}
        </Typography>
      </CardContent>
      <CardActions sx={{ alignSelf: "flex-end", justifySelf: "left" }}>
        <Button size="small">Register</Button>
      </CardActions>
    </Card>
  );
}
