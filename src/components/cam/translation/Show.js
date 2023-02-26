import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
// import { PermissionContext } from "../../../context/PermissionContext";
import axios from "axios";
import Alert from "../../../layouts/feedback/Alert";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import { useParams, Link } from "react-router-dom";
import DeleteModal from "../../../layouts/modal/DeleteModal";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Show = () => {
  const [user] = useContext(UserContext);
  const { id } = useParams();
  const { name } = useParams();
  const url = `${localStorage.api}/translationvalues/${id}`;
  const defaultSettting = {
    label: "",
    value: "",
    lang: "",
  };
  let language = "";

  const [translationvalues, setTranslationvalues] = useState(defaultSettting);
  const [loading, setLoading] = useState(true);
  // const [permission] = useContext(PermissionContext);
  // const history = useHistory();
  const [toast, setToast] = useState(false);
  const [error, setError] = useState(null);
  const [currentValues, setCurrentValues] = useState({});
  const [deleteValues, setDeleteValues] = useState(false);

  useEffect(() => {
    getTranslationvalues();
    // eslint-disable-next-line
  }, []);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getTranslationvalues = async () => {
    // store url in new variable so that it is not effected when language is added
    let tvURL = url;
    if (language) {
      tvURL = `${tvURL}?lang=${language}`
    }

    let res = await axios.get(tvURL, headers);
    const { data, status, message } = res.data;
    if (status === "fail") {
      setError(message);
      return false;
    }

    setTranslationvalues(data);
    setLoading(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const onDeleteValues = (data) => {
    setCurrentValues(data);
    setDeleteValues(true);
  };

  const deleteValues2 = async (id) => {
    let res = await axios.delete(
      `${localStorage.api}/translationvalues/${id}`,
      headers
    );
    if (res.data.status === "fail") {
      console.log(res.data.message);
    }
    setDeleteValues(false);
    window.location.reload();
  };

  return (
    <div className="mt-3">
      <h2>Translation Values</h2>

      <Link
        to={{
          pathname: `/cam/translation/addvalues/${id}`,
        }}
        style={{ textDecoration: "none" }}
      >
        <Button variant="contained" size="small" className="mr-3">
          add Translation values
        </Button>
      </Link>

      <Link
        to={{
          pathname: `/cam/translation/import/${id}`,
        }}
        style={{ textDecoration: "none" }}
      >
        <Button variant="contained" size="small" className="mr-3">
          import Translation values
        </Button>
      </Link>

      

      <Link to="/templates/translations.json" target="_blank" download style={{ textDecoration: "none" }}>
        <Button variant="contained" size="small" className="mr-3">
            Download template
          </Button>
      </Link>

      <a href={`${localStorage.api}/translation/export/${id}?token=${user.access_token}`}
         target="_blank" rel="noreferrer"  
         style={{ textDecoration: "none" }}>
        <Button variant="contained" size="small">
            Export to Json
          </Button>
      </a>


      <DeleteModal
        modalIsOpen={deleteValues}
        setmodalIsOpen={setDeleteValues}
        item={currentValues}
        deleteItem={deleteValues2}
      />
      <h2>{name}</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}

      {/* Languages here*/}
      <Button
          variant="contained"
          color="default"
          size="small"
          className="mr-2"
          onClick={(e) => {
            getTranslationvalues();
          }}
        >
          All
        </Button>
      {translationvalues.lang.map((item, key) => (
        <Button
          variant="contained"
          color="default"
          size="small"
          className="mr-2"
          key={key}
          onClick={(e) => {
            language = item;
            getTranslationvalues();
          }}
        >
          {item.toUpperCase()}
        </Button>
      ))}

      {/* {JSON.stringify(translationvalues)} */}
      {translationvalues.tvalues.map((item, key) => (
        <Grid container className="my-2" spacing={3} key={key}>
          <Grid item xs={6} sm={3} key={key}>
            <TextField
              label="Language"
              value={item.lang}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Label"
              value={item.label}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Value"
              value={item.value}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <div>
              <Link
                to={{
                  pathname: `/cam/translation/editvalues/${item.id}`,
                }}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className="mr-2"
                >
                  Edit
                </Button>
              </Link>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={(e) => onDeleteValues(item)}
              >
                Delete
              </Button>
            </div>
          </Grid>
        </Grid>
      ))}
    </div>
  );
};

export default Show;
