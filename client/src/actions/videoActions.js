import IO from "socket.io-client";
import Peer from "react-native-peerjs";
import {
  MY_STREAM,
  ADD_STREAM,
  ADD_PEERID,
  ADD_REMOTE_STREAM,
} from "../constants/actions";
import {
  API_URL,
  // CLIENT_ROOT_URL
} from "../constants/api";

const peerServer = new Peer(
  localStorage.getItem("local_user_id") || undefined,
  {
    host: process.env.PEER_URL || "donnies-list-2-25ld4.ondigitalocean.app",
    path: "/myapp",
  }
);

peerServer.on("error", console.log);

//** Socket Config */
export const socket = IO(`${API_URL}`, {
  forceNew: true,
});

socket.on("connection", () => console.log("Connection"));

export const joinRoom = (stream) => async (dispatch) => {
  const roomID = "askldufoiasfuqwru";
  // Set my own stream
  dispatch({ type: MY_STREAM, payload: stream });

  // Recieve a Call
  peerServer.on("call", (call) => {
    // Answer back with the all the remote stream
    call.answer(stream);

    // Answer the call back from the last device
    call.on("stream", (userVideoStream) => {
      dispatch({ type: ADD_STREAM, payload: userVideoStream });
    });
  });

  //open a conn
  peerServer.on("open", (userId) => {
    socket.emit("join-room", { userId, roomID });
  });

  socket.on("user-connected", (userId) => {
    connectToNewUser(userId, stream, dispatch);
  });
};

function connectToNewUser(userId, stream, dispatch) {
  const call = peerServer.call(userId, stream);

  // Get remote video
  call.on("stream", (remoteVideoStream) => {
    if (remoteVideoStream) {
      dispatch({ type: ADD_REMOTE_STREAM, payload: remoteVideoStream });
    }
  });

  call.on("close", () => {
    console.log("clesed");
  });

  dispatch({ type: ADD_PEERID, payload: { userId, call } });
}
