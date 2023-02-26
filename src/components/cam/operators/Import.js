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
    getCountriesData();
    // eslint-disable-next-line
  }, []);

  const url = `${localStorage.api}/operators/importJson`;
  const countryurl = `${localStorage.api}/countries`;
  const [user] = useContext(UserContext);
  const [operators, setOperators] = useState({ file: "" });
  const [toast, setToast] = useState(false);
  const [error, setError] = useState({});
  const [message, setMessage] = useState({});
  const [countries, setCountries] = useState([]);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getCountriesData = async () => {
    let res = await axios.get(countryurl, headers);
    setCountries(res.data.data);
  };

  const importOperators = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("file", operators.file);
    fd.append("country_id", operators.country_id);

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
      <form noValidate autoComplete="off" onSubmit={importOperators}>

         {/*country*/}
         <Grid item xs={4} className="mb-3">
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


       <Grid item xs={5} className="mb-3">
        


        <InputLabel
            id="demo-simple-select-label"
            error={error.file ? true : false}
            required
          >
            Operators
          </InputLabel>
          <FormControl error={error.file ? true : false}>
            <Input
              label="Operators"
              type="file"
              name="file"
              onChange={(e) =>
                setOperators({ ...operators, file: e.target.files[0] })
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
