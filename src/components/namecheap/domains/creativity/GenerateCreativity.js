import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../../context/UserContext";
import { getValidationErrors } from "../../../../utils/FormValidator";
import SimpleSnackbar from "../../../../layouts/feedback/SimpleSnackbar";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function GenerateCreativity({ domainId, domain }) {
  const url = `${localStorage.api}/namecheap/vhost`;
  const clienturl = `${localStorage.api}/client/list`;
  const [user] = useContext(UserContext);
  const [vhost, setVhost] = useState({
    client: "",
    creativity: "",
    domain: domain,
  });
  const [client, setClient] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({});
  const [toast, setToast] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    getClients();
    // eslint-disable-next-line
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage({});
  };

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const getClients = async () => {
    let res = await axios.get(clienturl, headers);
    setClient(res.data.data);
  };

  const addRole = async (e) => {
    e.preventDefault();
    let res = await axios.post(url, { ...vhost, domain: domain }, headers);

    if (res.data.status === "fail") {
      getValidationErrors(res.data.errors, setMessage);
      return false;
    }
    setToast(res.data.message);
    setMessage({});
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" size="small" onClick={handleOpen}>
        Generate Creativity
      </Button>
      <SimpleSnackbar toast={toast} setToast={setToast} />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Generate Creativity {`${domainId}`}</h2>

            <form onSubmit={addRole} noValidate autoComplete="off">
              {/* Client */}
              <Autocomplete
                value={vhost.client}
                onChange={(event, newValue) => {
                  setVhost({ ...vhost, client: newValue });
                }}
                id="client-autocomplete"
                options={client.map((item) => item.name)}
                style={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client"
                    fullWidth
                    error={message.client ? true : false}
                    helperText={message.client ?? ""}
                  />
                )}
              />

              {/* creativity */}
              <div className="mb-2">
                <TextField
                  id="creativity"
                  style={{ width: "100%" }}
                  fullWidth
                  label="Creativity"
                  error={message.creativity ? true : false}
                  helperText={message.creativity ?? ""}
                  value={vhost.creativity}
                  onChange={(e) => setVhost({ ...vhost, creativity: e.target.value })}
                />
              </div>

              {/* domain */}
              <div className="mb-2">
                <TextField
                  id="domain"
                  style={{ width: "100%" }}
                  fullWidth
                  label="Domain"
                  variant="filled"
                  value={domain}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                style={{ float: "right" }}
              >
                Generate
              </Button>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "-20%",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "5px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxWidth: "60%",
    minWidth: "30%",
    outline: "none",
  },
}));
