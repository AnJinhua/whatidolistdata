import { AudioCallNotification } from "../../components/audioChat/callNotification";
import { toast } from "react-toastify";


export const showCallToast = async (answerCall, rejectCall, room) => {
  const timeout = 60000;
 
  //TODO play audio and stop it after timeout
  toast(
    <AudioCallNotification
      message={`${room.hosts[0].firstName} ${room.hosts[0].lastName} is inviting you to their audio chat on ${room.title}`}
      accept={answerCall}
      reject={rejectCall}
      acceptText="JOIN"
      rejectText="REJECT"
    />,
    {
      position: "top-center",
      autoClose: false, //todo set notification timeout
      className: "audio-call-notification",
      style: {
        position: "fixed",
        left: "50%",
        background: "#3498db",
        color: "white",
        textAlign: "center",
        width: "100vw",
        transform: "translateX(-50%)",
      },
    }
  );
};
