import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import AccessControl from "../../../utils/AccessControl";
import Alert from "../../../layouts/feedback/Alert";

import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const ShowRole = () => {
  const defaultRole = {
    name: "",
    created_at: "",
    permissions: [],
    user_id: "",
  };

  const [user] = useContext(UserContext);
  const { id } = useParams();
  const url = `${localStorage.api}/role/${id}`;
  const permissionurl = `${localStorage.api}/permission`;

  const [role, setRole] = useState(defaultRole);
  const [permission, setPermission] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    getRoledetails();
    // eslint-disable-next-line
  }, []);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getRoledetails = async () => {
    let res = await axios.get(url, headers).catch((error) => {
      return error.response;
    });
    let res1 = await axios.get(permissionurl, headers).catch((error) => {
      return error.response;
    });

    if (res.data.status === "fail" || res1.data.status === "fail") {
      setError(res.data.message);
      setRole(res.data.data);
      setLoading(false);
      return false;
    }

    setPermission(res1.data.data);
    let roleData = res.data.data;
    roleData["user_id"] = user.user.id;
    setRole(roleData);
    setLoading(false);
  };

  const updateRolePermission = async (e) => {
    e.preventDefault();
    let res = await axios.put(url, role, headers).catch((error) => {
      return error.response;
    });
    if (res.data.statusCode === 403) {
      setError(res.data.message);
      return false;
    }

    setToast(res.data.message);
  };

  const onToggle = (id) => {
    let toggleValue = { ...role };
    if (role.permissions.includes(id)) {
      let index = role.permissions.indexOf(id);
      toggleValue.permissions.splice(index, 1);
      setRole(toggleValue);
      return false;
    }
    toggleValue.permissions.push(id);
    setRole(toggleValue);
  };

  if (loading) {
    return <div>{loading ? <p>Loading ...</p> : ""} </div>;
  }

  if (role === null) {
    return <div>Role not found.</div>;
  }

  return (
    <div>
      <h3>Show Role</h3>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form onSubmit={updateRolePermission}>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={6}>
            <TextField
              id="outlined-required"
              fullWidth
              label="Role Name"
              name="name"
              value={role.name}
              onChange={(e) => setRole({ ...role, name: e.target.value })}
            />
          </Grid>
        </Grid>

        <h3>
          Permissions{" "}
          {role.name === "Super Admin"
            ? "(Has access to all permissions )"
            : ""}
        </h3>

        {/*List permissions*/}
        <Grid container spacing={3}>
          {permission.map((item) => (
            <Grid item xs={6} sm={3} key={item.id}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={role.permissions.includes(item.id)}
                      name="checkedB"
                      color="primary"
                      onChange={(e) => onToggle(item.id)}
                    />
                  }
                  label={item.name}
                />
              </FormGroup>
            </Grid>
          ))}
        </Grid>

        <AccessControl hasAccess="role update" checkID={user.user.id}>
          <Grid item xs={12} className="mt-3">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
            >
              Update
            </Button>
          </Grid>
        </AccessControl>
      </form>
    </div>
  );
};

export default ShowRole;
