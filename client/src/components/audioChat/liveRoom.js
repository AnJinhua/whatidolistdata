import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  KeyboardArrowDown,
  Close,
  Mic,
  MicOff,
  MicRounded,
  FiberManualRecord,
  PeopleAltOutlined,
  PanTool,
  MicOffRounded,
  ShareOutlined,
  PersonAddOutlined,
  ExitToAppRounded,
  MoreVert,
} from "@material-ui/icons";
import {
  toggleRaiseHand,
  toggleMuteAudio,
  leaveRoom,
  updateUserRole,
} from "../../webRTC";
import * as recorder from "../../webRTC/recorder";
import { toggleRecording as toggleRecordingAction } from "../../actions/audio_chat_room";
import LazyImage from "../common/LazyImage";
import store from "../../store";
import { toast } from "react-toastify";
import { AudioCallNotification } from "./callNotification";
import { CLIENT_ROOT_URL } from "../../constants/api";
const default_url = "/img/profile.png";

export const BriefUserDetails = ({ user }) => {
  return (
    <div className="brief-user-details">
      <div>
        <LazyImage
          className="endorsement-image"
          height="30"
          width="30"
          placeholder={default_url}
          src={user.profileImage ? user.profileImage : default_url}
          alt="profile picture"
        />
      </div>
      <p className="room-user-name">
        {user.firstName} {user.lastName}
      </p>
    </div>
  );
};

