import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
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

const DomainEdit = () => {
  const {id} = useParams();

  useEffect(() => {
    getDomain();
    getTrafficSource();
    // eslint-disable-next-line
  }, []);

  const [user] = useContext(UserContext);
  const defaultDomain = {
    domain: "",
    source: "",
    is_blacklisted: "",
  };

  const [domain, setDomain] = useState(defaultDomain);
  const [toast, setToast] = useState(false);
  const [traffic, setTraffic] = useState([]);
  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);
  const history = useHistory();

  const url = `${localStorage.api}/domains`;

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getDomain = async () => {
    let res = await axios.get(`${url}/${id}`, headers);
    const {data, status, message} = res.data;
    if (!status) {
      setError(message);
      return false;
    }

    setDomain(data);
  }

  const updateDomain = async (e) => {
    e.preventDefault();
    let res = await axios.patch(`${url}/${id}`, domain, headers).catch((error) => {
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
    history.push(`/namecheap/domains`);
  };

  const getTrafficSource = async () => {
    let res = await axios.get(`${localStorage.api}/traffic`, headers);
    const { data } = res.data.data;
    setTraffic(data);
  };

  return (
    <div className="mt-3">
      <h2>Edit domain</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={updateDomain}>
        <Grid container spacing={3}>


          {/*Domain*/}
          <Grid item xs={10} sm={5}>
            <TextField
              id="outlined-basic"
              name="domain"
              fullWidth
              label="Domain"
              error={message.domain ? true : false}
              helperText={message.domain ?? ""}
              value={domain.domain}
              onChange={(e) =>
                setDomain({ ...domain, domain: e.target.value })
              }
              required
            />
          </Grid>

          {/*Source*/}
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

          <Grid item xs={5}>
            <FormControl fullWidth error={message.client_id ? true : false}>
              <InputLabel id="demo-simple-select-label" required>
                Is Blacklisted ?
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="client-select"
                name="is_blacklisted"
                value={domain.is_blacklisted}
                onChange={(e) =>
                  setDomain({ ...domain, is_blacklisted: e.target.value })
                }
              >
     
                <MenuItem key={domain.is_blacklisted} value="1">Yes</MenuItem>
                <MenuItem key={domain.is_blacklisted} value="0">No</MenuItem>

              </Select>
              <FormHelperText>{message.client_id ?? ""}</FormHelperText>
            </FormControl>
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

export default DomainEdit;
