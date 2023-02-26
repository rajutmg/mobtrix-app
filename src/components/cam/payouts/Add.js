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

const Add = () => {
  useEffect(() => {
    getUtilData();
    getCountriesData();
    // eslint-disable-next-line
  }, []);

  const [user] = useContext(UserContext);
  const defaultPayout = {
    client_id: "",
    country_id: "",
    operator: "",
    payout: "",
  };

  const [payout, setPayout] = useState(defaultPayout);
  const [client, setClient] = useState([]);
  const [countries, setCountries] = useState([]);
  const [toast, setToast] = useState(false);

  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);

  const url = `${localStorage.api}/payout`;
  const clienturl = `${localStorage.api}/client/list`;
  const countryurl = `${localStorage.api}/countries`;
  const history = useHistory();

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getUtilData = async () => {
    let res = await axios.get(clienturl, headers);
    setClient(res.data.data);
  };
  const getCountriesData = async () => {
    let res = await axios.get(countryurl, headers);
    setCountries(res.data.data);
  };

  const addPayout = async (e) => {
    e.preventDefault();
    let res = await axios.post(url, payout, headers).catch((error) => {
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
    setPayout(defaultPayout);
    setToast(res.data.message);
    history.push(`/cam/payouts/edit/${res.data.data.id}`)
  };

  return (
    <div className="mt-3">
      <h2>Add Payout</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={addPayout}>
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
                value={payout.client_id}
                onChange={(e) =>
                  setPayout({ ...payout, client_id: e.target.value })
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

          {/*country*/}
          <Grid item xs={5}>
            <FormControl fullWidth error={message.country_id ? true : false}>
              <InputLabel id="demo-simple-select-label" required>
                Country
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="client-select"
                name="country_id"
                value={payout.country_id}
                onChange={(e) =>
                    setPayout({ ...payout, country_id: e.target.value })
                }
              >
                {countries.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{message.country_id ?? ""}</FormHelperText>
            </FormControl>
          </Grid>

         {/*Operator*/}
         <Grid item xs={10} sm={5}>
            <TextField
              id="outlined-basic"
              name="operator"
              fullWidth
              label="Operator"
              error={message.operator ? true : false}
              helperText={message.operator ?? ""}
              value={payout.operator}
              onChange={(e) =>
                setPayout({ ...payout, operator: e.target.value })
              }
              required
            />
          </Grid>

          {/*Payout source*/}
          <Grid item xs={10} sm={5}>
            <TextField
              id="outlined-basic"
              name="payout"
              fullWidth
              label="Payout"
              error={message.payout ? true : false}
              helperText={message.payout ?? ""}
              value={payout.payout}
              onChange={(e) =>
                setPayout({ ...payout, payout: e.target.value })
              }
              required
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
