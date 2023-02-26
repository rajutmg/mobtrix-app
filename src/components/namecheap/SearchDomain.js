import React, { Fragment, useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import Pricing from "./Pricing";

const SearchDomain = () => {
  const [user] = useContext(UserContext);
  const url = `${localStorage.api}/namecheap/search`;
  const [domain, setDomain] = useState("");
  const [checkResult, setCheckResult] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const checkDomain = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (domain === "" || domain === null) {
      setError("Domain cannot be empty.");
      setLoading(false);
      return false;
    }
    let res = await axios.post(url, { checkDomain: domain }, headers);
    setLoading(false);
    if(res.data === "" || res.data.status === "fail"){
      setError(res.data.message ?? "Please enter valid domain name.");
      return false;
    }
    setCheckResult(res.data);
  };

  return (
    <Fragment>
      <form noValidate autoComplete="off" onSubmit={checkDomain}>
        <Grid container spacing={3} className="mt-4">
          <Grid item xs={12} sm={8}>
            <TextField
              required
              id="standard-required"
              label="Search Domain"
              fullWidth
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              helperText="Checks the availability of domains"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Button type="submit" variant="contained" color="primary">
              check
              {loading ? (
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
          </Grid>
        </Grid>
      </form>

      <Grid container spacing={3}>
        {error ? (
          <Grid item xs={12}>
            <Typography color="secondary">{error}</Typography>
          </Grid>
        ) : (
          ""
        )}

        {/*Domain check Message*/}
        <Grid item xs={12}>
          <div>
            {checkResult.Available === "true" ? (
              <Fragment>
                <p>Congratulations ! Domain is available.</p>
                <Pricing domain={checkResult.Domain} pricing={checkResult.price}/>
              </Fragment>
            ) : (
              ""
            )}
          </div>

          <div>
            {checkResult.Available === "false" ? (
              <p>Sorry ! Domain is not available.</p>
            ) : (
              ""
            )}
          </div>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default SearchDomain;
