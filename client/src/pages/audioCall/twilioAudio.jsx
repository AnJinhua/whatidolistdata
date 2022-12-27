import React, { useState, useCallback, useEffect } from "react";
import Video from "twilio-video";
import Room from "./Room";
import axios from "axios";

const VideoChat = (props) => {
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [init, setInit] = useState("");

  const handleMettingInit = async ({ identity, roomId }) => {
    setConnecting(true);

    const { data } = await axios.post(
      "https://api.donnieslist.com/twilio/video/token",
      {
        identity,
        room: roomId,
      }
    );
    try {
      const videoInit = await Video.connect(data?.token, {
        room: roomId,
      });
      setRoom(videoInit);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
  }, []);

  useEffect(() => {
    handleMettingInit({
      roomId: props.match.params.id,
      identity: props.match.params.id + Date.now(),
    });
  }, [init, props]);

  useEffect(() => {
    if (room) {
      const tidyUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          handleLogout();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    }
  }, [room, handleLogout]);

  let render;
  if (room) {
    render = (
      <Room
        roomName={Date.now().toString()}
        room={room}
        handleLogout={handleLogout}
      />
    );
  } else {
    render = <div className="loading"> loading.. </div>;
  }
  return render;
};

export default VideoChat;
