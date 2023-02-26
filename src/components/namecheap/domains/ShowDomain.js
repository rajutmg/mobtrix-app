import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import ListHostRecord from "./ListHostRecord";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import AddHostRecord from "./AddHostRecord";
import Grid from "@material-ui/core/Grid";
import SimpleSnackbar from "../../../layouts/feedback/SimpleSnackbar";

import axios from "axios";

const ShowDomain = () => {
  const { domain } = useParams();
  const url = `${localStorage.api}/namecheap/record/list`;
  const [user] = useContext(UserContext);
  const [record, setRecord] = useState(null);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [toast, setToast] = useState(false);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  useEffect(() => {
    getHostRecord();
    // eslint-disable-next-line
  }, []);

  const getHostRecord = async () => {
    setLoading(true);
    setError("");
    let res = await axios.post(url, { domain: domain }, headers);
    const { data } = res;

    if (data.status === "fail") {
      setError(data.message);
      return false;
    }

    setRecord(data.data);
    setLoading(false);
  };

  const updateHostRecord = async (e) => {
    e.preventDefault();
    setIsExecuting(true);
    setError("");
    let updateURL = `${localStorage.api}/namecheap/record/update`;
    let input = {
      domain: domain,
      hostRecord: record,
    };

    let res = await axios.post(updateURL, input, headers);
    const { data } = res;

    if (data.status === "fail") {
      let errorMessage = data.error.Error;
      setError(errorMessage);
    }
    setToast(data.message);
    setIsExecuting(false);
  };

  if (error) {
    return <div>{error}</div>
  }


  if (loading || record === null) {
    return (
      <Typography align="center" component="div">
        <CircularProgress style={{ marginTop: "5%" }} />
      </Typography>
    );
  }

  return (
    <div>
      <h2>{domain}</h2>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      <AddHostRecord records={record} setRecord={setRecord}/>
      <ListHostRecord domain={domain} records={record} setRecord={setRecord} />

      {/*save button */}
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Typography className="mt-2" component="div" color="secondary">
            <div>{error}</div>
          </Typography>
        </Grid>

        <Grid item xs={4}>
          <Typography component="div" align="right" gutterBottom>
            <Button
              variant="contained"
              size="small"
              color="primary"
              className="mt-3"
              onClick={updateHostRecord}
            >
              Save{" "}
              {isExecuting ? (
                <CircularProgress
                  style={{
                    color: "#ffebee",
                    width: "20px",
                    height: "20px",
                    marginLeft: "1rem",
                  }}
                />
              ) : (
                ""
              )}
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default ShowDomain;
