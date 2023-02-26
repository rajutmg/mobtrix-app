import React, { useState, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { useParams, useHistory } from "react-router-dom";


const Import = () => {
  const { id } = useParams();
  const url = `${localStorage.api}/translation/import/${id}`;
  const [user] = useContext(UserContext);
  const [translation, setTranslation] = useState({ url: "", file: "" });
  const [toast, setToast] = useState(false);
  const [error, setError] = useState({});
  const history = useHistory();

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const importSettings = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("file", translation.file);
 
    let res = await axios.post(url, fd, headers);

    if (res.data.status === "fail") {
      setError(res.data.errors);
      return false;
    }
    setToast(res.data.message);
    history.push(`/cam/translation/show/${id}`)
  };

  return (
    <div>
      <h2>Import Translation</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      <form noValidate autoComplete="off" onSubmit={importSettings}>


        {/*File*/}
        <Grid item xs={12} className="mb-2">
          <InputLabel
            id="demo-simple-select-label"
            error={error.file ? true : false}
            required
          >
            Translation
          </InputLabel>
          <FormControl error={error.file ? true : false}>
            <Input
              label="Translation"
              type="file"
              name="file"
              onChange={(e) =>
                setTranslation({ ...translation, file: e.target.files[0] })
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
