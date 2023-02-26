import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getValidationErrors } from "../../utils/FormValidator";

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
import SimpleSnackbar from "../../layouts/feedback/SimpleSnackbar";

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

export default function Register() {
  const classes = useStyles();
  const defaultRegister = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const url = `${localStorage.api}/register`;
  const [register, setRegister] = useState(defaultRegister);
  const [message, setMessage] = useState({})
  const [toast, setToast] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await axios.post(url, register);

    if (res.data.status === "fail") {
      getValidationErrors(res.data.errors, setMessage);
      return false;
    }
    setMessage({});
    setRegister(defaultRegister);
    setToast(res.data.message);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <SimpleSnackbar toast={toast} setToast={setToast} />
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="fname"
                variant="outlined"
                required
                fullWidth
                error={message.fname ? true : false}
                helperText={message.fname ? "First name is required":""}
                label="First Name"
                autoFocus
                value={register.fname}
                onChange={(e) =>
                  setRegister({ ...register, fname: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                error={message.lname ? true : false}
                helperText={message.lname ? "Last name is required":""}
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={register.lname}
                onChange={(e) =>
                  setRegister({ ...register, lname: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                error={message.email ? true : false}
                helperText={message.email ?? ""}
                label="Email Address"
                name="email"
                autoComplete="email"
                value={register.email}
                onChange={(e) =>
                  setRegister({ ...register, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                error={message.password ? true : false}
                helperText={message.password ?? ""}
                autoComplete="current-password"
                value={register.password}
                onChange={(e) =>
                  setRegister({ ...register, password: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password_confirmation"
                label="Confirm Password"
                type="password"
                id="password_confirmation"
                autoComplete="current-password_confirmation"
                value={register.password_confirmation}
                onChange={(e) =>
                  setRegister({ ...register, password_confirmation: e.target.value })
                }
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" className="linkStyle">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
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
