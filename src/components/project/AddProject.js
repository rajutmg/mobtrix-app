import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import {useHistory} from 'react-router-dom';
import { getValidationErrors } from "../../utils/FormValidator";
import Alert from '../../layouts/feedback/Alert';

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";

const AddProject = () => {
  useEffect(() => {
    getClients();
    // eslint-disable-next-line
  }, []);

  const [user] = useContext(UserContext);
  const defaultProject = {
    name: "",
    manager_id: user.user.id,
    client_id: "",
    public_url: "",
    details: "",
  };

  const history = useHistory();
  const [client, setClient] = useState([]);
  const [project, setProject] = useState(defaultProject);
  const [message, setMessage] = useState({});
  const [error, setError] = useState(null);

  const url = `${localStorage.api}/projects`;
  const clienturl = `${localStorage.api}/client/list`;

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getClients = async () => {
    let res = await axios.get(clienturl, headers);
    setClient(res.data.data);
  };

  const addCampaign = async (e) => {
    e.preventDefault();
    let res = await axios.post(url, project, headers).catch((error) => {
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
    setProject(defaultProject);
    history.push(`/project/${res.data.data.id}`)
  };

  return (
    <div className="mt-3">
      <h2>Add Project</h2>
      {error ? (<Alert error={error} />) :""}
      <form noValidate autoComplete="off" onSubmit={addCampaign}>
        <Grid container spacing={3}>
          <Grid item xs={10} sm={8}>
            <TextField
              required
              id="outlined-required"
              name="name"
              fullWidth
              label="Project Name"
              error={message.name ? true : false}
              helperText={message.name ?? ""}
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
            />
          </Grid>

          <Grid item xs={5}>
            <FormControl fullWidth error={message.manager_id ? true : false}>
              <InputLabel id="demo-simple-select-label" required>
                Manager
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="manager-select"
                name="manager_id"
                value={project.manager_id}
                onChange={(e) =>
                  setProject({ ...project, manager_id: e.target.value })
                }
              >
                <MenuItem value={user.user.id}>{user.user.username}</MenuItem>
                ))
              </Select>
              <FormHelperText>{message.manager_id ?? ""}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={5}>
            <FormControl fullWidth error={message.client_id ? true : false}>
              <InputLabel id="demo-simple-select-label" required>
                Client
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="client-select"
                name="client_id"
                value={project.client_id}
                onChange={(e) =>
                  setProject({ ...project, client_id: e.target.value })
                }
              >
                {client.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{message.client_id ?? ""}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={10} sm={8}>
            <TextField
              id="outlined-basic"
              name="public_url"
              fullWidth
              label="Public URL"
              error={message.public_url ? true : false}
              helperText={message.public_url ?? ""}
              value={project.public_url}
              onChange={(e) =>
                setProject({ ...project, public_url: e.target.value })
              }
              required
            />
          </Grid>

          <Grid item xs={10} sm={8}>
            <TextField
              required
              id="outlined-textarea"
              name="details"
              label="Details"
              placeholder=""
              error={message.details ? true : false}
              helperText={message.details ?? ""}
              multiline
              fullWidth
              value={project.details}
              onChange={(e) =>
                setProject({ ...project, details: e.target.value })
              }
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

export default AddProject;
