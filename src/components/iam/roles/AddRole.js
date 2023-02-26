import React, { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export default function AddRole({ roles, setRoles }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const [user] = useContext(UserContext);
  const [message, setMessage] = useState("");
  const url = `${localStorage.api}/role`;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  let headers = {
    headers: { Authorization: `${user.token_type} ${user.access_token}` },
  };

  const addRole = async (e) => {
    e.preventDefault();
    if (role === "") {
      setMessage("Role name cannot be empty");
      return false;
    }

    let res = await axios.post(url, { name: role }, headers);
    if (res.data.status === 'fail') {
      setMessage(res.data.message);
      return false;
    }
    setRoles([...roles, res.data.data]);
    setRole("");
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" size="small" onClick={handleOpen}>
        Add Role
      </Button>
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
            <h2 id="transition-modal-title">Add Role</h2>

            <form onSubmit={addRole} noValidate autoComplete="off">
              <div className="mb-2">
                <TextField
                  id="standard-basic"
                  style={{ width: "100%" }}
                  label="Role Name"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <p style={{ color: "#f50057" }}>{message}</p>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                style={{ float: "right" }}
              >
                Submit
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
