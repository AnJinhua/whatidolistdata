import Peer from "peerjs";
import { socket } from "./socketEvents";
import store from "../store";
import { renderRoomOnCall } from "../components/audioChat";
import { toast } from "react-toastify";
import { visualize } from "../components/audioChat/visualizeAudio";
import { RetryNotification } from "./../components/audioChat/callNotification";
import { setConnecting } from "../actions/audio_chat_room";
import { startPingRoom } from ".";

function createPeer(peerId) {
  return new Peer(peerId, {
    debug: 3,
    host: "production-api.whatido.app",
    path: "/peer-server",
    pingInterval: 3000,
    config: {
      iceServers: [
        { urls: "stun:stun.whatido.app" },
        {
          urls: "turn:turn.whatido.app",
          credential: "whatido",
          username: "whatido",
        },
      ],
    },
  });
}

export let peer;
let mediaConnections = {};
export let localStream;
export let remoteStreams = {};
let interval;

export const setOnlinePeer = async (user, peerId = null, callback) => {
  console.log("setting online peer");
  console.log(user);

  peer = createPeer(peerId);
  setOnPeerOpenListener(user._id, callback);
  setOnCallListener();
  setOnCloseListener(user);
  setOnDisconnectedListener(user);
  setOnErrorListener();

  //TODO: FIGURE THIS OUT
  // console.log("peer object", peer);
  // try {
  //   localStorage.setItem("peer", JSON.stringify(peer));
  // } catch (err) {
  //   console.error("couldn't store peer in local storage", err);
  // }
};

/*
 * Place a call to the specified peer and attach thier audio to the specified element
 * @param {User} user - The user being called
 * @param {Room} room - The room that the user is to join
 * @param {bool} inviteToRoom - whetehr this is a call being made to invite a new user to room
 * @returns {Promise} - An empty promise that resolves when the call is complete or an Error if the call fails
 */
export const makeCall = async (user, room) => {
  try {
    // console.log(
    //   `making call to ${user.profile.firstName} ${user.profile.lastName}`
    // );
    console.log(`making call to user`, user);

    if (
      typeof localStream == "undefined" ||
      localStream.getTracks()[0].readyState === "ended"
    ) {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    }

    const call = peer.call(user.peerId, localStream);
    visualize(peer.id, localStream);

    call.on("stream", function (incomingStream) {
      remoteStreams[call.peer] = incomingStream;
      visualize(call.peer, incomingStream);
      console.log(
        "New incoming stream added to remoteStream object on caller side",
        remoteStreams
      );

      try {
        document.getElementById(`audio-${call.peer}`).remove(); //remove if it already exists
      } catch {
        console.log("audio element didn't exist, wil create a new one");
      }

      const audioElement = document.createElement("audio");
      audioElement.srcObject = incomingStream;
      audioElement.id = `audio-${call.peer}`;
      audioElement.autoPlay = true;
      audioElement.crossOrigin = "anonymous";

      //audioElement.hidden = true;
      //audioElement.controls = true;
      audioElement.play();

      document
        .getElementById("audio-chatroom-streams")
        .appendChild(audioElement);

      console.log("now playing audio");
    });

    mediaConnections[call.peer] = call;
  } catch (err) {
    throw err;
  }
};

function setOnPeerOpenListener(userId, callback) {
  console.log("setting on peer open listener for user: " + userId);
  peer.on("open", async (peerId) => {
    console.log(`My peer ID is: ${peerId} and user id = ${userId}`);

    socket.emit("peer_online", { userId, peerId });

    if (callback) {
      callback();
    }
  });
}

function setOnCallListener() {
  peer.on("call", async (call) => {
    mediaConnections[call.peer] = call;
    try {
      if (
        typeof localStream == "undefined" ||
        localStream.getTracks()[0].readyState === "ended"
      ) {
        localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
      }

      call.answer(localStream);
      visualize(peer.id, localStream);
      call.on("stream", function (incomingStream) {
        remoteStreams[call.peer] = incomingStream;
        visualize(call.peer, incomingStream);
        console.log(
          "[AUDIOROOMS] New incoming stream added to remoteStream object on recepient side",
          remoteStreams
        );

        try {
          document.getElementById(`audio-${call.peer}`).remove(); //remove if it already exists
        } catch (err) {
          console.log("audio element didn't exist, wil create a new one");
        }

        const audioElement = document.createElement("audio");
        audioElement.srcObject = incomingStream;
        audioElement.id = `audio-${call.peer}`;
        audioElement.autoPlay = true;
        audioElement.crossOrigin = "anonymous";
        ///audioElement.hidden = true;
        audioElement.play();

        document
          .getElementById("audio-chatroom-streams")
          .appendChild(audioElement);
      });
    } catch (err) {
      console.error("Failed to get local stream", err);
    }
  });
}

export async function joinRoom(room, role) {
  // store.dispatch(setConnecting(true));
  console.log("currenmtuser in join room", store.getState().user);
  const currentUser = await store.getState().user.profile;

  if (!currentUser) {
    console.log("user not logged in", currentUser);
    toast.error("Can't fetch user profile. Try logging out and loggin again");
    return;
  }
  console.log("set connecting", store.getState().audioRoom.connecting);
  //check if already in room and also not in process of joining
  const userIds = getUsersInRoom(room);
  console.log("check if peer already in room", userIds);

  setTimeout(() => {
    if (!userIds.includes(currentUser._id)) {
      emitJoinRoom(room, role);
      callOtherParticipants(room);
      renderRoomOnCall(room, role);
      //start pinging room
      startPingRoom(room.id);
    } else {
      console.log("already in room");
    }

    store.dispatch(setConnecting(false));
    console.log("set connecting", store.getState().audioRoom.connecting);
  }, 2000); //set this delay to allow peer to be recreated
}

