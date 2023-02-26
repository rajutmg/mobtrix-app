import React, { Fragment, useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { getValidationErrors } from "../../../utils/FormValidator";
import Alert from "../../../layouts/feedback/Alert";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import { useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Autocomplete from '@material-ui/lab/Autocomplete';

const Add = () => {

  useEffect(() => {
    getDomainsData();
    // eslint-disable-next-line
  }, []);

  const url = `${localStorage.api}/settings`;
  const clientSettings = `${localStorage.api}/client/settings/`;
  const [user] = useContext(UserContext);
  const defaultSettting = {
    url: "",
    client_id: "",
    label: [],
  };

  const history = useHistory();
  const [settings, setSettings] = useState(defaultSettting);
  const [toast, setToast] = useState(false);

  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);
  const [client, setClient] = useState([]);
  const [domains, setDomains] = useState([]);
  useEffect(() => {
    getUtilData();
    // eslint-disable-next-line
  }, []);
  const clienturl = `${localStorage.api}/client/list`;
  const domainurl = `${localStorage.api}/domain/list`;

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getUtilData = async () => {
    let res = await axios.get(clienturl, headers);
    setClient(res.data.data);
  };

  const getDomainsData = async () => {
    let res = await axios.get(domainurl, headers);
    setDomains(res.data.data);
  };

  const getSettings = async (clientid) => {
    let res = await axios.get(`${clientSettings}${clientid}`, headers);
    if (res.data.status === "fail") {
      setMessage(res.data.message);
      return false;
    }
    const { data } = res.data;
    for (let i = 0; i < data.length; i++) {
      data[i]["value"] = "";
    }
    setSettings({ ...settings, label: data, client_id: clientid });
  };

  const addSettings = async (e) => {
    e.preventDefault();
    let res = await axios.post(url, settings, headers).catch((error) => {
      return error.response;
    });
    const { data, statusCode, status } = res.data;
    if (statusCode === 403) {
      setError(res.data.message);
      return false;
    }

    if (status === "fail") {
      if (data !== null) {
        getValidationErrors(res.data.errors, setMessage);
        return false;
      }
    }

    /*set field to default*/
    setSettings(defaultSettting);
    setMessage({});
    history.push(`/cam/settings/view/${res.data.data}`)
    setToast(res.data.message);
    history.push(`/cam/settings/list`)
  };

  return (
    <div className="mt-3">
      <h2>Add Settings</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={addSettings}>
        <Grid container spacing={3}>
          {/* domain */}
          <Grid item xs={10} sm={6}>


          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={domains}
            onChange={(e, newValue) =>setSettings({ ...settings, url: newValue }) }
            renderInput={(params) => (
            <TextField
            {...params}
              id="outlined-basic"
              name="url"
              fullWidth
              label="URL"
              error={message.url ? true : false}
              helperText={message.url ?? ""}
              value={settings.url}
              onChange={(e) =>
                setSettings({ ...settings, url: e.target.value })
              }
              required
            />

            )}
          />



            
          </Grid>

          {/*client*/}
          <Grid item xs={5}>
            <FormControl fullWidth error={message.client_id ? true : false}>
              <InputLabel id="demo-simple-select-label" required>
                Client
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="client-select"
                name="client_id"
                value={settings.client_id}
                onChange={(e) => {
                  setSettings({ ...settings, client_id: e.target.value });
                  getSettings(e.target.value);
                }}
              >
                {client.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{message.client_id ?? ""}</FormHelperText>
            </FormControl>
          </Grid>

          {settings.label.map((items, key) => (
            <Fragment key={key}>
              <Grid item xs={10} sm={6}>
                <TextField
                  id="outlined-basic"
                  name="label"
                  fullWidth
                  label="Label"
                  error={message.label ? true : false}
                  helperText={message.label ?? ""}
                  value={items.label}
                  variant="filled"
                  InputProps={{
                    readOnly: true,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={10} sm={6}>
                <TextField
                  id="outlined-basic"
                  name="value"
                  fullWidth
                  label="Value"
                  error={message[`label.${key}.value`] ? true : false}
                  helperText={message[`label.${key}.value`] ?? ""}
                  value={settings.value}
                  onChange={(e) => {
                    let newLabel = [...settings["label"]];
                    newLabel[key]["value"] = e.target.value;
                    setSettings({ ...settings, label: newLabel });
                  }}
                  required
                />
              </Grid>
            </Fragment>
          ))}

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
export default Add;
