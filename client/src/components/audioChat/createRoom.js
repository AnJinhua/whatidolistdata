import React, { useState } from "react";
import { Close, Add } from "@material-ui/icons";
import { TopicsList } from "./addTopics";
import { RoomMember } from "./liveRoom";
import { createRoom, inviteParticipant, startPingRoom } from "../../webRTC";
import {
  createRoom as createRoomAction,
  setRoomCreated,
  updateHostControls,
} from "../../actions/audio_chat_room";
import store from "../../store";
import { socket } from "../../webRTC/socketEvents";
import { toast } from "react-toastify";
//import { useDispatch } from "react-redux";

const CreateRoom = ({ animate, room, setRoom, setSegment }) => {
  const [creatingRoom, setCreatingRoom] = useState(false);
  //const dispatch = useDispatch();

  const handleTitleInputChange = (event) => {
    setRoom({ ...room, title: event.target.value });
  };

  const handlePrivateChange = (event) => {
    console.log(`private`, event.target.checked);
    setRoom({ ...room, private: event.target.checked });
  };

  const verifyRoomValidity = () => {
    console.log(room);
    return room.title && room.topics.length > 0 && room.hosts.length > 1
      ? true
      : false;
  };

  const _createRoom = () => {
    if (verifyRoomValidity()) {
      setCreatingRoom(true);
      document.getElementById("create-room-btn").setAttribute("disabled", true);

      createRoom(room)
        .then(async (createdRoom) => {
          if (!(createdRoom instanceof Error)) {
            store.subscribe(() => {
              if (store.getState().audioRoom.roomCreated) {
                console.log("room truly created:");

                setSegment("live");
                setCreatingRoom(false);
              }
            });

            socket.emit("host-created-audio-room", createdRoom);

            console.log("created room in db");
            console.log(createdRoom);

            store.dispatch(createRoomAction(createdRoom));
            store.dispatch(updateHostControls(true));
            store.dispatch(setRoomCreated(true));
            if ("_id" in createdRoom) createdRoom["id"] = createdRoom._id;
            startPingRoom(createdRoom.id);
            await inviteParticipant(createdRoom, room.hosts[1], "Co-host");
          } else {
            //TODO CLEAN UP THIS ERROR HANDLING MAKE IT A LIL USERFRIENDLY
            if (
              createdRoom.message
                .toLowerCase()
                .includes("user with the following peerid not found")
            ) {
              toast.error(
                "Oops! We couldn't create your room due to an outdated peerId.Just refresh your tab.",
                { delay: 10000 }
              );
            } else {
              toast.error(createdRoom.message, { delay: 10000 });
            }
            console.warn("Error creating room,", createdRoom);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message, { delay: 10000 });
        });
      // setTimeout(() => setSegment("live"), 5000);
    } else {
      toast.warn("Room name and topics are required!", { delay: 10000 });
      console.error("missing room info");
    }
  };
  const closeRoom = () => {
    // TODO: close functionalities e.g confirmation dialog
    animate();
  };

  const _addTopics = () => {
    setSegment("topics");
  };

  return (
    <section className="">
      <div className="audio-chat-header">
        <h2 className="">{creatingRoom ? room.title : "create your room"}</h2>
        <Close onClick={closeRoom}></Close>
      </div>
      <div className="audio-chat-body">
        {creatingRoom ? (
          <>
            <div className="creating-room-segment">
              <div className="chat-room-topics-list">
                {room.topics.map((_topic) => (
                  <p key={_topic.slug} className="detail-btn">
                    {_topic.name}
                  </p>
                ))}
              </div>
              <div className="audio-chat-inner-body">
                <div className="chat-participants-list">
                  {room.hosts.map((_user) => (
                    <RoomMember user={_user} />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <input
              onChange={handleTitleInputChange}
              type="text"
              value={room.title}
              className="create-room-title"
              placeholder="Name your room"
            />
            <div className="audio-chat-inner-body">
              <p class="audio-chat-instructions">
                What do you want to talk about?
              </p>
              {room.topics.length ? (
                <div>
                  <p className="inner-title">Topics</p>
                  <TopicsList
                    list={room.topics}
                    addOption={true}
                    room={room}
                    setRoom={setRoom}
                    addTopics={_addTopics}
                  />
                </div>
              ) : (
                <button className="btn add-topics-btn" onClick={_addTopics}>
                  <Add></Add>
                  <span>Add Topics</span>
                </button>
              )}
            </div>

            <div className="select-private">
              <input
                onChange={handlePrivateChange}
                type="checkbox"
                value={room.private}
                className="room-private-checkbox"
                id="room-private"
              />
              <label for="room-private"> Private </label>
              <p class="private-tip">
                Private rooms are only accessible via a private link shared to
                indiviual memebers. The room will not be listed in the public
                rooms page.
              </p>
            </div>
          </>
        )}
        <div className="audio-chat-body-foot">
          <button
            className="create-room-btn btn"
            id="create-room-btn"
            onClick={_createRoom}
          >
            {creatingRoom ? "Creating Room ..." : " Create Room"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateRoom;