export function rejectJoinRoom() {
  console.log("rejecting call");
}

function setOnCloseListener(user) {
  peer.on("close", () => {
    console.warn("Peer closed. not yet recreating peer");
    //recreatePeer();
  });
}

function setOnDisconnectedListener(user) {
  peer.on("disconnected", () => {
    console.warn("Peer disconnected. reconnecting");
    //peer.reconnect();
    //reconnectPeer();
  });
}

function setOnErrorListener() {
  peer.on("error", function (err) {
    console.warn("Peer error:", err);
    console.warn("Peer error type:", err.type);

    switch (err.type) {
      case "browser-incompatible":
        toast.error("Your browser is not compatible with WebRTC");
        break;
      case "invalid-id":
        //toast.error("Invalid peer ID(Contaiins illegal characters)");
        break;
      case "invalid-key":
        //toast.error("Invalid API key");
        break;
      case "disconnected":
        // toast.error(
        //   "You've already disconnected this peer from the server and can no longer make any new connections on it."
        // );
        // todo add  a reconnect button
        break;
      case "network":
        // toast.error(
        //   "Network error. Check your network and try reloading the page."
        // );
        break;
      case "peer-unavailable":
        toast.error(
          <RetryNotification
            message={
              "We're experiencing some connection issues. Click 'RETRY'  to try reconnecting."
            }
            retry={() => {
              callOtherParticipants(store.getState().audioRoom.room);
            }}
          />,
          { autoClose: false }
        );
        //todo add reconnect button call callAllOtherParticipants
        // call specific user couldn't connect to

        break;
      case "ssl-unavailable":
        // toast.error(
        //   "PeerJS is being used securely, but the cloud server does not support SSL. Use a custom PeerServer"
        // );
        break;
      case "server-error":
        // toast.error("Server error. Try reloading the page.");
        break;
      case "socket-error":
        //toast.error("Socket error. Try reloading the page.");
        break;
      case "socket-closed":
        // toast.error("Socket closed. Try reloading the page.");
        break;
      case "unavailable-id":
        // toast.error(
        //   "TThe ID passed into the Peer constructor is already taken."
        // );
        break;
      case "webrtc":
        toast.error("A Native WebRTC error  occurred");
        break;
      default:
        toast.error("An unknown error occurred.Report this to the developer");
    }
  });
}

export function leaveCall() {
  if (localStream) {
    localStream.getAudioTracks().forEach((track) => {
      track.stop();
      console.log("stopped local audio track", localStream);
    });
  }

  for (const peerId in mediaConnections) {
    closeConnection(peerId);
  }
}

const resumeLocalStream = (peerId) => {
  localStream.getTracks().forEach((track) => {
    track.enabled = true;
  });
};

const closeConnection = (peerId) => {
  if (typeof mediaConnections[peerId] !== "undefined") {
    console.log("closing connection", mediaConnections[peerId]);
    mediaConnections[peerId].close();
    delete mediaConnections[peerId];
    try {
      document.getElementById(`audio-${peerId}`).remove();
    } catch {
      console.log("audio element didn't exist, won't remove");
    }
  }
};

export const recreatePeer = (callback) => {
  const user = store.getState().user.profile;
  console.log("forcing recreate peer", user);

  if (!user) {
    console.log("user not logged in", user);
    toast.error("Can't fetch user profile. Try logging out and loggin again");
    return;
  }
  //peerId = peer.id
  //setOnlinePeer(user, peer.destroyed ? peer.id : null)
  // if (peer?.disconnected) {
  peer?.destroy();
  setTimeout(() => {
    setOnlinePeer(user, user._id, callback)
      .then(() => {
        console.log("successfully recreated peer");
      })
      .catch((err) => {
        console.error(`error recreating peer: ${err.message}`, err);
      });
  }, 5000);
  // }
};

function emitJoinRoom(room, role) {
  const user = store.getState().user.profile;

  if (!user) {
    console.log("user not logged in", user);
    toast.error("Can't fetch user profile. Try logging out and loggin again");
    return;
  }

  if ("_id" in room) room["id"] = room._id;

  console.log("emit join room", user);
  socket.emit("user-joined-audio-room", {
    roomId: room.id,
    user: {
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      id: user._id,
      peerId: user.peerId,
      audioRoomRole: user.audioRoomRole,
      profileImage: user.imageUrl ? user.imageUrl.cdnUrl : "",
    },
    role,
  });
}

function callOtherParticipants(room) {
  const participants = [...room.hosts, ...room.speakers, ...room.otherUsers];
  console.log("calling room participants", participants);

  participants.forEach((participant) => {
    makeCall(participant, room);
  });
}

function getUsersInRoom(room) {
  const participants = [...room.hosts, ...room.speakers, ...room.otherUsers];
  return participants.map((participant) => participant.id); //todo check if this is correct
}
