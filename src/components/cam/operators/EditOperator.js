import React, { useState,useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import {useHistory} from 'react-router-dom';
import { getValidationErrors } from "../../../utils/FormValidator";
import Alert from "../../../layouts/feedback/Alert";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const EditOperator = () => {
  
  const [user] = useContext(UserContext);
  const {id} = useParams();
  const url = `${localStorage.api}/country/operators/${id}`;
  const geturl = `${localStorage.api}/country/operatorsvalue/${id}`;
  const defaultOperators = {
    label:"",
    value:"",

  };

  const [operators, setOperators] = useState(defaultOperators);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);
  const history = useHistory();


  useEffect(() => {
    getOperators();
    // eslint-disable-next-line
  }, []);


  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };


  const getOperators = async () => {
    let res = await axios.get(geturl, headers);
    const {data, status, message} = res.data;
    if (!status) {
      setError(message);
      return false;
    }

    setOperators(data);
    setLoading(false);
  }

// return false;

  const editOperators = async (e) => {
    e.preventDefault();
    let res = await axios.patch(url, operators, headers).catch((error) => {
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

    history.push(`/cam/operators/view/${res.data.data.country_operators_id}`)
    setToast(res.data.message);
  };

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="mt-3">
      <h2>Edit Operator Values</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={editOperators}>
        <Grid container spacing={3}>
     

          {/* Country */}
          <Grid item xs={10} sm={6}>
            <TextField
              id="outlined-basic"
              name="label"
              fullWidth
              label="Label"
              error={message.label ? true : false}
              helperText={message.label ?? ""}
              value={operators.label}
              onChange={(e) =>
                setOperators({ ...operators, label: e.target.value })
              }
              required
            />
          </Grid>

          {/* Country */}
          <Grid item xs={10} sm={6}>
            <TextField
              id="outlined-basic"
              name="value"
              fullWidth
              label="Value"
              error={message.value ? true : false}
              helperText={message.value ?? ""}
              value={operators.value}
              onChange={(e) =>
                setOperators({ ...operators, value: e.target.value })
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

export default EditOperator;