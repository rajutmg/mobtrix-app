import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";
import { useParams } from "react-router-dom";
import Alert from "../../../layouts/feedback/Alert";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";

const EditUser = () => {
  const defaultUser = {
    fname: "",
    lname: "",
    email: "",
    role_id: "",
  };

  const [user] = useContext(UserContext);
  const { id } = useParams();
  const url = `${localStorage.api}/user/${id}`;
  const roleurl = `${localStorage.api}/role`;

  const [showUser, setShowUser] = useState(defaultUser);
  const [roles, setRole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    getUserData();
    getRoles();
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
    if (res.data.status === "fail") {
      setError(res.data.message);
      return false;
    }
    setError(false);
    setShowUser(res.data.data);
  };

  const getRoles = async () => {
    let res = await axios.get(roleurl, headers).catch((error) => {
      return error.response;
    });
    setRole(res.data.data);
  };

  const editUser =async (e) => {
    e.preventDefault();
    let res = await axios.put(url, showUser, headers).catch((error)=>{
      return error.response
    }); 
    if (res.data.statusCode === 403) {
      setError(res.data.message);
      return  false;
    }
    setToast(res.data.message);   
  };

  if (loading) {
    return (
      <div>
        {loading ? "Loading ..." : ""}
      </div>
    );
  }

  return (
    <div>
      <h2>Edit User</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={editUser}>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={4}>
            <TextField
              id="outlined-required"
              name='fname'
              label="First Name"
              value={showUser.fname}
              onChange={(e) =>
                setShowUser({ ...showUser, fname: e.target.value })
              }
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <TextField
              id="outlined-required"
              name='lname'
              label="Last Name"
              value={showUser.lname}
              onChange={(e) =>
                setShowUser({ ...showUser, lname: e.target.value })
              }
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={6} sm={4}>
            <TextField
              id="outlined-required"
              name='email'
              label="Email"
              value={showUser.email}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth error={false}>
              <InputLabel id="demo-simple-select-label" required>
                Role
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="role-select"
                name="role_id"
                value={showUser.role_id}
                onChange={(e) =>
                  setShowUser({ ...showUser, role_id: e.target.value })
                }
              >
                {roles.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText></FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default EditUser;
