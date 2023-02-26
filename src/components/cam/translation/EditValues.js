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

const EditValues = () => {

    useEffect(() => {
        getTranslation();
        // eslint-disable-next-line
      }, []);
      
  const [user] = useContext(UserContext);
  const { id } = useParams();
  const url = `${localStorage.api}/translation/values/${id}`;
  const defaultSettting = {
    lang: "",
    label: "",
    value: "",
  };

  const [translation, setTranslation] = useState(defaultSettting);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);
  const history = useHistory();


  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getTranslation = async () => {
    let res = await axios.get(url, headers);
     // return false;
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
    history.goBack()

  };

  if (loading) {
    return <p>Loading...</p>;
  }
  

  return (
    <div className="mt-3">
      <h2>Edit Translation Values</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={editTranslation}>
        <Grid container spacing={3}>
          {/* url */}
          <Grid item xs={10} sm={6}>
            <TextField
              id="outlined-basic"
              name="lang"
              fullWidth
              label="Language"
              error={message.lang ? true : false}
              helperText={message.lang ?? ""}
              value={translation.lang}
              onChange={(e) =>
                setTranslation({ ...translation, lang: e.target.value })
              }
              required
            />
          </Grid>
  

          {/* Translation Name */}
          <Grid item xs={10} sm={6}>
            <TextField
              name="label"
              fullWidth
              label="Translation label"
              error={message.label ? true : false}
              helperText={message.label ?? ""}
              value={translation.label}
              onChange={(e) =>
                setTranslation({ ...translation, label: e.target.value })
              }
              required
            />
          </Grid>

            {/* Translation Name */}
            <Grid item xs={10} sm={6}>
            <TextField
              name="value"
              fullWidth
              label="Translation value"
              error={message.value ? true : false}
              helperText={message.value ?? ""}
              value={translation.value}
              onChange={(e) =>
                setTranslation({ ...translation, value: e.target.value })
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

export default EditValues;

