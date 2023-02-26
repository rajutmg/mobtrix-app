import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";

const SearchResult = () => {
  const { value } = useParams();
  const url = `${localStorage.api}/search/${value}`;
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const [clients, setClients] = useState({});
  const [projects, setProjects] = useState({});

  useEffect(() => {
    getSearchedItem();
    // eslint-disable-next-line
  }, [value]);

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getSearchedItem = async () => {
    let res = await axios.get(url, headers);
    const { clients, projects } = res.data.data;
    setClients(clients);
    setProjects(projects);
    setLoading(false);
  };


  if (loading) {
    return (
      <Typography align="center" component="div">
        <CircularProgress />
      </Typography>
    );
  }

  return (
    <Card>
      <CardContent>

        {/* Client search result*/}
        <Typography variant="h6">Clients</Typography>
        <ul>
          {clients.map((item, indx) => (
            <li key={indx}>
              <Link to={`/client/${item.id}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
        {clients.length === 0 ? "No Clients found." : null}

        <Divider style={{ margin: "1rem 0" }} />

        {/* Projects search result*/}
        <Typography variant="h6">Projects</Typography>
        <ul>
          {projects.map((item, indx) => (
            <li key={indx}>
              <Link to={`/project/${item.id}`}>{item.name}</Link>
            </li>
          ))}
        </ul>
        {projects.length === 0 ? "No Clients found." : null}
      </CardContent>
    </Card>
  );
};

export default SearchResult;
