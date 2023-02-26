import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { getValidationErrors } from "../../utils/FormValidator";

import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const SetPassword = () => {
  const classes = useStyles();
  const { token } = useParams();
  const url = `${localStorage.api}/set-password/${token}`;
  const [error, setError] = useState({});
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");
  const defaultPassword = {
    password: "",
    password_confirmation: "",
  }
  const [password, setPassword] = useState(defaultPassword);

  useEffect(() => {
    getUserEmail();
    // eslint-disable-next-line
  }, []);

  const getUserEmail = async () => {
    let res = await axios.get(url);
    setEmail(res.data.data);
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError({});

    let res = await axios.post(url, password);
    if (res.data.status === "fail") {
      getValidationErrors(res.data.errors, setError);
      return false;
    }

    if (res.data.error === "Token Expired.") {
      setMessage(res.data.message);
      return false;
    }
    setPassword(defaultPassword)
    setMessage(res.data.message);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>

        <form className={classes.form} noValidate onSubmit={updatePassword}>
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
                disabled={true}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="password"
                error={error.password ? true : false}
                label="Password"
                name="password"
                type="password"
                value={password.password}
                onChange={(e) =>
                  setPassword({ ...password, password: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="password_confirmation"
                error={error.password ? true : false}
                helperText={error.password ?? ""}
                type="password"
                label="Confirm Password"
                name="password_confirmation"
                value={password.password_confirmation}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    password_confirmation: e.target.value,
                  })
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
            Reset Password
          </Button>

        {/*show error alert*/}
          <div>{message ? <span style={errorAlert}>{message}</span> : ""} </div>
        </form>

        <Grid container>
          <Grid item xs>
            <Link to="/login" className="linkStyle">
              Login
            </Link>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default SetPassword;

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

const errorAlert = {
  background: "#f50057",
  color: "#fff",
  padding: "10px",
  display: "block",
  borderRadius: "4px",
};
