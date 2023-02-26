import React, { useState } from "react";
import {Link} from 'react-router-dom';
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

export default function ForgotPassword() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const url = `${localStorage.api}/forgot-password`;

  const resetEmail = (e) => {
    e.preventDefault();
    var re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      setMessage("Invalid email");
      return false;
    }
    sendResetEmail();
  };

  const sendResetEmail = async () => {
    setTimeout(() =>{
      setMessage("Email will be sent if it exists in our database.");
    }, 2000);

    
    await axios.post(url, {email: email});
  };

  // Error message function
  const displayMessage = () => {
    return {
      display: message === "" ? "none" : "block",
      background: message === "" ? "#f50057" : "block",
      padding: message === "" ? "0px" : "10px",
      marginTop: message === "" ? "0px" : "10px",
      color: "#fff",
      borderRadius: "4px",
    };
  };

  // hide error message
  const hideMessage = (data) => {
    setMessage("");
  };

  // TODO : send email api
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <p>
          Lost your password ? Please enter your email address. You will receive
          a link to reset you password in email.
        </p>
        <form className={classes.form} noValidate onSubmit={resetEmail}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
          </Grid>
          <div style={displayMessage()}>
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
            Send Reset Email
          </Button>
        </form>

        <Grid container>
          <Grid item xs>
            <Link to="/login" className="linkStyle">
              Login
            </Link>
          </Grid>
        </Grid>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

const alertCloseStyle = {
  float: "right",
  marginRight: "8px",
  padding: "2px 8px",
  background: "rgba(244, 135, 174, 0.57) none repeat scroll 0% 0%",
  borderRadius: "50%",
  cursor: "pointer",
};

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
