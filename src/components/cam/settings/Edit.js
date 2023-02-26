import React, { Fragment, useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { getValidationErrors } from "../../../utils/FormValidator";
import Alert from "../../../layouts/feedback/Alert";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import { useParams, useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const Edit = () => {
  const { id } = useParams();
  const url = `${localStorage.api}/settings/${id}`;
  const clienturl = `${localStorage.api}/client/list`;
  // const clientSettings = `${localStorage.api}/client/settings/`;
  const [user] = useContext(UserContext);
  const defaultSettting = {
    url: "",
    client_id: "",
    label: [],
  };

  const [settings, setSettings] = useState(defaultSettting);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);
  const [client, setClient] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getUtilData();
    getSettings();
    // eslint-disable-next-line
  }, []);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getUtilData = async () => {
    let res = await axios.get(clienturl, headers);
    setClient(res.data.data);
  };

  const getSettings = async () => {
    let res = await axios.get(url, headers);
    const { data, status } = res.data;
    if (status === "fail") {
      setMessage(res.data.message);
      return false;
    }
    setSettings(data);
    setLoading(false);
  };

  /*
  Funtion to get dynamic labels on client change 
  Not using this as of now so comment.

  const getClientSettings = async (clientid) => {
    let res = await axios.get(`${clientSettings}${clientid}`, headers);
    if (res.data.status === "fail") {
      setMessage(res.data.message);
      return false;
    }
    const { data } = res.data;
    for (let i = 0; i < data.length; i++) {
      data[i]["value"] = "";
    }
    // console.log(JSON.stringify(data));
    setSettings({ ...settings, label: data, client_id: clientid });
  };

  */

  const editSetting = async (e) => {
    e.preventDefault();
    let res = await axios.patch(url, settings, headers).catch((error) => {
      return error.response;
    });

    if (res.data.statusCode === 403) {
      setError(res.data.message);
      return false;
    }

    if (res.data.status === "fail") {
      getValidationErrors(res.data.errors, setMessage);
      return false;
    }

    /*set field to default*/
    setMessage({});
    setToast(res.data.message);
    history.push(`/cam/settings/view/${id}`)
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-3">
      <h2>Edit Settings</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={editSetting}>
        <Grid container spacing={3}>
          {/* domain */}
          <Grid item xs={10} sm={6}>
            <TextField
              id="outlined-basic"
              name="url"
              fullWidth
              label="URL"
              error={message.url ? true : false}
              helperText={message.url ?? ""}
              value={settings.url}
              variant="filled"
              InputProps={{
                readOnly: true,
              }}
              onChange={(e) =>
                setSettings({ ...settings, url: e.target.value })
              }
              required
            />
          </Grid>

          {/*client*/}
          <Grid item xs={5}>
            <FormControl
              fullWidth
              error={message.client_id ? true : false}
              disabled
            >
              <InputLabel id="demo-simple-select-label" required>
                Client
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="client-select"
                name="client_id"
                value={settings.client_id}
                variant="filled"
                onChange={(e) => {
                  setSettings({ ...settings, client_id: e.target.value });
                  // getClientSettings(e.target.value);
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
                  value={items.value}
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
export default Edit;
