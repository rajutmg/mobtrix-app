import React, { Fragment, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import axios from "axios";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <a className="linkStyle" href="https://www.mobwizards.com/">
        Mobwizards
      </a>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Login() {
  const [, setUser] = useContext(UserContext);

  const classes = useStyles();
  const url = `${localStorage.api}/login`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Login
  const onSubmitLogin = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setMessage("Credentials cannot be empty.");
      return false;
    }
    setLoading(true);
    let data = { email: email, password: password };
    let res = await login(data);

    if (res.status === "fail") {
      setMessage(res.error);
    } else {
      setMessage(res.message);
      setUser(res.data);
      localStorage.setItem("mobtrix_data", JSON.stringify(res.data));
    }
    setLoading(false);
  };

  // Error message function
  const displayMessage = (data) => {
    return {
      display: message === "" ? "none" : "block",
      background: "#f50057",
      padding: message === "" ? "0px" : "10px",
      color: "#fff",
      borderRadius: "5px",
    };
  };

  // hide error message
  const hideMessage = (data) => {
    setMessage("");
  };

  const login = async (creds) => {
    const res = await axios.post(url, creds);
    return res.data;
  };

  return (
    <Fragment>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          <form
            className={classes.form}
            noValidate
            action="!#"
            onSubmit={onSubmitLogin}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <div style={displayMessage(message)}>
              {message}{" "}
              <span style={alertCloseStyle} onClick={hideMessage}>
                x
              </span>
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {loading ? (
                <CircularProgress
                  style={{ color: "#ffebee", width: "30px", height: "30px" }}
                />
              ) : (
                "Sign In"
              )}
            </Button>
            <a href={`${localStorage.api}/oauth2/google/redirect`} className="tdnone">
              <Button fullWidth variant="contained" className="mb-2 ">
                Login with Google
              </Button>
            </a>
            <Grid container>
              <Grid item xs>
                <Link to="/forgot-password" className="linkStyle">
                  Forgot password?
                </Link>
              </Grid>
              {/*
                <Grid item>
                <Link to="/register" className="linkStyle">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            */}
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </Fragment>
  );
}

// Styles
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const alertCloseStyle = {
  float: "right",
  marginRight: "8px",
  padding: "2px 8px",
  background: "rgba(244, 135, 174, 0.57) none repeat scroll 0% 0%",
  borderRadius: "50%",
  cursor: "pointer",
};
