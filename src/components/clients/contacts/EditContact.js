import React, { useState, useContext } from "react";
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
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const EditContact = ({
  openEdit,
  setOpenEdit,
  currentContact,
  setCurrentContact,
  contactApproved,
}) => {
  const classes = useStyles();
  const [user] = useContext(UserContext);
  let url = `${localStorage.api}/contact`;
  const [message, setMessage] = useState({});

  const handleClose = () => {
    setMessage({});
    setOpenEdit(false);
  };

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const updateContact = async (e) => {
    e.preventDefault();
    url = `${localStorage.api}/contact/${currentContact.id}`;
    let res = await axios.put(url, currentContact, headers).catch((error) => {
      return error.response;
    });
    if (res.data.status === "fail") {
      getValidationErrors(res.data.errors, setMessage);
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
        open={openEdit}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openEdit}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Edit Contact</h2>
            <form noValidate autoComplete="off" onSubmit={updateContact}>
              <div className="mb-2">
                <TextField
                  fullWidth
                  required
                  error={message.contact_name ? true : false}
                  helperText={message.contact_name ?? ""}
                  name="contact_name"
                  value={currentContact.contact_name}
                  label="Contact Name"
                  onChange={(e) =>
                    setCurrentContact({
                      ...currentContact,
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
                  error={message.email ? true : false}
                  helperText={message.email ?? ""}
                  value={currentContact.email}
                  label="Email"
                  onChange={(e) =>
                    setCurrentContact({
                      ...currentContact,
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
                  value={currentContact.role}
                  label="Role"
                  onChange={(e) =>
                    setCurrentContact({
                      ...currentContact,
                      role: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-2">
                {contactApproved === undefined || contactApproved.id===currentContact.id ? (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Approval Authorization</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={currentContact.approval_authorization}
                      onChange={(e) =>
                        setCurrentContact({
                          ...currentContact,
                          approval_authorization: e.target.value,
                        })
                      }
                    >
                      <MenuItem value={1}>Yes</MenuItem>
                      <MenuItem value={0}>No</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  ""
                )}

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
                  Update
                </Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

EditContact.proptype = {
  openEdit: PropTypes.bool.isRequired,
  setOpenEdit: PropTypes.func.isRequired,
  currentContact: PropTypes.object.isRequired,
  setCurrentContact: PropTypes.func.isRequired,
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
    outline: "none",
  },
}));

export default EditContact;
