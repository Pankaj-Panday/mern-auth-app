import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  Paper,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import useRedirectIfLoggedIn from "../hooks/useRedirectIfLoggedIn";

const classes = {
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    p: 4,
    mt: 8,
    boxShadow:
      "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
    gap: 2,
  },
  heading: {
    width: "100%",
    mb: 2,
  },
  form: { display: "flex", flexDirection: "column", width: "100%", gap: 2 },
  submitBtn: {
    mt: 1,
  },
};

const Login = () => {
  useRedirectIfLoggedIn();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [info, setInfo] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleMouseDownPassword = () => setShowPassword(true);
  const handleMouseUpPassword = () => setShowPassword(false);

  const validate = (info) => {
    const errors = {};
    const { email, password } = info;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) errors.email = "Email is required";
    else if (!emailPattern.test(email))
      errors.email = "Enter a valid email address";
    if (!password) errors.password = "Password is required";

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: validate({ ...info, [name]: value })[name],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = info;
    setErrors({
      email: "",
      password: "",
    });
    // perform validation on the info
    const errors = validate(info);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // everything is correct, send data to backend
    const url = "http://localhost:3000/api/auth/login";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const {
          data: { token, user },
          success,
          message,
        } = data;
        if (!success) {
          // some toast notifcation maybe
          setSnackbar({
            open: true,
            message: message,
            severity: "error",
          });
        } else {
          // login was successful
          localStorage.setItem("token", JSON.stringify(token));
          localStorage.setItem("user", JSON.stringify(user));

          setSnackbar({
            open: true,
            message: "Logged in sucessfully",
            severity: "success",
          });
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        }
      })
      .catch((err) => {});
  };

  return (
    <Container maxWidth="xs" component="main">
      <Paper sx={classes.formContainer}>
        <Typography sx={classes.heading} component="h1" variant="h4">
          Login
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          sx={classes.form}
        >
          <TextField
            value={info.email}
            onChange={handleChange}
            label="Email"
            name="email"
            required
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            value={info.password}
            onChange={handleChange}
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            error={!!errors.password}
            helperText={errors.password}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            required
            fullWidth
          />
          <Button
            sx={classes.submitBtn}
            type="submit"
            variant="contained"
            fullWidth
          >
            Login
          </Button>
        </Box>
        <Typography variant="body2">
          Don't have an account?{" "}
          <Link
            component="span"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </Link>
        </Typography>
      </Paper>
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

export default Login;
