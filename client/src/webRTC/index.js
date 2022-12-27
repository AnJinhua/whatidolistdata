import axios from "axios";
import { localStream, leaveCall, recreatePeer } from "./peerEvents";
import { insertRoom, sendEmailInvitation } from "./helpers";
import store from "../store";
import { socket } from "./socketEvents";
import uuid from "react-uuid";
import { Cookies } from "react-cookie";
import {
  clearRoom,
  toggleMuteAudio as toggleMuteAudioAction,
  addToWaitlist,
} from "../actions/audio_chat_room";
import { sendMessageToUser } from "../actions/messenger";
import { CLIENT_ROOT_URL, API_URL, host } from "../constants/api";
import { toast } from "react-toastify";
import { sendNotification } from "../subscription";
import { CALL_ACCEPTED, CALL_REJECTED } from "../constants/audio-room";

const cookies = new Cookies().getAll();
//register callBack for on call

/*
    Try to create a 'room' given roomInfo and initial participants
    @param roomInfo: {title: string, topics: [string], otherUser: Object}
    @param audioElement: string - the id of the element to attach the audio stream to
    @param callBack: function - the callback to call when the call is complete 
    @returns {Promise} - An  promise that resolves to a Room object when successful or an Error if creating the room fails
*/
export const createRoom = async (roomInfo, callBack = null) => {
  console.log("creating room inside creating room");
  console.log(roomInfo);

  try {
    const room = await insertRoom(roomInfo);
    console.log("created room in create room");
    console.log(room);

    return room.data;
  } catch (error) {
    return error;
  }
};

// invite participant
export const inviteParticipant = async (
  roomInfo,
  user,
  role = "Audience",
  forceRecreatePeer = true,
  callBack = () => {}
) => {
  if ("_id" in user) user["id"] = user._id; //map _id filed to id field

  try {
    const hostName = `${store.getState().user.profile.profile.firstName} ${
      store.getState().user.profile.profile.lastName
    }`;
    console.log("host name is ", hostName);

    const sendInvitation = async () => {
      socket
        .timeout(90000) // 90 seconds
        .emit(
          "invite-to-call",
          {
            hostId: store.getState().user.profile._id,
            recepientId: user._id,
            room: roomInfo,
            role,
          },
          (err, response) => {
            if (err) {
              console.error("invite to call timed out", err);

              // sendAudioRoomNotification(
              //   user,
              //   roomInfo,
              //   `Hi, You missed your invitation to an audio room conversation on ${roomInfo.title} from ${cookies?.user?.firstName}. Click the link below to join the room or access the recording`,
              //   `${hostName} invited you to an audio room conversation on ${roomInfo.title}`
              // );
            }

            console.log("invite to call response", response);
            if (response === CALL_REJECTED) {
              sendAudioRoomNotification(
                user,
                roomInfo,
                `Hi, You rejected your invitation to an audio room conversation on ${roomInfo.title} from ${cookies?.user?.firstName}. Click the link below to join the room or access the recording`,
                `${hostName} invited you to an audio room conversation on ${roomInfo.title}`
              );
            }
          }
        );
    };

    if (forceRecreatePeer) {
      recreatePeer(() => {
        console.log("recreated peer now sending invitation");
        sendInvitation();
      });
    } else {
      console.log("send invitation without recreating peer");
      sendInvitation();
    }

    console.log("sending invite notifications");
    sendAudioRoomNotification(
      user,
      roomInfo,
      `Hi.${hostName} invited you to an audio room conversation on ${roomInfo.title}. Click the link below to join the room or access the recording`,
      `${hostName} invited you to an audio room conversation on ${roomInfo.title}`
    );

    store.dispatch(addToWaitlist(user));
    return { ...user, audioRoomRole: role };
  } catch (error) {
    throw error;
  }
};

export const toggleRaiseHand = async (userId, roomId) => {
  // console.log("before toggle rise " + store.getState().audioRoom.handRaised);
  const newState = !store.getState().audioRoom.handRaised ?? true;
  // console.log("toggle raise hand, " + newState);

  if (newState) {
    socket.emit("raise-hand", { _id: userId, roomId });
  } else {
    socket.emit("unraise-hand", { _id: userId, roomId });
  }
};

