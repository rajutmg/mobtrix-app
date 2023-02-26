import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { PermissionContext } from "../../context/PermissionContext";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const ShowProject = () => {
  useEffect(() => {
    getProjectData();
    // eslint-disable-next-line
  }, []);

  const defaultProject = {
    name: "",
    manager: "",
    client: "",
    public_url: "",
    details: "",
  };

  const { id } = useParams();
  const [user] = useContext(UserContext);
  const [permission] = useContext(PermissionContext);
  const url = `${localStorage.api}/projects/${id}`;
  const [project, setProject] = useState(defaultProject);
  const [loading, setLoading] = useState(true)

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getProjectData = async () => {
    let res = await axios.get(url, headers);
    setProject(res.data.data);
    setLoading(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (project === null) {
    return <p>Project not found.</p>;
  }

  if (user.user.id !== project.manager_id && !["Super Admin","Admin"].includes(permission.role) ) {
    return <p>You do not have the permission.</p>;
  }

  return (
    <Card>
      <CardContent>
        <h2>Show Project</h2>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={6}>
            <TextField
              id="outlined-required"
              fullWidth
              label="Project Name"
              value={project.name}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <TextField
              id="public_url"
              fullWidth
              label="Public URL"
              value={project.public_url}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <TextField
              id="manager"
              fullWidth
              label="Manager"
              value={project.manager}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <TextField
              id="client"
              fullWidth
              label="Client"
              value={project.client}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <TextField
              id="created_at"
              fullWidth
              label="Created at"
              value={new Date(project.created_at).toDateString()}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <TextField
              id="updated_at"
              fullWidth
              label="Updated at"
              value={new Date(project.updated_at).toDateString()}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={6} sm={6}>
            <TextField
              id="outlined-textarea"
              label="Details"
              multiline
              fullWidth
              value={project.details}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ShowProject;
