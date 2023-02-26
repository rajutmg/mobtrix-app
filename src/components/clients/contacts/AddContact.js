import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";
import { getValidationErrors } from "../../../utils/FormValidator";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function AddContact({ openAdd, setOpenAdd }) {
  const classes = useStyles();
  const { id } = useParams();
  const [user] = useContext(UserContext);
  let url = `${localStorage.api}/contact`;

  const defaultContact = {
    contact_name: "",
    email: "",
    client_id: id
  };

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };
  const [message, setMessage] = useState({});
  const [contact, setContact] = useState(defaultContact);

  const handleClose = () => {
    setOpenAdd(false);
    setMessage({});
  };

  const addContact = async (e) => {
    e.preventDefault();
    let res = await axios.post(url, contact, headers).catch((error) => {
      return error.response;
    });
    if (res.data.statusCode === 403) {
      console.log(res.data.message);
      return false;
    }

     if (res.data.status === "fail") {
      getValidationErrors(res.data.errors,setMessage);
      return false;
    }
    window.location.reload();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openAdd}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openAdd}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Add Contact</h2>
            <form noValidate autoComplete="off" onSubmit={addContact}>
              <div className="mb-2">
                <TextField
                  fullWidth
                  required
                  error={message.contact_name ? true : false}
                  helperText={message.contact_name ?? ""}
                  name="contact_name"
                  value={contact.contact_name}
                  label="Contact Name"
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      contact_name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-2">
                <TextField
                  name="email"
                  fullWidth
                  required
                  error={message.email ? true: false}
                  helperText={message.email ?? ""}
                  value={contact.email}
                  label="Email"
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-2">
                <TextField
                  fullWidth
                  required
                  error={message.role ? true : false}
                  helperText={message.role ?? ""}
                  name="role"
                  value={contact.role}
                  label="Role"
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      role: e.target.value,
                    })
                  }
                />
              </div>

              <div style={{ float: "right" }}>
                <Button
                  variant="contained"
                  size="small"
                  className="mr-2"
                  onClick={handleClose}
                >
                  Cancel
                </Button>

                <Button type="submit" variant="contained" size="small">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

AddContact.proptype = {
  openAdd: PropTypes.bool.isRequired,
  setOpenAdd: PropTypes.func.isRequired,
};

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
    minWidth: "40%",
    outline: 'none'
  },
}));
