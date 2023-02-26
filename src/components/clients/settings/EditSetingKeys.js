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

const EditSetingKeys = ({
  openEdit,
  setOpenEdit,
  currentSetting,
  setCurrentSetting,
  clientid
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

  const updateSetting = async (e) => {
    e.preventDefault();
    url = `${localStorage.api}/client/settings/${currentSetting.id}`;
    let data = {client_id:clientid, label:currentSetting.label}
    let res = await axios.patch(url, data, headers).catch((error) => {
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
            <form noValidate autoComplete="off" onSubmit={updateSetting}>
              <div className="mb-2">
                <TextField
                  fullWidth
                  required
                  error={message.label ? true : false}
                  helperText={message.label ?? ""}
                  name="label"
                  value={currentSetting.label}
                  label="Label"
                  onChange={(e) =>
                    setCurrentSetting({
                      ...currentSetting,
                      label: e.target.value,
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

EditSetingKeys.proptype = {
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

export default EditSetingKeys;