export const RoomMember = ({ user, _index }) => {
  const [actionsVisible, setActionsVisible] = useState(false);
  // reaction: if user makes a reaction e.g laughs or raises hand
  const canSpeak = ["Host", "Co-host", "Speaker"];
  const userCanSpeak = canSpeak.includes(user.audioRoomRole);
  //const isAdmin = user.audioRoomRole === "Host" || user.audioRoomRole === "Co-host";
  const isAdmin = useSelector((state) => state.audioRoom.hostControls);

  const toggleActionsVisibility = () => setActionsVisible(!actionsVisible);
  //const  actionsVisible = useSelector((state) => state.audioRoom.hostControls);
  // const muted = useSelector((state) => state.audioRoom.muted);
  const changeUserRole = (event) => {
    const _newRole = event.target.dataset.value;
    console.log("update user role check user", user);
    const roomId = store.getState().audioRoom.room._id;
    updateUserRole(user._id, roomId, _newRole);
    // toggleActionsVisibility();
  };
  useEffect(() => {
    //visualize('canvas-' + user.peerId)
  }, []);

  try {
    if (
      typeof user.profileImage === "undefined" ||
      user.profileImage.length < 1
    ) {
      user.profileImage = user.imageUrl?.cdnUrl;
    }
  } catch (error) {
    console.log("error setting profile  image: ", error);
  }

  return (
    <div className="room-member">
      <div className="visualizer-wrapper">
        {userCanSpeak ? (
          <div className="visualizer-wrapper -canvas">
            <canvas
              id={"canvas-" + user.peerId}
              width="70"
              height="60"
            ></canvas>
          </div>
        ) : null}
        <div className="room-member-avatar-container">
          {userCanSpeak ? (
            <span className="avatar-overlay-item">
              {user.isMuted ? (
                <MicOff className="mic-off"></MicOff> // removed onclick because it was not required here. Only on the quick actions
              ) : (
                <Mic className="mic-on"></Mic>
              )}
            </span>
          ) : null}
          {user.handRaised ? ( //todo effect raise hand here
            <span className="avatar-overlay-item reaction-item-icon">
              <PanTool className="raised-hand-reaction"></PanTool>
            </span>
          ) : null}

          <LazyImage
            className="endorsement-image"
            height="50"
            width="50"
            placeholder={default_url}
            src={user.profileImage ? user.profileImage : default_url}
            alt="profile picture"
          />
        </div>
      </div>
      <div className="room-member-actions-container">
        <div>
          <p className="room-user-name">
            {user.firstName || user.profile.firstName}.{" "}
            {(user.lastName || user.profile.lastName)[0]}
          </p>
          <p className="room-user-role">{user.audioRoomRole}</p>
        </div>
        {isAdmin ? (
          <div className="user-toggle-room-role">
            <MoreVert onClick={toggleActionsVisibility}></MoreVert>
            {actionsVisible ? (
              <div className="room-member-role-list">
                {user.audioRoomRole !== "Co-host" ? (
                  <span data-value="Co-host" onClick={changeUserRole}>
                    Make Co-Host
                  </span>
                ) : null}
                {user.audioRoomRole !== "Speaker" ? (
                  <span data-value="Speaker" onClick={changeUserRole}>
                    Make Speaker
                  </span>
                ) : null}
                {user.audioRooomRole !== "Listener" ? (
                  <span data-value="Audience" onClick={changeUserRole}>
                    Make Listener
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const QuickActions = () => {
  const muted = useSelector((state) => state.audioRoom.muted);
  console.log("audio muted: ", muted);
  const user = useSelector((state) => state.user.profile);
  const room = useSelector((state) => state.audioRoom.room);

  const toggleRaiseHandHandler = () => {
    toggleRaiseHand(user._id, room._id);
  };

  const toggleMuteAudioHandler = () => {
    toggleMuteAudio(user._id, room._id);
  };

  return (
    <div className="chat-quick-actions">
      <button className="quick-actions-btn btn">
        {muted ? (
          <MicOffRounded
            onClick={toggleMuteAudioHandler}
            className="mic-off"
          ></MicOffRounded>
        ) : (
          <MicRounded
            onClick={toggleMuteAudioHandler}
            className="mic-on"
          ></MicRounded>
        )}
        <span>{muted ? "Muted" : "Mic is on"}</span>
      </button>

      <button
        onClick={toggleRaiseHandHandler}
        className="quick-actions-btn btn"
      >
        <PanTool className="raise-hand-icon"></PanTool>
        <span>Raise Hand</span>
      </button>
    </div>
  );
};

const MinimizedRoom = ({
  user,
  room,
  participantsTally,
  toggleMinimize,
  _leaveRoom,
}) => {
  console.log("minimized room: ");
  console.log(room);
  const host = room.hosts[0];
  return (
    <div
      className="audio-chat-body minimized-room-container"
      onClick={toggleMinimize}
    >
      <div>
        <Close className="audio-chat-close-icon" onClick={_leaveRoom}></Close>
        {/* <BriefUserDetails user={user} /> */}
        <p className="room-title">{room.title}</p>
      </div>
      <div onClick={toggleMinimize} style={{ cursor: "pointer" }}>
        <div className="minimized-room-summary">
          {/* <p className="room-title">{room.title}</p> */}
          {/* <FiberManualRecord className="dot-seperator"></FiberManualRecord> */}
          <div className="participants">
            <div className="host">
              <LazyImage
                className="endorsement-image"
                height="20"
                width="20"
                placeholder={default_url}
                src={host.profileImage ?? default_url}
                alt="profile picture"
              />
              <p>
                {host.firstName}, {host.lastName[0]}.
              </p>
              <p className="badge">HOST</p>
            </div>
            <div className="other-users">
              <p> and {participantsTally - 1} others.</p>
            </div>
          </div>
          {/* <div className="other-users">
            {room.otherUsers.length
              ? room.otherUsers.slice(0, 2).map((_user, _index) => (
                  <div className="other-user" key={_user._id}>
                    <LazyImage
                      className="endorsement-image"
                      height="20"
                      width="20"
                      placeholder={default_url}
                      src={user.profileImage ? user.profileImage : default_url}
                      alt="profile picture"
                    />
                    <small>{_user.firstName}</small>
                    {_index < 1 ? <span>,</span> : null}
                  </div>
                ))
              : null}
            <small>
              {participantsTally > 3
                ? `and ${participantsTally - 3} others`
                : ""}
            </small>
          </div> */}
        </div>
        <QuickActions />
      </div>
    </div>
  );
};

const RoomLoader = ({ _leaveRoom }) => {
  return (
    <div className="liveroom-ghost">
      <div className="audio-chat-header">
        <h2>{""}</h2>
        <Close onClick={_leaveRoom}></Close>
      </div>
      <div className="audio-chat-body">
        <p className="participants-stat">
          <PeopleAltOutlined></PeopleAltOutlined>
          <span>Participants</span>
        </p>
        <div className="chat-room-topics-list"></div>
        <div className="audio-chat-inner-body">
          <div className="chat-participants-list">
            {[...Array(Math.ceil(2))].map((_user) => (
              <div className="room-member">
                <div className="room-member-avatar-container"></div>
                <p className="room-user-name"></p>
                <p className="room-user-role"></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const LiveRoomFooter = ({ _leaveRoom, setSegment }) => {
  const shareRoom = () => {
    const roomId = store.getState().audioRoom.room._id;
    navigator.clipboard
      .writeText(`${CLIENT_ROOT_URL}/rooms/?id=${roomId}`)
      .then(() => {
        toast.success("Room URL copied to clipboard");
      });
  };

  const _invitePeople = () => {
    setSegment("invite");
  };

  return (
    <div className="audio-chat-footer">
      <QuickActions />
      <div className="liveroom-quick-actions">
        <button
          className="btn liveroom-quick-actions-btn"
          onClick={_invitePeople}
        >
          <PersonAddOutlined></PersonAddOutlined>
        </button>
        <button className="btn liveroom-quick-actions-btn" onClick={shareRoom}>
          <ShareOutlined></ShareOutlined>
        </button>
        <button
          className="btn leave-room-btn liveroom-quick-actions-btn"
          onClick={_leaveRoom}
        >
          <span>LEAVE</span>
          <ExitToAppRounded></ExitToAppRounded>
        </button>
      </div>
    </div>
  );
};

const LiveRoom = ({ user, animate, setSegment }) => {
  const [minimized, setMinimized] = useState(false);
  const isAdmin = useSelector((state) => state.audioRoom.hostControls);
  const isOpen = useSelector((state) => state.audioRoom.isOpen);
  const room = useSelector((state) => state.audioRoom.room);
  const waitlist = useSelector((state) => state.audioRoom.waitList) || [];
  // const [recording, setRecording] = useState(false);
  const recording = useSelector((state) => state.audioRoom.isRecording);
  const dispatch = useDispatch();

  const _leaveRoom = (event) => {
    event.stopPropagation();

    // console.log("leaving room");
    // console.log(user);

    if (isAdmin) {
      toast(
        <AudioCallNotification
          message={"You are currently the room host. Leaving will end the room"}
          acceptText="CONFIRM"
          rejectText="CANCEL"
          accept={() => {
            if (store.getState().audioRoom.isRecording) {
              recorder.stopRecording();
            }
            animate();
            leaveRoom(room, user, isAdmin);
          }}
          reject={() => {}}
        />,
        {
          autoClose: false,
        }
      );
    } else {
      animate();
      leaveRoom(room, user);
    }
  };

  const toggleMinimize = () => {
    // document
    //   .getElementById("audio-chat-container")
    //   .classList.toggle("minimized-room-state");
    if (!minimized) {
      document
        .getElementById("audio-chat-container")
        .classList.add("minimized-room-state");
    }
    setMinimized(!minimized);
  };

  useEffect(() => {
    if (!isOpen) {
      animate();
    }
  }, [isOpen]);

  const participantsTally =
    room.hosts.length + room.speakers.length + room.otherUsers.length;

  const toggleRecording = async () => {
    console.log("start recording");
    //TODO rememmber to check permisons
    // and update status of the recording feature
    if (!recording) {
      console.log("set to recording");
      dispatch(toggleRecordingAction(true));
      recorder.startRecording();
    } else {
      console.log("set to not recording");
      dispatch(toggleRecordingAction(false));
      recorder.stopRecording();
    }

    // const [fileHandle] = await window.showOpenFilePicker();
    // const file = await fileHandle.getFile();
    // recorder.uploadRecording(file);
  };

  return (
    <section className="audio-chat-segment liveroom-segment">
      {room.hosts.length ? (
        <>
          {minimized ? (
            <MinimizedRoom
              room={room}
              user={user}
              participantsTally={participantsTally}
              toggleMinimize={toggleMinimize}
              _leaveRoom={_leaveRoom}
            />
          ) : (
            <>
              <div className="audio-chat-header live-room-header">
                <KeyboardArrowDown
                  className="down-arrow-svg"
                  onClick={toggleMinimize}
                ></KeyboardArrowDown>
                <h2 className="">{room.title}</h2>
                <p
                  onClick={toggleRecording}
                  className={`detail-btn recording-btn ${
                    recording ? "blink" : ""
                  }`}
                >
                  <FiberManualRecord className="recording-icon"></FiberManualRecord>
                  <span>REC</span>
                </p>
              </div>
              <div className="audio-chat-body">
                <p className="participants-stat">
                  <PeopleAltOutlined></PeopleAltOutlined>
                  <span>{participantsTally} Participants</span>
                </p>
                <div className="chat-room-topics-list">
                  {room.topics.map((_topic) => (
                    <p key={_topic} className="detail-btn">
                      {_topic}
                    </p>
                  ))}
                </div>
                <div className="audio-chat-inner-body">
                  <div className="chat-participants-list">
                    {room.hosts.map((_user, _index) => (
                      <RoomMember
                        key={_index}
                        user={_user}
                        _index={"host" + _index}
                      />
                    ))}
                  </div>
                  {waitlist.length ? (
                    <div className=" waitlist-container">
                      <h2>Wait List</h2>
                      <div className="chat-participants-list">
                        {waitlist.map((_user, _index) => (
                          <RoomMember
                            user={_user}
                            _index={"waitlist" + _index}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {room.speakers.length ? (
                    <div className="chat-participants-list-container">
                      <p className="chat-participants-list-title">Speakers</p>
                      <div className="chat-participants-list">
                        {room.speakers.map((_user, _index) => (
                          <RoomMember
                            user={_user}
                            _index={"speakers" + _index}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {room.otherUsers.length ? (
                    <div className="chat-participants-list-container">
                      <p className="chat-participants-list-title">Listeners</p>
                      <div className="chat-participants-list">
                        {room.otherUsers.map((_user, _index) => (
                          <RoomMember
                            user={_user}
                            _index={"otherUsers" + _index}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <LiveRoomFooter _leaveRoom={_leaveRoom} setSegment={setSegment} />
            </>
          )}
        </>
      ) : (
        <RoomLoader _leaveRoom={_leaveRoom} />
      )}
    </section>
  );
};

export default LiveRoom;
