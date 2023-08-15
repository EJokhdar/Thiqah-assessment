import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Dashboard = () => {
  const [first_name, setFirst] = useState("");
  const [last_name, setLast] = useState("");
  const [profile_picture, setPicture] = useState(""); // Ensure profile_picture is a URL
  const [level, setLevel] = useState("");
  const [program, setProgram] = useState("");
  const [division, setDivision] = useState("");

  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/users/me", {
          headers: {
            token: accessToken,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          console.error(data);
          throw new Error(data.detail);
        }

        const data = await response.json();
        setFirst(data.first_name);
        setLast(data.last_name);
        setLevel(data.level);
        setProgram(data.program);
        setDivision(data.division);
        setPicture(
          "https://jesusbuckethat.s3.eu-central-1.amazonaws.com/" +
            data.profile_picture
        ); // Ensure this is a valid URL
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 29 }} color="text.secondary" gutterBottom>
          Student Dashboard
        </Typography>
        <img
          src={profile_picture}
          alt="Profile"
          style={{ height: "100px", width: "100px" }}
        />

        <Typography variant="h5" component="div">
          {first_name + " " + last_name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Level of Study: {level} Degree
        </Typography>
        <Typography variant="body2">
          Program: {program}
          <br />
          Faculty/Division: {division}
        </Typography>
      </CardContent>
    </React.Fragment>
  );

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
};
export default Dashboard;
