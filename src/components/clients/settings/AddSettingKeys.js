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

export default function AddSettingKeys({ openSetting, setOpenSetting }) {
  const classes = useStyles();
  const { id } = useParams();
  const [user] = useContext(UserContext);
  let url = `${localStorage.api}/client/settings`;

  const defaultSetting = {
    label: "",
    client_id: id
  };

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };
  const [message, setMessage] = useState({});
  const [setting, setSetting] = useState(defaultSetting);

  const handleClose = () => {
    setOpenSetting(false);
    setMessage({});
  };

  const addSetting = async (e) => {
    e.preventDefault();
    let res = await axios.post(url, setting, headers).catch((error) => {
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
        open={openSetting}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openSetting}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Add Setting</h2>
            <form noValidate autoComplete="off" onSubmit={addSetting}>
              <div className="mb-2">
                <TextField
                  fullWidth
                  required
                  error={message.label ? true : false}
                  helperText={message.label ?? ""}
                  name="label"
                  value={setting.label}
                  label="Label"
                  onChange={(e) =>
                    setSetting({
                      ...setting,
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

AddSettingKeys.proptype = {
  openSetting: PropTypes.bool.isRequired,
  setOpenSetting: PropTypes.func.isRequired,
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
