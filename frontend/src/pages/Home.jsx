import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
} from "@mui/material";

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  console.log(loggedInUser);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Stack spacing={3} divider={<Divider orientation="horizontal" />}>
          <Typography variant="h2">Hello {loggedInUser.name}</Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ alignSelf: "center" }}
          >
            Logout
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Home;
