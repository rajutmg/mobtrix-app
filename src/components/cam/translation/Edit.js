import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { getValidationErrors } from "../../../utils/FormValidator";
import Alert from "../../../layouts/feedback/Alert";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import { useParams, useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";

const Edit = () => {
  const [user] = useContext(UserContext);
  const { id } = useParams();
  const url = `${localStorage.api}/translation/${id}`;
  const domainurl = `${localStorage.api}/domain/list`;
  const history = useHistory();
  const defaultSettting = {
    url: ""
  };

  const [translation, setTranslation] = useState(defaultSettting);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);
  const [domains, setDomains] = useState([]);
  const [inputValue, setInputValue] = React.useState("");

  useEffect(() => {
    getTranslation();
    getDomainsData();
    // eslint-disable-next-line
  }, []);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };


  const getDomainsData = async () => {
    let res = await axios.get(domainurl, headers);
    setDomains(res.data.data);
  };

  const getTranslation = async () => {
    let res = await axios.get(url, headers);

    const { data, status, message } = res.data;
    if (!status) {
      setError(message);
      return false;
    }

    setTranslation(data);
    setLoading(false);
  };

  const editTranslation = async (e) => {
    e.preventDefault();
    let res = await axios.patch(url, translation, headers).catch((error) => {
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
    history.push(`/cam/translation/list`)
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-3">
      <h2>Edit Translation</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={editTranslation}>
        <Grid container spacing={3}>
          {/* url */}
          <Grid item xs={10} sm={6}>

          <Autocomplete
              value={translation.url}
              onChange={(event, newValue) => {
                setTranslation({ ...translation, url: newValue });
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
                  name="url"
                  label="URL"
                  error={message.url ? true : false}
                  helperText={message.url ?? ""}
                  InputProps={{ ...params.InputProps, type: "search" }}
                  required
                />
              )}
            />
          </Grid>

          {/* Translation Name */}
          <Grid item xs={10} sm={6}>
            <TextField
              name="name"
              fullWidth
              label="Translation name"
              error={message.name ? true : false}
              helperText={message.name ?? ""}
              value={translation.name}
              onChange={(e) =>
                setTranslation({ ...translation, name: e.target.value })
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

