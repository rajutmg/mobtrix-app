import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { getValidationErrors } from "../../../utils/FormValidator";
import Alert from "../../../layouts/feedback/Alert";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import {useHistory} from 'react-router-dom';

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import Autocomplete from '@material-ui/lab/Autocomplete';

const Add = () => {
  useEffect(() => {
    getUtilData();
    getDomainsData();
    // eslint-disable-next-line
  }, []);

  const [user] = useContext(UserContext);
  const defaultTranslation = {
    client_id: "",
    name: "",
    url: "",
  };

  const [translation, setTranslation] = useState(defaultTranslation);
  const [client, setClient] = useState([]);
  const [toast, setToast] = useState(false);
  const [domains, setDomains] = useState([]);
  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);

  const url = `${localStorage.api}/translation/create`;
  const clienturl = `${localStorage.api}/client/list`;
  const domainurl = `${localStorage.api}/domain/list`;
  const history = useHistory();

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
  
  const addTranslation = async (e) => {
    e.preventDefault();
    let res = await axios.post(url, translation, headers).catch((error) => {
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
    setTranslation(defaultTranslation);
    setToast(res.data.message);
    history.push(`/cam/translation/show/${res.data.data.id}`)
  };

  return (
    <div className="mt-3">
      <h2>Add Translation</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={addTranslation}>
        <Grid container spacing={3}>
     
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
                value={translation.client_id}
                onChange={(e) =>
                  setTranslation({ ...translation, client_id: e.target.value })
                }
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



         {/*Operator*/}
         <Grid item xs={10} sm={5}>
            <TextField
              id="outlined-basic"
              name="name"
              fullWidth
              label="Name"
              error={message.name ? true : false}
              helperText={message.name ?? ""}
              value={translation.name}
              onChange={(e) =>
                setTranslation({ ...translation, name: e.target.value })
              }
              required
            />
          </Grid>

          {/*Payout source*/}
          <Grid item xs={10} sm={5}>
          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={domains}
            onChange={(e, newValue) =>setTranslation({ ...translation, url: newValue }) }
            renderInput={(params) => (
            <TextField
            {...params}
            id="outlined-basic"
            name="url"
            fullWidth
            label="URL"
            error={message.url ? true : false}
            helperText={message.url ?? ""}
            value={translation.url}
            onChange={(e) =>
              setTranslation({ ...translation, url: e.target.value })
            }
            required
            />

            )}
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

export default Add;
