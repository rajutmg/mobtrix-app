import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { PermissionContext } from "../../context/PermissionContext";
import Alert from "../../layouts/feedback/Alert";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";

import FormValidator from "../../utils/FormValidator";
import SimpleSnackbar from "../../layouts/feedback/SimpleSnackbar";

const EditClient = () => {
  useEffect(() => {
    getClientUtils();
    getClientdata();
    // eslint-disable-next-line
  }, []);

  const defaultClient = {
    name: "",
    client_code: "",
    manager_id: "",
    country_id: "",
    details: "",
  };
  const defaultMessage = {
    name: "",
    client_code: "",
    manager_id: "",
    country_id: "",
  };
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const url = `${localStorage.api}/clients/${id}`;
  const countries = `${localStorage.api}/countries`;
  const managers = `${localStorage.api}/managers`;

  const [user] = useContext(UserContext);
  const [permission] = useContext(PermissionContext);
  const [country, setCountry] = useState([]);
  const [manager, setManager] = useState([]);
  const [client, setClient] = useState(defaultClient);
  const [message, setMessage] = useState(defaultMessage);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState(null);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const updateClient = async (e) => {
    e.preventDefault();
    let formErrors = FormValidator(client, rules);
    if (formErrors) {
      setMessage(formErrors);
      return false;
    }
    setMessage(defaultMessage);
    let res = await axios.put(url, client, headers);
    if (res.data.statusCode === 403) {
      setError(res.data.message);
      return false;
    }

    setToast(res.data.message);
  };

  const getClientdata = async () => {
    let res = await axios.get(url, headers);
    setClient(res.data.data);
    setLoading(false);
  };

  const getClientUtils = async () => {
    let res = await axios.get(countries, headers);
    setCountry(res.data.data);

    let res1 = await axios.get(managers, headers);
    setManager(res1.data.data);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (client === null) {
    return <p>Client not found.</p>;
  }

  if (user.user.id !== client.manager_id && !["Super Admin","Admin"].includes(permission.role) ) {
    return <p>You do not have the permission.</p>;
  }

  return (
    <div className="mt-3">
      <h2>Edit Client</h2>
      {error ? <Alert error={error} /> : ""}
      <SimpleSnackbar toast={toast} setToast={setToast} />
      <form noValidate autoComplete="off" onSubmit={updateClient}>
        <Grid container spacing={3}>
          {/*Client Name*/}
          <Grid item xs={10} sm={8}>
            <TextField
              required
              id="outlined-required"
              name="name"
              fullWidth
              label="Client Name"
              error={message.name ? true : false}
              helperText={message.name ?? ""}
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
            />
          </Grid>
          
          {/*Client Name*/}
          <Grid item xs={10} sm={8}>
            <TextField
              required
              id="outlined-required"
              name="client_code"
              fullWidth
              label="Client Code"
              error={message.client_code ? true : false}
              helperText={message.client_code ?? ""}
              value={client.client_code}
              onChange={(e) => setClient({ ...client, client_code: e.target.value })}
            />
          </Grid>

          {/*Manager*/}
          <Grid item xs={5}>
            <FormControl fullWidth error={message.manager_id ? true : false}>
              <InputLabel id="demo-simple-select-label" required>
                Manager
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="manager-select"
                name="manager_id"
                value={client.manager_id}
                onChange={(e) =>
                  setClient({ ...client, manager_id: e.target.value })
                }
              >
                {manager.map((item, key) => (
                  <MenuItem key={key} value={item.id}>{item.username}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{message.manager_id ?? ""}</FormHelperText>
            </FormControl>
          </Grid>

          {/*Country*/}
          <Grid item xs={5}>
            <FormControl fullWidth error={message.country_id ? true : false}>
              <InputLabel id="demo-simple-select-label" required>
                Country
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="client-select"
                name="country_id"
                value={client.country_id}
                onChange={(e) =>
                  setClient({ ...client, country_id: e.target.value })
                }
              >
                {country.map((item, key) => (
                  <MenuItem key={key} value={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{message.country_id ?? ""}</FormHelperText>
            </FormControl>
          </Grid>

          {/*Details*/}
          <Grid item xs={10} sm={8}>
            <TextField
              id="outlined-textarea"
              name="details"
              label="Details"
              placeholder=""
              multiline
              fullWidth
              value={client.details}
              onChange={(e) =>
                setClient({ ...client, details: e.target.value })
              }
            />
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

const rules = {
  name: "Client name cannot be empty.",
  manager_id: "Manager cannot be empty.",
  country_id: "Country cannot be empty.",
};
export default EditClient;
