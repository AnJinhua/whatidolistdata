import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import Video from "twilio-video";
import Room from "./Room";
import axios from "axios";
import { API_URL } from "../../constants/api";
import { withCookies } from "react-cookie"

const VideoChat = (props) => {
  const [username, setUsername] = useState("anonymous");
  const [roomName, setRoomName] = useState(props?.match?.params?.id);
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [init, setInit] = useState("");
  const meetingRoomId = props?.match?.params?.id

  const history = useHistory()

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      handleMettingInit();
    },
    [roomName, username]
  );
  const handleMettingInit = async () => {
    setConnecting(true);

    if (localStorage?.currentVideoSession) {
      const createdVideoSession = JSON.parse(localStorage.getItem("currentVideoSession"))
      setUsername(createdVideoSession?.data)
      if (createdVideoSession?.roomId === meetingRoomId) {
        try {
          const videoInit = await Video.connect(createdVideoSession?.token, {
            room: meetingRoomId,
          });
          setRoom(videoInit);
        } catch (error) {
          alert(error.message);
        }
      } else {
        try {
          const { data } = await axios.get(
            API_URL + "/joinvideocall/" + meetingRoomId, {
            headers: {
              authorization: props?.cookies?.cookies?.token
            }
          }
          );
          setUsername(data?.data)

          const videoInit = await Video.connect(data?.token, {
            room: meetingRoomId,
          });
          setRoom(videoInit);

        } catch (error) {
          alert(error.message)
        }
      }


    } else {
      try {
        const { data } = await axios.get(
          API_URL + "/joinvideocall/" + meetingRoomId, {
          headers: {
            authorization: props?.cookies?.cookies?.token
          }
        }
        );
        const videoInit = await Video.connect(data?.token, {
          room: meetingRoomId,
        });
        setRoom(videoInit);

      } catch (error) {
        alert(error.message)
      }
    }


  };

  const handleLogout = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
        history.push('/')
        
        
      }
      return null;
    });
  }, []);

  useEffect(() => {
    handleMettingInit();
  }, [init]);

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
        roomName={meetingRoomId}
        room={room}
        handleLogout={handleLogout}
        identity={username}
        roomId={meetingRoomId}
      />
    );
  } else {
    render = <div className="loading"> loading.. </div>;
  }
  return render;
};

export default withCookies(VideoChat);
