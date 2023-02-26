import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { getValidationErrors } from "../../../utils/FormValidator";
import Alert from "../../../layouts/feedback/Alert";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import {useHistory} from 'react-router-dom';

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Add = () => {
  useEffect(() => {

    // eslint-disable-next-line
  }, []);

  const [user] = useContext(UserContext);
  const defaultTraffic = {
    traffic_source: "",

  };

  const [traffic, setTraffic] = useState(defaultTraffic);

  // const [country, setCountry] = useState([]);
  // const [project, setProject] = useState([]);
  // const [traffic, setTraffic] = useState([]);
  const [toast, setToast] = useState(false);

  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);

  const url = `${localStorage.api}/traffic`;
  const history = useHistory();

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };



  const addTraffic = async (e) => {
    e.preventDefault();
    let res = await axios.post(url, traffic, headers).catch((error) => {
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
    setTraffic(defaultTraffic);
    history.push(`/cam/traffic/list`)
    setToast(res.data.message);
  };

  return (
    <div className="mt-3">
      <h2>Add Traffic Source</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={addTraffic}>
        <Grid container spacing={3}>

         {/*Traffic Source*/}
         <Grid item xs={10} sm={5}>
            <TextField
              id="outlined-basic"
              name="traffic_source"
              fullWidth
              label="Traffic Source"
              error={message.traffic_source ? true : false}
              helperText={message.traffic_source ?? ""}
              value={traffic.traffic_source}
              onChange={(e) =>
                setTraffic({ ...traffic, traffic_source: e.target.value })
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
