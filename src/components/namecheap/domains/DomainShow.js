import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import Alert from "../../../layouts/feedback/Alert";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import GenerateCreativity from "./creativity/GenerateCreativity";
import UpdateCreativity from "./creativity/UpdateCreativity";

const DomainEdit = () => {
  const { id } = useParams();

  useEffect(() => {
    getDomain();
    // eslint-disable-next-line
  }, []);

  const [user] = useContext(UserContext);
  const defaultDomain = {
    domain: "",
    traffic_source: "",
    username: "",
    is_blacklisted: "",
  };

  const [domain, setDomain] = useState(defaultDomain);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState(null);

  const url = `${localStorage.api}/domains/${id}`;

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getDomain = async () => {
    let res = await axios.get(url, headers);
    const { data, status, message } = res.data;
    if (!status) {
      setError(message);
      return false;
    }
    console.log(data);
    setDomain(data);
  };

  return (
    <div className="mt-3">
      <h2>Show domain</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      {error ? <Alert error={error} /> : ""}
      <Grid container spacing={3}>
        {/*Domain*/}
        <Grid item xs={10} sm={4}>
          <TextField fullWidth label="Domain" value={domain.domain} />
        </Grid>

        {/* Source */}
        <Grid item xs={10} sm={4}>
          <TextField fullWidth label="Source" value={domain.traffic_source} />
        </Grid>

        {/* Creater/Manager */}
        <Grid item xs={10} sm={4}>
          <TextField fullWidth label="Manager" value={domain.username} />
        </Grid>

        {/* Creater/Manager */}
        <Grid item xs={10} sm={4}>
          <TextField fullWidth label="Manager" value={domain.is_blacklisted ? "Yes" : "No"} />
        </Grid>
      </Grid>

      {/* VHOST generator*/}
      <h2 className="mt-4">Creativity and Vhost</h2>
      {checkCreativity(domain, id)}
    </div>
  );
};

export default DomainEdit;

const checkCreativity = (domain, id) => {
  if (domain.client === null || domain.creativity === null) {
    return <GenerateCreativity domainId={id} domain={domain.domain} />;
  } else {
    return (
      <ul>
        <UpdateCreativity/>
        <li>Client : {domain.client}</li>
        <li>Creativity : {domain.creativity}</li>
      </ul>
    );
  }
};
