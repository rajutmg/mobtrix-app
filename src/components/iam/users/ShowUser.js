import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";
import { useParams } from "react-router-dom";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";

const ShowUser = () => {
  const [user] = useContext(UserContext);
  const { id } = useParams();
  const url = `${localStorage.api}/user/${id}`;
  const [showUser, setShowUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getUserData();
    // eslint-disable-next-line
  }, []);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getUserData = async () => {
    let res = await axios.get(url, headers).catch((error) => {
      return error.response;
    });
    setLoading(false);
    console.log(res.data);

    if (res.data.status === "fail") {
      setError(res.data.message);
      return false;
    }
    setError(false);
    setShowUser(res.data.data);
  };

  if (loading || error) {
    return (
      <div>
        {loading ? "Loading ..." : ""}
        {error ? error : ""}
      </div>
    );
  }

  return (
    <div>
      <h2>Show User</h2>

      <Avatar
        alt={showUser.username}
        src={showUser.avatar}
        style={{ minHeight: "150px", width: "150px" }}
        className="mb-3"
      />
      <Grid container spacing={3}>
        <Grid item xs={6} sm={4}>
          <TextField
            id="outlined-required"
            fullWidth
            label="First Name"
            value={showUser.fname}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            id="outlined-required"
            fullWidth
            label="Last Name"
            value={showUser.lname}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            id="outlined-required"
            fullWidth
            label="Email"
            value={showUser.email}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={6} sm={4}>
          <TextField
            id="outlined-required"
            fullWidth
            label="Email Verified"
            value={
              showUser.email_verified_at
                ? new Date(showUser.email_verified_at).toDateString()
                : "Not Verified"
            }
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            id="outlined-required"
            fullWidth
            label="Role"
            value={showUser.role}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            id="outlined-required"
            fullWidth
            label="Joined date"
            value={
              showUser.created_at
                ? new Date(showUser.created_at).toDateString()
                : "N/A"
            }
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ShowUser;
