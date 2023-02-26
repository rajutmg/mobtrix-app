import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const RegisterModal = ({ registerDomain, open, setOpen, loading }) => {
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Register
        {loading ? (
          <CircularProgress
            style={{
              color: "#ffebee",
              width: "20px",
              height: "20px",
              marginLeft: "1rem",
            }}
          />
        ) : (
          ""
        )}
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
            <h2 id="transition-modal-title">Confirm Purchase</h2>
            <p id="transition-modal-description">
              Are you sure you want to register domain?
            </p>

            <div>
              <Button
                variant="contained"
                color="primary"
                className="mr-2"
                size="small"
                onClick={registerDomain}
              >
                Confirm{" "}
              </Button>

              <Button
                variant="contained"
                color="default"
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
};

export default RegisterModal;

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
