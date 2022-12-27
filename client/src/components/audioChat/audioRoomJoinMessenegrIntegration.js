import { useState } from "react";
import { joinRoom, recreatePeer } from "../../webRTC/peerEvents";
import axios from "axios";
import { AUDIOROOM_API_URL } from "../../constants/api";
import { toast } from "react-toastify";
import "./audioChat.css";

export function AudioRoomJoinButton({ roomId, onJoined }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      className="audio-room-join-button"
      onClick={() => {
        setLoading(true);

        axios
          .get(`${AUDIOROOM_API_URL}/rooms/${roomId}`)
          .then((response) => {
            console.log("successfully fetched room", response.data);
            const room = response.data;
            //fetch user role in room
            if (room.isLive) {
              recreatePeer(() => {
                joinRoom(response.data, "Audience");
                onJoined();
                setLoading(false);
              });
            } else {
              toast.warn("Room expired");
            }
          })
          .catch((err) => {
            setLoading(false);
            if (err.response) {
              toast.error(err.response.data.message);
              console.error("Couldnt fetch room", err.response.data.message);
            } else {
              toast.error("Couldnt fetch room");
              console.error("Couldnt fetch room", err);
            }
          });
      }}
    >
      {loading ? "...JOINING" : "JOIN AUDIO ROOM"}
    </button>
  );
}

export function useAudioRoomLinkParser(message) {
  //if message contains a audio room id
  if (message.includes("#AUDIOROOMID")) {
    //extract the link
    const [messageText, roomId] = message.split("#AUDIOROOMID");
    console.log(`extracted audio room id ${roomId} and text ${messageText}`);
    return { messageText, roomId };
  }
  return null;
}
