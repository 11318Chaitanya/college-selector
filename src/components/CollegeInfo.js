import React from "react";
import { Stack, Typography } from "@mui/material";

const CollegeInfo = ({ selectedCollege, logoUrl, loading }) => (
  <Stack marginTop="20px" alignItems="center">
    <Typography variant="h4" component="h1" gutterBottom>
      {selectedCollege.name}
    </Typography>
    {logoUrl && !loading ? (
      <img
        src={logoUrl}
        alt={`${selectedCollege.name} logo`}
        style={{ maxWidth: "200px" }}
      />
    ) : (
      <Typography>
        {loading ? "Loading logo..." : "Logo not available"}
      </Typography>
    )}
  </Stack>
);

export default CollegeInfo;
