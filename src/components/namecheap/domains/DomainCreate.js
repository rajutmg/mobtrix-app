import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { getValidationErrors } from "../../../utils/FormValidator";
import Alert from "../../../layouts/feedback/Alert";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import { useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";

const DomainCreate = () => {
  useEffect(() => {
    getTrafficSource();
    // eslint-disable-next-line
  }, []);

  const [user] = useContext(UserContext);
  const url = `${localStorage.api}/domains`;
  const defaultDomain = {
    domain: "",
    source: "",
    is_blacklisted: "",
  };

  const [domain, setDomain] = useState(defaultDomain);
  const [traffic, setTraffic] = useState([]);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);
  const history = useHistory();

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const addDomain = async (e) => {
    e.preventDefault();
    let res = await axios.post(url, domain, headers).catch((error) => {
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
    setDomain(defaultDomain);
    setToast(res.data.message);
    history.push(`/namecheap/domains/edit/${res.data.data.id}`);
  };

  const getTrafficSource = async () => {
    let res = await axios.get(`${localStorage.api}/traffic`, headers);
    const { data } = res.data.data;
    setTraffic(data);
  };

  return (
    <div className="mt-3">
      <h2>Add Domain</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={addDomain}>
        <Grid container spacing={3}>
          {/*Operator*/}
          <Grid item xs={10} sm={5}>
            <TextField
              id="outlined-basic"
              name="domain"
              fullWidth
              label="Domain"
              error={message.domain ? true : false}
              helperText={message.domain ?? ""}
              value={domain.domain}
              onChange={(e) => setDomain({ ...domain, domain: e.target.value })}
              required
            />
          </Grid>

          {/*source*/}
          <Grid item xs={10} sm={5}>
            <FormControl fullWidth error={message.Type ? true : false}>
              <InputLabel id="demo-simple-select-label">Traffic source</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="source"
                value={domain.source}
                onChange={(e) => setDomain({ ...domain, source: e.target.value })}
              >
                {/*select option*/}
                {traffic.map((item, key) => (
                  <MenuItem key={key} value={item.id}>
                    {item.traffic_source}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{message.Type ?? ""}</FormHelperText>
            </FormControl>
          </Grid>

          {/*Type*/}
          <Grid item xs={10} sm={5}>
            <FormControl fullWidth error={message.Type ? true : false}>
              <InputLabel id="demo-simple-select-label">Blacklisted</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="is_blacklisted"
                value={domain.is_blacklisted}
                onChange={(e) => setDomain({ ...domain, is_blacklisted: e.target.value })}
              >
                <MenuItem value="1">Yes</MenuItem>
                <MenuItem value="0">No</MenuItem>
              </Select>
              <FormHelperText>{message.Type ?? ""}</FormHelperText>
            </FormControl>
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

export default DomainCreate;
