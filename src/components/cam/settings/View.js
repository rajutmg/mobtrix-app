import React, { Fragment, useState, useContext, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import { useParams } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const View = () => {
  const { id } = useParams();
  const url = `${localStorage.api}/settings/${id}`;
  const [user] = useContext(UserContext);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [setting, setSetting] = useState({ campaign_id: "", url: "" });

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  useEffect(() => {
    getSettings();
    // eslint-disable-next-line
  }, []);

  const getSettings = async () => {
    let res = await axios.get(url, headers);
    const { data, status} = res.data;
    if (status === "fail") {
      setMessage(res.data.message);
      return false;
    }
    setSetting(data);
  };

  if (message) {
    return <div>{message}</div>;
  }

  return (
    <Fragment>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      <h2>Show Settings</h2>
      <Grid container className="my-2" spacing={3}>
        <Grid item xs={6} sm={3}>
          <TextField
            label="URL"
            value={setting.url}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <TextField
            label="Campaign ID"
            value={setting.campaign_id}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <a href={`${localStorage.api}/settings/export/${id}?token=${user.access_token}`}
            target="_blank" rel="noreferrer" 
            style={{ textDecoration: "none" }}>
            <Button variant="contained" size="small">
                Export to Json
              </Button>
          </a>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <h3>Settings</h3>
        <table className="settingTable">
          <thead>
            <tr>
              <th className="settingRow">S.N</th>
              <th className="settingRow">Label</th>
              <th className="settingRow">Value</th>
            </tr>
          </thead>
          <tbody>
            {setting.label !== undefined ? (
              setting.label.map((setting, key) => (
                <tr key={key}>
                  <td className="settingRow">{key + 1 + "."}</td>
                  <td className="settingRow">{setting.label}</td>
                  <td className="settingRow">{setting.value}</td>
                </tr>
              ))
            ) : (
              <tr><td>asdasd</td></tr>
            )}
          </tbody>
        </table>
      </Grid>
    </Fragment>
  );
};

export default View;

