import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import {useHistory} from 'react-router-dom';

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import Alert from '../../layouts/feedback/Alert';

import FormValidator from "../../utils/FormValidator";

const AddClient = () => {
  const [user] = useContext(UserContext);
  useEffect(() => {
    getClientUtils();
    // eslint-disable-next-line
  }, []);

  const defaultClient = {
    name: "",
    client_code: "",
    manager_id: user.user.id,
    country_id: "",
    details: "",
    contact_name: "",
    contact_email: ""
  };
  const defaultMessage = {
    name: "",
    manager_id: "",
    country_id: "",
    contact_name: "",
    contact_email: ""
  };

  const url = `${localStorage.api}/clients`;
  const countries = `${localStorage.api}/countries`;
  const history = useHistory();

  const [country, setCountry] = useState([]);
  const [client, setClient] = useState(defaultClient);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(defaultMessage);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const addClient = async (e) => {
    e.preventDefault();
    let errors = FormValidator(client, rules);
    if (errors) {
      setMessage(errors);
      return false;
    }
    setMessage(defaultMessage);
    let res = await axios.post(url, client, headers);
    if (res.data.statusCode === 403) {
      setError(res.data.message);
      return false;
    }
    setClient(defaultClient);
    history.push(`/client/${res.data.data.id}`)
  };

  const getClientUtils = async () => {
    let res = await axios.get(countries, headers);
    setCountry(res.data.data);
  };

  return (
    <div className="mt-3">
      <h2>Add Client</h2>
      {error ? (<Alert error={error} />) :""}

      <form noValidate autoComplete="off" onSubmit={addClient}>
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
                  <MenuItem value={user.user.id}>{user.user.username}</MenuItem>
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
                {country.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
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
              Submit
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
export default AddClient;
