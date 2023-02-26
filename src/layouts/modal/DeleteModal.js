import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import Button from "@material-ui/core/Button";

export default function TransitionsModal({modalIsOpen, setmodalIsOpen, item, deleteItem }) {
  const classes = useStyles();

  const handleClose = () => {
    setmodalIsOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={modalIsOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalIsOpen}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Delete</h2>
            <p id="transition-modal-description">
              Are you sure you want to delete ?
            </p>

            <div style={{float:"right"}}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              className="mr-2"
              onClick={(e)=>deleteItem(item.id)}
            >
              Confirm
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              onClick={handleClose}
            >
              Cancel
            </Button>
            </div>
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
    outline: 'none'
  },
}));

