import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { BrowserRouter as Router } from "react-router-dom";

import store from "./store";
import Routes from "./routes";

import HeaderTemplate from "./components/template/header";
import FooterTemplate from "./components/template/FooterTemplate";

import VideoOptions from "./components/VideoOptions/VideoOptions";
import "./index.css";
import "react-loading-skeleton/dist/skeleton.css";
import Theme from "./theme";
import io from "socket.io-client";
import CallNotification from "./components/ui/modal/callModal";

import ReviewModal from "./components/reaviewModal/ReviewModal";
import { PageGrid } from "./app.styles";

import { SHOWLOGIN, SHOWSIGNUP } from "./constants/actions";
import { API_URL, ssEvents } from "./constants/api";
import { Cookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageModal from "./components/ImageModal/ImageModal";

import { useAudioCallSetup } from "./webRTC/utils/useAudioCallSetup";
import { EstablishingAudioConnection } from "./components/audioChat/loadingScreen";

import Login from "./components/auth/Login/Login";
import Signup from "./components/auth/NewSignUp/SignUp";
import { subscribeUser } from "./subscription";
import MobileSearch from "./components/template/SearchComponet/MobileSearch";

import useAuth from "./utils/useAuth";
import ProfileMediaModal from "./components/MediaFeeds/ProfileMediaModal";
import ShareModal from "./components/home/modals/ShareModal";

const App = () => {
  useAuth();

  const cookies = new Cookies();
  const socketOptions = { transports: ["websocket", "polling"] };
  const socket = io.connect(API_URL, socketOptions);
  // const socket = io.connect(API_URL);
  const [open, setOpen] = useState(false);
  const [meetingRoomId, setMeetingRoomId] = useState(null);
  const show = useSelector((state) => state.imageModal.show);
  const showReview = useSelector((state) => state.review.show);
  const showLogin = useSelector((state) => state.login.show);
  const showSignup = useSelector((state) => state.signup.show);
  const videoCallModal = useSelector((state) => state.videoCallModal);
  const searchvalue = useSelector((state) => state.searchvalue.searchval);
  const user = useSelector((state) => state.auth.user);
  // **push notification**
  useEffect(() => {
    const userSlug = cookies.get("user")?.slug;
    subscribeUser(userSlug);
  }, [cookies.get("user")?.slug]);

  const setUserLogin = () => {
    store.dispatch({
      type: SHOWLOGIN,
      payload: true,
    });
  };

  const unsetUserLogin = () => {
    store.dispatch({
      type: SHOWLOGIN,
      payload: false,
    });
  };

  const setUserSignup = () => {
    store.dispatch({
      type: SHOWSIGNUP,
      payload: true,
    });
  };

  const unSetUserSignup = () => {
    store.dispatch({
      type: SHOWSIGNUP,
      payload: false,
    });
  };

  socket.on("calling", (data) => {
    const local_user_id = localStorage.getItem("local_user_id");
    if (local_user_id === data?.data?.expert_id) {
      setMeetingRoomId(data?.data?.roomId);
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 60000);
    }
  });
  socket.on("connect", function (_socket) {
    console.log("Transport being used: " + socket.io.engine.transport.name);
  });
  useEffect(() => {
    if (user?.expertCategories?.length === 0) {
      toast.info(
        " Update your Expert Category Field to be Addeded to the list !",
        {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  }, [user?.expertCategories]);

  useAudioCallSetup();

  return (
    <Theme>
      <Router>
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {open ? (
          <>
            <CallNotification openModal={true} videoCallId={meetingRoomId} />
          </>
        ) : null}
        {/* <Donation /> */}
        <Login
          unsetUserLogin={unsetUserLogin}
          show={showLogin}
          setUserSignup={setUserSignup}
        />
        <Signup
          unSetUserSignup={unSetUserSignup}
          show={showSignup}
          setUserLogin={setUserLogin}
        />
        {videoCallModal?.show && <VideoOptions />}
        {show && <ImageModal />}
        <ProfileMediaModal />
        <ShareModal />
        {showReview && <ReviewModal />}
        <PageGrid>
          <HeaderTemplate
            setUserLogin={setUserLogin}
            setUserSignup={setUserSignup}
          />
          <div>
            {searchvalue.length > 0 && <MobileSearch />}
            <Routes />
            <div id="audio-chatroom-container"></div>
            <div id="audio-chatroom-streams"></div>
            <audio
              crossOrigin="anonymous"
              muted
              autoPlay
              id="audio-chatroom-notifications-element"
            ></audio>
            <EstablishingAudioConnection />
          </div>

          {/* {<FooterTemplate />} */}
        </PageGrid>
      </Router>
    </Theme>
  );
};

export default App;
