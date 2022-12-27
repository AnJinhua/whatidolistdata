import { io } from "socket.io-client";
import {
  addParticipant,
  setRoomCreated,
  raiseHand,
  toggleUserMuteAudio,
  updateUserAudioRoomRole,
  updateHostControls,
  removeParticipant,
  removeFromWaitlist,
  updateSocketId,
  clearRoom,
} from "../actions/audio_chat_room";
import store from "../store";
import { AUDIOROOM_API_URL } from "../constants/api";
import { showCallToast } from "./utils/showCallToast";
import {
  joinRoom,
  rejectJoinRoom,
  leaveCall,
  recreatePeer,
} from "./peerEvents";
import { toast } from "react-toastify";
import { playAudio } from "./";
import hostJoinChime from "./assets/host_join.mp3";
import { toggleMuteAudio } from "./";

// import { userStore } from "src/store/user_store";

export const socket = io(
  AUDIOROOM_API_URL,
);

socket.on("connect", () => {
  console.log("[AUDIOROOM] WEBSOCKET CLIENT CONNETED" + socket.connected);
  store.dispatch(updateSocketId(socket.id)); // true
});

socket.on("user_online", ({ userId, peerId }) => {
  console.log("peer side user_online ", userId, peerId);
});

socket.on("room_created", (roomId) => {
  if (store.getState().audioRoom.room.id === roomId) {
    store.dispatch(setRoomCreated(true));
  }
});

socket.on("user-joined-audio-room", (user) => {
  console.log("user-joined-audio-room", user);
  store.dispatch(addParticipant(user));
  store.dispatch(removeFromWaitlist(user));
  console.log("user-joined-audio-room after", user);
  if (store.getState().audioRoom.hostControls) {
    playAudio(hostJoinChime);
  }
});

socket.on("user-left-audio-room", (userId) => {
  console.log("user left audio room");
  console.log(userId);
  store.dispatch(removeParticipant(userId));
});

socket.on("room-closed", () => {
  console.log("room closed by host");
  toast.warning("Room was closed by host");
  store.dispatch(clearRoom());

  leaveCall();
});

socket.on("raise-hand", ({ _id }) => {
  console.log("raise-hand, client side user id: " + _id);
  const self = _id === store.getState().user.profile._id;
  store.dispatch(raiseHand(_id, true, self));
});

socket.on("unraise-hand", ({ _id }) => {
  console.log("uraise-hand, client side user id: " + _id);
  const self = _id === store.getState().user.profile._id;
  store.dispatch(raiseHand(_id, false, self));
});

socket.on("user-mute-audio", ({ _id, isMuted }) => {
  console.log(
    "user-mute-audio, client side user id: " + _id + " mute: " + isMuted
  );
  store.dispatch(toggleUserMuteAudio(_id, isMuted));
});

socket.on("update-user-role", ({ userId, role }) => {
  console.log("update user role " + userId + " role: " + role);
  const isCurrentUser = userId === store.getState().user.profile._id;
  const muted = store.getState().audioRoom.muted;

  store.dispatch(updateUserAudioRoomRole(userId, role));

  if (isCurrentUser) {
    store.dispatch(updateHostControls(role === "Host" || role === "Co-host"));
  }

  if (role === "Audience" && !muted && isCurrentUser) {
    toggleMuteAudio(userId, store.getState().audioRoom.room.id);
  } else if (role !== "Audience" && muted && isCurrentUser) {
    toggleMuteAudio(userId, store.getState().audioRoom.room.id);
  }
});

socket.on("invite-to-call", ({ room, role, callId }) => {
  console.log("RECEOVED INVITE TO CALL", callId);
  recreatePeer(() => {
    console.log("recreted peer now showing call toast");

    showCallToast(
      () => {
        socket.emit("call-response", { status: "CALL_ACCEPTED", callId });
        joinRoom(room, role);
      },
      () => {
        socket.emit("call-response", { status: "CALL_REJECTED", callId });
        rejectJoinRoom();
      },
      room
    );
  });
});
