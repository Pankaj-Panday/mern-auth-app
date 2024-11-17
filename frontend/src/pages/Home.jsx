import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState("");
  const [products, setProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  const handleClick = () => {
    const fetchProducts = async () => {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        credentials: "include",
      });
      const { data } = await res.json();
      setProducts(data);
    };
    fetchProducts();
  };
  // testing if user can acess protected resource of backend

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSnackbar({
      open: true,
      severity: "success",
      message: "Logged out successfully",
    });
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

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
          <Typography variant="h2">Hello {loggedInUser?.name}</Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ alignSelf: "center" }}
            onClick={handleLogout}
          >
            Logout
          </Button>
          <Button onClick={handleClick} variant="contained">
            Fetch Products
          </Button>
          {products &&
            products.map((product) => {
              return (
                <Box key={product.name}>
                  {product.name} - {product.price}
                </Box>
              );
            })}
        </Stack>
      </Box>
      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          onClose={handleClose}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home;
