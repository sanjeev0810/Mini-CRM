import { useEffect, useState } from "react";
import API from "../services/api";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

export default function CompanyDetails() {
  const { id } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    API.get(`/companies/${id}`).then(res => setData(res.data));
  }, []);

  return (
    <Box>
      <Typography variant="h5">{data.company?.name}</Typography>
      <Typography>{data.company?.industry}</Typography>

      <Typography mt={2}>Leads:</Typography>

      {data.leads?.map(l => (
        <div key={l._id}>{l.name}</div>
      ))}
    </Box>
  );
}