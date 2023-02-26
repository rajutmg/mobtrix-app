import React, { useState, useEffect,useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

const Oauth = () => {
  const url = `${localStorage.api}/oauth2/google/login`;

  //can fetch token and email
  const { email } = useParams();
  const [loading, setLoading] = useState(true);
  const [, setUser]  = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    oauthLogin();
    // eslint-disable-next-line
  }, []);

  const oauthLogin = async () => {
    let res = await axios.post(url, { email: email });
    if (res.data.status === 'fail') {
      alert("Failed to login user. Try again.");
      return false;
    }
    setLoading(false);
    setUser(res.data.data);
    localStorage.setItem("mobtrix_data",JSON.stringify(res.data.data));
    history.push("/dashboard");
  };

  return (
    <div style={oauthStyle}>
      {loading ? (
        <div style={oauthStyle}>
          <CircularProgress /> <p>login user ...</p>
        </div>
      ) : (
        <p>User logged in ...</p>
      )}
    </div>
  );
};

const oauthStyle = {
  textAlign: "center",
  marginTop: "10%",
};
export default Oauth;
