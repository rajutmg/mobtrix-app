import React, { useState,useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import { getValidationErrors } from "../../../utils/FormValidator";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import Input from "@material-ui/core/Input";

const Import = () => {

  useEffect(() => {
    getUtilData();
    // eslint-disable-next-line
  }, []);

  const url = `${localStorage.api}/settings/import`;
  const clienturl = `${localStorage.api}/client/list`;
  const [user] = useContext(UserContext);
  const [settings, setSettings] = useState({ file: "", client_id:"" });
  const [toast, setToast] = useState(false);
  const [error, setError] = useState({});
  const [client, setClient] = useState([]);
  const [message, setMessage] = useState({});

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getUtilData = async () => {
    let res = await axios.get(clienturl, headers);
    setClient(res.data.data);
  };
  const importSettings = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("file", settings.file);
    fd.append("client_id", settings.client_id);

    let res = await axios.post(url, fd, headers);
    if (res.data.status === "fail") {
      setError(res.data.errors);
      return false;
    }
    if (res.data.status === "fail") {
      getValidationErrors(res.data.errors, setMessage);
      return false;
    }
    setToast(res.data.message);
    console.log(message);
    return false;
  };
  return (
    <div>
      <h2>Import Setttings</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      <form noValidate autoComplete="off" onSubmit={importSettings}>
       <Grid item xs={12} className="mb-2">
         {/*client*/}
         <Grid item xs={5}>
            <FormControl fullWidth error={error.client_id ? true : false}>
              <InputLabel id="demo-simple-select-label" required>
                Client
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="client-select"
                name="client_id"
                value={settings.client_id}
                onChange={(e) =>
                  setSettings({ ...settings, client_id: e.target.value })
                }
              >
                {client.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{error.client_id ?? ""}</FormHelperText>
            </FormControl>
          </Grid>


        <InputLabel
            id="demo-simple-select-label"
            error={error.file ? true : false}
            required
          >
            Settings
          </InputLabel>
          <FormControl error={error.file ? true : false}>
            <Input
              label="Translation"
              type="file"
              name="file"
              onChange={(e) =>
                setSettings({ ...settings, file: e.target.files[0] })
              }
            />
            <FormHelperText>{error.file ?? ""}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
          >
            Import
          </Button>
        </Grid>
      </form>
    </div>
  );
};

export default Import;
