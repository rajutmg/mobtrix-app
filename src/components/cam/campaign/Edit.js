import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getValidationErrors } from "../../../utils/FormValidator";
import Alert from "../../../layouts/feedback/Alert";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import Autocomplete from "@material-ui/lab/Autocomplete";

const Add = () => {
  const { id } = useParams();

  useEffect(() => {
    getUtilData();
    getCountriesData();
    getTrafficSourceData();
    getDomainsData();
    getCampaign();
    // eslint-disable-next-line
  }, []);

  const [user] = useContext(UserContext);
  const defaultCampaign = {
    campaign_tracking: "",
    domain: "",
    client_id: "",
    country_id: "",
    traffic_id: "",
    step: "",
  };

  const [campaign, setCampaign] = useState(defaultCampaign);
  const [client, setClient] = useState([]);
  const [countries, setCountries] = useState([]);
  const [traffics, setTraffics] = useState([]);
  const [domains, setDomains] = useState([]);
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(true);

  const [inputValue, setInputValue] = React.useState("");
  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);

  const url = `${localStorage.api}/campaigns`;
  const clienturl = `${localStorage.api}/client/list`;
  const countryurl = `${localStorage.api}/countries`;
  const trafficurl = `${localStorage.api}/traffic`;
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

  const getCountriesData = async () => {
    let res = await axios.get(countryurl, headers);
    setCountries(res.data.data);
  };

  const getTrafficSourceData = async () => {
    let res = await axios.get(trafficurl, headers);
    setTraffics(res.data.data.data);
  };

  const getCampaign = async () => {
    let res = await axios.get(`${url}/${id}`, headers);
    const { data, status, message } = res.data;
    if (!status) {
      setError(message);
      return false;
    }
    setLoading(false);
    setCampaign(data);
  };

  const updateCampaign = async (e) => {
    e.preventDefault();
    let res = await axios.patch(`${url}/${id}`, campaign, headers).catch((error) => {
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
    setToast(res.data.message);
  };

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="mt-3">
      <h2>Edit Campaign</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={updateCampaign}>
        <Grid container spacing={3}>
          {/*domain name*/}
          <Grid item xs={10} sm={10}>
            <Autocomplete
              value={campaign.domain}
              onChange={(event, newValue) => {
                setCampaign({ ...campaign, domain: newValue });
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              id="controllable-states-demo"
              options={domains}
              style={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  name="domain"
                  label="URL"
                  error={message.domain ? true : false}
                  helperText={message.domain ?? ""}
                  InputProps={{ ...params.InputProps, type: "search" }}
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
                onChange={(e) => setCampaign({ ...campaign, client_id: e.target.value })}
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
                onChange={(e) => setCampaign({ ...campaign, country_id: e.target.value })}
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

          {/*traffic source*/}
          <Grid item xs={5}>
            <FormControl fullWidth error={message.traffic_source ? true : false}>
              <InputLabel id="demo-simple-select-label" required>
                Traffic source
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="client-select"
                name="traffic_id"
                value={campaign.traffic_id}
                onChange={(e) => setCampaign({ ...campaign, traffic_id: e.target.value })}
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
              onChange={(e) => setCampaign({ ...campaign, step: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" size="small">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default Add;
