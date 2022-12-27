import {
  API_URL,
  // CLIENT_ROOT_URL
} from "../constants/api";
import { errorHandler } from "./index";

import { useDispatch } from "react-redux";

import { START_AUDIO_CALL_RINGER } from "../constants/actions";

import Peer from "peerjs";

// const [peerId, setPeerId] = useState("");
// const remoteVideoRef = useRef(null);
const remoteVideoRef = "";
// const currentUserVideoRef = useRef(null);
const currentUserVideoRef = "";
// const peerInstance = useRef(null);
let peerInstance;

let peer;

export function peerSetup({ local_user_id }) {
  peer = new Peer(local_user_id, {
    host: process.env.PEER_URL || "donnies-list-2-25ld4.ondigitalocean.app",
    path: "/myapp",
  });

  peer.on("open", (id) => {
    console.log(id);
    // setPeerId(id);
  });
}

export function peerAudioReceiveCall({ local_user_id }) {
  return function (dispatch) {
    peer.on("call", (call) => {
      // dispatch({ type: START_AUDIO_CALL_RINGER });
    });

    peerInstance.current = peer;
  };
}

export function peerAudioPlaceCall({ remotePeerId }) {
  const call = (myPeerId, remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    const peer = new Peer(myPeerId, {
    host: process.env.PEER_URL || "donnies-list-2-25ld4.ondigitalocean.app",
    path: "/myapp",
  });

    peer.on("open", (id) => {
      // setPeerId(id);
      console.log(id);
    });

    getUserMedia({ audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peer.call(remotePeerId, mediaStream);

      // call.on("stream", (remoteStream) => {
      //   remoteVideoRef.current.srcObject = remoteStream;
      //   remoteVideoRef.current.play();
      // });
    });

    // const call = peer.call(remotePeerId, mediaStream);

    // call.on("stream", (remoteStream) => {
    //   remoteVideoRef.current.srcObject = remoteStream;
    //   remoteVideoRef.current.play();
    // });
  };
  // return function (dispatch) {
  //   const peer = new Peer(localStorage.getItem("local_user_id"), {
  //     host: process.env.PEER_URL || "donnies-list-2-25ld4.ondigitalocean.app",
  //     path: "/myapp",
  //   });
  //     const call = peerInstance.current.call(remotePeerId, mediaStream);

  //   getUserMedia({ audio: true }, (mediaStream) => {
  //     currentUserVideoRef.current.srcObject = mediaStream;
  //     currentUserVideoRef.current.play();

  //     call.on("stream", (remoteStream) => {
  //       remoteVideoRef.current.srcObject = remoteStream;
  //       remoteVideoRef.current.play();
  //     });
  //   });
  // };
}
