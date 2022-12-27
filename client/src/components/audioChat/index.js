import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Motion, spring } from "react-motion";
import InvitePeople from "./invitePeople";
import LiveRoom from "./liveRoom";
import CreateRoom from "./createRoom";
import AddTopics from "./addTopics";
import "./audioChat.css";
import { createRoom, updateHostControls } from "../../actions/audio_chat_room";
import store from "../../store";
import { Provider } from "react-redux";
import { startPingRoom } from "../../webRTC";

const AudioChat = ({ expert, user }) => {
  const [state, setState] = useState({
    opacity: 0.5,
    translate: 0,
    display: "visible",
  });
  const [temporaryRoom, setTemporaryRoom] = useState({
    title: "",
    topics: [],
    hosts: [],
    private: false,
    speakers: [],
    otherUsers: [],
  });

  const [segment, setSegment] = useState("");

  const animate = () => {
    setState(
      {
        opacity: state.opacity === 0.5 ? 0 : 0.5,
        translate: state.opacity === 0 ? 0 : 100,
      },
      () => {
        if (state.opacity === 0) {
          setTimeout(() => {
            setState({
              display: "hidden",
            });
          }, 200);
        } else {
          setState({
            display: "visible",
          });
        }
      }
    );
  };

  const setChatSegment = () => {
    switch (segment) {
      case "live":
        return (
          <LiveRoom
            animate={animate}
            user={{
              ...user,
              firstName: user.profile.firstName || "",
              lastName: user.profile.lastName || "",
            }}
            setSegment={setSegment}
          />
        );
      case "topics":
        return (
          <AddTopics
            animate={animate}
            setRoom={setTemporaryRoom}
            room={temporaryRoom}
            setSegment={setSegment}
          />
        );
      case "invite":
        return <InvitePeople setSegment={setSegment} animate={animate} />;
      default:
        return (
          <CreateRoom
            animate={animate}
            setRoom={setTemporaryRoom}
            room={temporaryRoom}
            setSegment={setSegment}
          />
        );
    }
  };

  const setInitialRoomMembers = () => {
    setTemporaryRoom({
      ...temporaryRoom,
      hosts: [
        {
          ...user,
          audioRoomRole: "Host",
          firstName: user.profile.firstName || "",
          lastName: user.profile.lastName || "",
        },
        {
          ...expert,
          audioRoomRole: "Co-host",
          profileImage: expert.profileImage || expert.photo,
        },
      ],
    });
  };

  useEffect(() => {
    // receiving call, go to liveroom
    if (!expert) {
      setSegment("live");
    } else {
      // creating new room before call
      setInitialRoomMembers();
    }
  }, []);

  return (
    <div>
      <Motion
        style={{
          opacity: spring(state.opacity),
          translate: spring(state.translate),
        }}
      >
        {({ translate }) => (
          <div
            id="audio-chat-container"
            className="audio-chat-container"
            style={{
              visibility: state.display,
            }}
          >
            <div
              id="audio-chat-content"
              className="audio-chat-content"
              style={{
                transform: `translateY(${translate}%)`,
              }}
            >
              {setChatSegment()}
            </div>
          </div>
        )}
      </Motion>
    </div>
  );
};

export const showChatRoom = async (expert) => {
  const container = document.getElementById("audio-chatroom-container");
  console.log("place cll to");
  console.log(expert);

  // fetch authenticated user
  const currentUser = await store.getState().user.profile;
  console.log("place call from");
  console.log(currentUser);

  if (currentUser && Object.keys(currentUser).length) {
    ReactDOM.render(
      <div>
        <Provider store={store}>
          <AudioChat
            key={new Date().getTime()}
            expert={expert}
            user={currentUser}
          />
        </Provider>
      </div>,
      container
    );
  } else {
    alert("Sorry! You have to be logged in to perform this action.");
  }
};

export const renderRoomOnCall = (_room, role) => {
  if ("_id" in _room) _room["id"] = _room._id;

  const hostControls = role === "Host" || role === "Co-host";
  store.dispatch(createRoom(_room));
  store.dispatch(updateHostControls(hostControls));
  showChatRoom(null);
  startPingRoom(_room.id);
};

export default AudioChat;