export const toggleMuteAudio = (userId, roomId) => {
  localStream.getAudioTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });

  store.dispatch(toggleMuteAudioAction());
  socket.emit("user-mute-audio", {
    _id: userId,
    roomId,
    isMuted: store.getState().audioRoom.muted,
  });
};

export const leaveRoom = (room, user, closeRoom = false) => {
  if ("_id" in room) room["id"] = room._id;
  if ("_id" in user) user["id"] = user._id;

  socket.emit("user-left-audio-room", {
    roomId: room.id,
    userId: user.id,
    closeRoom,
  });
  store.dispatch(clearRoom());
  leaveCall();

  clearInterval(window.pingIntervalId);
};

export const playAudio = (src, loop = false) => {
  const audioElement = new Audio(src);
  audioElement.loop = loop;
  audioElement
    .play()
    .then((result) => {})
    .catch((err) => {
      console.error("error playing audio", err);
    });
};

export const updateUserRole = async (userId, roomId, role) => {
  console.log(
    "updating user role " + role + " for user " + userId + " in room " + roomId
  );
  socket.emit("update-user-role", { userId, roomId, role });
};

export const reconnectPeer = () => {
  recreatePeer();
};

export const sendAudioRoomNotification = (
  recepient,
  room,
  messageText,
  notificationTitle
) => {
  console.log("sending call notification via notifications channel", room);

  const roomUrl = CLIENT_ROOT_URL + "/rooms/?id=" + room.id;
  const user = store.getState().user.profile;

  console.log("user sending notification to recepient", recepient);

  const emailNotificationData = {
    recieverName: `${recepient.firstName ?? recepient.profile.firstName} ${
      recepient.lastName ?? recepient.profile.lastName
    }`,
    message: null,
    senderName: `${user?.profile?.firstName} ${user?.profile?.lastName}`,
    recieverEmail: recepient.email ?? "",
    url: roomUrl,
    baseUrl: CLIENT_ROOT_URL,
    endpoint: "sendAudioRoomNotification",
    roomTitle: room.title,
  };

  console.log("conversation starter user object", user);
  const conversationStarter = {
    recieverSlug: recepient.slug ?? "",
    senderSlug: user?.slug ?? "",
    firstName: user?.profile?.firstName,
    lastName: user?.profile?.lastName,
    //link: CLIENT_ROOT_URL + "/rooms/?id=" + room._id,
    quote: null,
    messageId: uuid(),
    //text: `Hi, ${cookies?.user?.firstName} has invited you to their audio room discussion on ${room.title}`,
    text: messageText + "#AUDIOROOMID" + room.id,
    //share: null,
    emailNotificationData: emailNotificationData,
  };

  store.dispatch(sendMessageToUser(conversationStarter));
  console.log("sent audio room text message notification");

  let pushNotificationData = {
    //title: `${conversationStarter.firstName} started an audio room`,
    title: notificationTitle,
    description: conversationStarter.text,
    userSlug: conversationStarter.recieverSlug,
    action: "Join Room",
    senderSlug: `${conversationStarter.senderSlug}`,
    endUrl: `/rooms/?id=${room.id}`,
    redirectUrl: null,
  };

  sendNotification(pushNotificationData);
  console.log("sent audio room push notification");

  sendEmailInvitation(
    roomUrl,
    CLIENT_ROOT_URL,
    recepient.firstName ?? recepient.profile.firstName,
    recepient.email ?? "",
    `${user?.profile?.firstName} ${user?.profile?.lastName}`,
    messageText,
    room.title
  );
  console.log("sent audio room email notification");
  //toast.success("audio room notifictaion sent");
};

export const startPingRoom = (roomId) => {
  window.pingIntervalId = setInterval(() => {
    socket.emit("ping-room", { roomId });
    console.log(`pinging room ${roomId}`);
  }, 240000); //send ping every 4 minutes
};
