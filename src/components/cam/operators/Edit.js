import React, { useState,useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { getValidationErrors } from "../../../utils/FormValidator";
import Alert from "../../../layouts/feedback/Alert";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import { useParams } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";

const Edit = () => {
  
  const [user] = useContext(UserContext);
  const {id} = useParams();
  const url = `${localStorage.api}/operators/${id}`;
  const countryurl = `${localStorage.api}/countries`;
  const defaultOperators = {
    country_id:"",
    countryCallingCode:"",
    trunkPrefix:"",
    internationalPrefix:"",
    countryminlength:"",
    countrymaxlength:"",
    countrymaxlengthRaw:"",

  };

  const [operators, setOperators] = useState(defaultOperators);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);


  useEffect(() => {
    getOperators();
    getCountriesData();
    // eslint-disable-next-line
  }, []);


  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getCountriesData = async () => {
    let res = await axios.get(countryurl, headers);
    setCountries(res.data.data);
  };

  const getOperators = async () => {
    let res = await axios.get(url, headers);
    const {data, status, message} = res.data;
    if (!status) {
      setError(message);
      return false;
    }

    setOperators(data);
    setLoading(false);
  }

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

    setToast(res.data.message);
  };

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="mt-3">
      <h2>Edit Operators</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={editOperators}>
        <Grid container spacing={3}>
 
 {/*country*/}
 <Grid item xs={10} sm={6}>
            <FormControl fullWidth error={message.country_id ? true : false}>
              <InputLabel id="demo-simple-select-label" required>
                Country
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="client-select"
                name="country_id"
                value={operators.country_id}
                onChange={(e) =>
                  setOperators({ ...operators, country_id: e.target.value })
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

          {/* Country */}
          <Grid item xs={10} sm={6}>
            <TextField
              id="outlined-basic"
              name="countryCallingCode"
              fullWidth
              label="Country Code"
              error={message.countryCallingCode ? true : false}
              helperText={message.countryCallingCode ?? ""}
              value={operators.countryCallingCode}
              onChange={(e) =>
                setOperators({ ...operators, countryCallingCode: e.target.value })
              }
              required
            />
          </Grid>

          {/* Country */}
          <Grid item xs={10} sm={6}>
            <TextField
              id="outlined-basic"
              name="trunkPrefix"
              fullWidth
              label="Trunk Prefix"
              error={message.trunkPrefix ? true : false}
              helperText={message.trunkPrefix ?? ""}
              value={operators.trunkPrefix}
              onChange={(e) =>
                setOperators({ ...operators, trunkPrefix: e.target.value })
              }
              required
            />
          </Grid>

          {/* Country */}
          <Grid item xs={10} sm={6}>
            <TextField
              id="outlined-basic"
              name="internationalPrefix"
              fullWidth
              label="International Prefix"
              error={message.internationalPrefix ? true : false}
              helperText={message.internationalPrefix ?? ""}
              value={operators.internationalPrefix}
              onChange={(e) =>
                setOperators({ ...operators, internationalPrefix: e.target.value })
              }
              required
            />
          </Grid>

           {/* Country */}
           <Grid item xs={10} sm={6}>
            <TextField
              id="outlined-basic"
              name="countryminlength"
              fullWidth
              label="Country min length"
              error={message.countryminlength ? true : false}
              helperText={message.countryminlength ?? ""}
              value={operators.countryminlength}
              onChange={(e) =>
                setOperators({ ...operators, countryminlength: e.target.value })
              }
              required
            />
          </Grid>

          {/* Country */}
          <Grid item xs={10} sm={6}>
            <TextField
              id="outlined-basic"
              name="countrymaxlength"
              fullWidth
              label="Country max length"
              error={message.countrymaxlength ? true : false}
              helperText={message.countrymaxlength ?? ""}
              value={operators.countrymaxlength}
              onChange={(e) =>
                setOperators({ ...operators, countrymaxlength: e.target.value })
              }
              required
            />
          </Grid>

          {/* Country */}
          <Grid item xs={10} sm={6}>
            <TextField
              id="outlined-basic"
              name="countrymaxlengthRaw"
              fullWidth
              label="Country max length Raw"
              error={message.countrymaxlengthRaw ? true : false}
              helperText={message.countrymaxlengthRaw ?? ""}
              value={operators.countrymaxlengthRaw}
              onChange={(e) =>
                setOperators({ ...operators, countrymaxlengthRaw: e.target.value })
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

export default Edit;