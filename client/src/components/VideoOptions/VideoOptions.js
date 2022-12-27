import axios from "axios";
import "./VideoOptions.css";
import { API_URL, CLIENT_ROOT_URL } from "../../constants/api";
import { VIDEOCALL_CHANGE } from "../../constants/actions";
import { videoCallRequest } from "../../actions/videoCallModal";
import {
  sendMaillNotification,
  sendMessageToUser,
} from "../../actions/messenger";
import { Cookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Zoom from "../../assets/zoom.png";
import Video from "../../assets/video-player.png";
import { sendNotification } from "../../subscription";

const cookies = new Cookies().getAll();

const VideoOptions = () => {
  const dispatch = useDispatch();

  const videoCallModal = useSelector((state) => state.videoCallModal);

  let emailNotificationData = {
    recieverName: `${videoCallModal?.expert?.profile?.firstName} ${videoCallModal?.expert?.profile?.lastName}`,
    message: null,
    senderName: `${cookies?.user?.firstName} ${cookies?.user?.lastName}`,
    recieverEmail: videoCallModal?.expert?.email,
    url: CLIENT_ROOT_URL + `messages/chat/${cookies.user._id}`,
    baseUrl: CLIENT_ROOT_URL,
    endpoint: "sendZoomNotification",
  };

  let conversationStarter = {
    username: videoCallModal?.expert?._id,
    recieverSlug: videoCallModal?.expert?.slug,
    senderSlug: cookies?.user?.slug,
    firstName: cookies?.user?.firstName,
    lastName: cookies?.user?.lastName,
    text: `Hi, ${cookies?.user?.firstName} has invited you to a video session`,
    link: null,
    quote: null,
    share: null,
  };

  const videoOption = async () => {
    const videoLink = await videoCallRequest({
      expert: videoCallModal.expert,
    });

    conversationStarter.link = videoLink;
    conversationStarter.text = `Hi, ${cookies?.user?.firstName} has invited you to a video session`;
    emailNotificationData.message = `Hi, ${cookies?.user?.firstName} has invited you to a video session`;

    dispatch(sendMessageToUser(conversationStarter));
    sendMaillNotification(
      emailNotificationData,
      emailNotificationData.endPointUrl
    );
    let pushNotificationData = {
      title: `${conversationStarter.firstName} started a video session`,
      description: conversationStarter.text,
      userSlug: conversationStarter.recieverSlug,
      action: "open meeting",
      senderSlug: `${conversationStarter.senderSlug}`,
      endUrl: `/`,
      redirectUrl: conversationStarter.link,
    };

    //send email notifications
    sendNotification(pushNotificationData);
    dispatch({
      type: VIDEOCALL_CHANGE,
      payload: { show: false },
    });
    toast.success(" a video call invite has been Sent", {
      position: "top-center",
      theme: "dark",
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const closeModal = () => {
    dispatch({
      type: VIDEOCALL_CHANGE,
      payload: { show: false },
    });
  };

  const ZoomOption = async () => {
    const { data } = await axios.post(`${API_URL}/zoom/meeting/`);

    conversationStarter.link = data.join_url;
    conversationStarter.text = `Hi, ${cookies?.user?.firstName} has invited you to a zoom call`;
    emailNotificationData.message = `Hi, ${cookies?.user?.firstName} has invited you to a zoom call`;

    dispatch(sendMessageToUser(conversationStarter));
    sendMaillNotification(
      emailNotificationData,
      emailNotificationData.endPointUrl
    );
    let pushNotificationData = {
      title: `${conversationStarter.firstName} started a zoom meeting`,
      description: conversationStarter.text,
      userSlug: conversationStarter.recieverSlug,
      action: "join meeting",
      senderSlug: `${conversationStarter.senderSlug}`,
      endUrl: `/zoom/${conversationStarter.link.split("/").slice(2).join("/")}`,
      redirectUrl: conversationStarter.link,
    };

    sendNotification(pushNotificationData);
    dispatch({
      type: VIDEOCALL_CHANGE,
      payload: { show: false },
    });
    toast.success("a zoom invite has been sent", {
      position: "top-center",
      theme: "dark",
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    window.open(data.join_url, "_blank");
  };

  return (
    videoCallModal?.show && (
      <div className="Login-opt">
        <div className="login-container">
          <div className="close-icon" onClick={closeModal}>
            <div className="close-icon-main"> X</div>
          </div>

          <div className="wrapper2">
            {" "}
            <div className="loginButton2 github2" onClick={videoOption}>
              <img loading="lazy" src={Video} alt="" className="icon-login" />
              Video Session
            </div>
            <div className="loginButton2 twitter2" onClick={ZoomOption}>
              <img loading="lazy" src={Zoom} alt="" className="icon-login" />
              Zoom Meeting
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default VideoOptions;
