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
    getCountriesData();
    getTrafficSourceData();
    getDomainsData();
    // eslint-disable-next-line
  }, []);

  const [user] = useContext(UserContext);
  const defaultCampaign = {
    domain: "",
    client_id: "",
    country_id: "",
    traffic_id: "",
    step: "",
  };

  const [campaign, setCampaign] = useState(defaultCampaign);
  const [client, setClient] = useState([]);
  const [countries, setCountries] = useState([]);
  const [domains, setDomains] = useState([]);
  const [traffics, setTraffics] = useState([]);
  const [toast, setToast] = useState(false);

  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);

  const url = `${localStorage.api}/campaigns`;
  const clienturl = `${localStorage.api}/client/list`;
  const countryurl = `${localStorage.api}/countries`;
  const trafficurl = `${localStorage.api}/traffic`;
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

  const getCountriesData = async () => {
    let res = await axios.get(countryurl, headers);
    setCountries(res.data.data);
  };

  const getTrafficSourceData = async () => {
    let res = await axios.get(trafficurl, headers);
    setTraffics(res.data.data.data);
  };
  const addCampaign = async (e) => {
    e.preventDefault();
    let res = await axios.post(url, campaign, headers).catch((error) => {
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
    setCampaign(defaultCampaign);
    history.push(`/cam/campaign/edit/${res.data.data.id}`)
    setToast(res.data.data.message);
  };

  
  return (
    <div className="mt-3">
      <h2>Add Campaign</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={addCampaign}>
        <Grid container spacing={3}>
      
        

          {/*domain name*/}
          <Grid item xs={10} sm={10}>
          <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={domains}
            onChange={(e, newValue) =>{
              setCampaign({ ...campaign, domain: newValue }) 
            }
          }
            renderInput={(params) => (
              <TextField
              {...params}
              id="outlined-basic"
              name="domain"
              fullWidth
              label="URL"
              error={message.domain ? true : false}
              helperText={message.domain ?? ""}
              value={campaign.domain}
              InputProps={{ ...params.InputProps, type: 'search' }}
              onChange={(e) =>
                setCampaign({ ...campaign, domain: e.target.value })
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
                value={campaign.client_id}
                onChange={(e) =>
                  setCampaign({ ...campaign, client_id: e.target.value })
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
                value={campaign.country_id}
                onChange={(e) =>
                  setCampaign({ ...campaign, country_id: e.target.value })
                }
              >
                {countries.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{message.client_id ?? ""}</FormHelperText>
            </FormControl>
          </Grid>

          {/*traffic source*/}
          <Grid item xs={5}>
            <FormControl fullWidth error={message.traffic_id ? true : false}>
              <InputLabel id="demo-simple-select-label" required>
                Traffic source
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="client-select"
                name="traffic_id"
                value={campaign.traffic_id}
                onChange={(e) =>
                  setCampaign({ ...campaign, traffic_id: e.target.value })
                }
              >
                {traffics.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.traffic_source}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{message.traffic_id ?? ""}</FormHelperText>
            </FormControl>
          </Grid>

          {/*step*/}
          <Grid item xs={10} sm={5}>
            <TextField
              id="outlined-basic"
              name="step"
              fullWidth
              label="Step"
              error={message.public_url ? true : false}
              helperText={message.public_url ?? ""}
              value={campaign.step}
              onChange={(e) =>
                setCampaign({ ...campaign, step: e.target.value })
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
