import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { getValidationErrors } from "../../../utils/FormValidator";
import Alert from "../../../layouts/feedback/Alert";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import {useHistory,useParams} from 'react-router-dom';

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const AddValues = () => {
  useEffect(() => {
  
    // eslint-disable-next-line
  }, []);
  
  const [user] = useContext(UserContext);
  const defaultTranslation = {
   
    lang: "",
    label: "",
    value:"",
  };

  const [translation, setTranslation] = useState(defaultTranslation);

  const [toast, setToast] = useState(false);

  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);
  const { id } = useParams();
  const url = `${localStorage.api}/translationvalues/${id}`;
 
  const history = useHistory();

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };




  const addTranslation = async (e) => {
    e.preventDefault();
    let res = await axios.post(url, translation, headers).catch((error) => {
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
    setTranslation(defaultTranslation);
    setToast(res.data.message);
    history.push(`/cam/translation/show/${id}`)
  };

  return (
    <div className="mt-3">
      <h2>Add Translation Values</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <form noValidate autoComplete="off" onSubmit={addTranslation}>
        <Grid container spacing={3}>
     
         {/*Lang*/}
         <Grid item xs={10} sm={5}>
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

          {/*Label*/}
          <Grid item xs={10} sm={5}>
            <TextField
              id="outlined-basic"
              name="label"
              fullWidth
              label="Label"
              error={message.label ? true : false}
              helperText={message.label ?? ""}
              value={translation.label}
              onChange={(e) =>
                setTranslation({ ...translation, label: e.target.value })
              }
              required
            />
          </Grid>

          
          {/*Values*/}
          <Grid item xs={10} sm={5}>
            <TextField
              id="outlined-basic"
              name="value"
              fullWidth
              label="Value"
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

export default AddValues;
