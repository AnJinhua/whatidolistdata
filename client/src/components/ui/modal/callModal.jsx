import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useHistory } from "react-router-dom";
import CallAudio from "../../../assets/sounds/call.mp3";

export default function AlertDialog({ openModal, videoCallId }) {
  const [open, setOpen] = React.useState(openModal);
  let history = useHistory();

  const handleCallAgree = () => {
    history.push("/video-session/" + videoCallId);
  };

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Call Request</DialogTitle>
        <DialogContent>
          <audio
            crossOrigin="anonymous"
            src={CallAudio}
            autoPlay={true}
            controls={false}
            loop={true}
          ></audio>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Disagree
          </Button>
          <Button onClick={handleCallAgree} color="secondary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
