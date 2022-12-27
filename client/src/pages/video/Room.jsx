import React, { useEffect, useState, useRef, useCallback } from "react";
import Participant from "./Participant";
import { MdCallEnd } from "react-icons/md";
import { FiMic, FiCamera, FiCameraOff, FiMicOff } from "react-icons/fi";
import { AiOutlineMessage } from "react-icons/ai";
import { FaChalkboard } from "react-icons/fa";
import ChatApp from "../videoChat/ChatScreen";
import DrawingBoard from "../DrawingBoard/Container";
import Drawer from "../../components/ui/drawer";
import axios from "axios";
import io from "socket.io-client";
import { API_URL } from "../../constants/api";
const Chat = require("twilio-chat");

const Room = ({ room, handleLogout, identity, roomId }) => {
  const [participants, setParticipants] = useState([]);
  const [cameraStatus, setCameraStatus] = useState(true);
  const [audioStatus, setAudioStatus] = useState(true);
  const [chatOpen, setchatOpen] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [init, setInit] = useState("");
  const channelRef = useRef(null);
  const messageRef = useRef([]);
  const [state, setState] = useState({
    text: "",
    messages: [],
    loading: false,
  });
  const [newMessage, setNewMessage] = useState(false)

  const scrollDiv = useRef();
  const socket = io.connect(API_URL);
  socket.on("canvas-data", (data) => {
    setBoardOpen(true);
  });

  const getToken = async () => {
    const response = await axios.get(API_URL + "/createchatsession/" + identity);
    const { data } = response;
    return data.token;
  };

  const chatInit = async () => {
    let token = "";
    setState({ loading: true });
    try {
      token = await getToken();
    } catch {
      throw new Error("unable to get token, please reload this page");
    }
    const client = await Chat.Client?.create(token);
    client.on("tokenAboutToExpire", async () => {
      const token = await getToken();
      client.updateToken(token);
    });

    client.on("tokenExpired", async () => {
      const token = await getToken();
      client.updateToken(token);
    });

    client.on("channelJoined", async (channel) => {
      const messages = await channel.getMessages();
      setState({
        messages: messages.items || [],
        text: state.text,
        loading: state.loading,
      });
      scrollToBottom();
    });

    try {
      const channel = await client.getChannelByUniqueName(roomId);
      await joinChannel(channel);
      setState({ channel: channel, loading: false });
      channelRef.current = channel;

      return;
    } catch {
      try {
        const channel = await client.createChannel({
          uniqueName: roomId,
          friendlyName: roomId,
        });
        await joinChannel(channel);
        setState({ channel: channel, loading: false });
        channelRef.current = channel;
      } catch (error) {
        // throw new Error("unable to create channel, please reload this page");
      }
    }
  };

  useEffect(() => {
    chatInit();
  }, [init]);

  useEffect(() => {
    if (chatOpen) {
      setNewMessage(false)
    }
  }, [chatOpen])
  const handleMessageAdded = (message) => {
    if (!chatOpen) {
      setNewMessage(true)
    }
    messageRef.current = [...messageRef.current, message]
    setState({
      messages: messageRef.current,
    });
    scrollToBottom();
  };

  const joinChannel = async (channel) => {
    if (channel.state.status !== "joined") {
      await channel.join();
    }
    channel.on("messageAdded", handleMessageAdded);
  };

  const scrollToBottom = () => {
    try {
      const scrollHeight = scrollDiv.current.scrollHeight;
      const height = scrollDiv.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    } catch (error) {}
  };

  const sendMessage = () => {
    const { text, messages } = state;
    messageRef.current = messages;
    if (text && String(text).trim()) {
      channelRef.current.sendMessage(text);
      setState({ text: "", loading: false, messages: messages });
    }
  };

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  const streamedVideoHandler = () => {
    if (cameraStatus) {
      room.localParticipant.videoTracks.forEach((publication) => {
        publication.track.disable();
      });
      setCameraStatus(!cameraStatus);
    } else {
      room.localParticipant.videoTracks.forEach((publication) => {
        publication.track.enable();
      });
      setCameraStatus(!cameraStatus);
    }
  };

  const streamedAudioHandler = () => {
    if (audioStatus) {
      room.localParticipant.audioTracks.forEach((publication) => {
        publication.track.disable();
      });
      setAudioStatus(!audioStatus);
    } else {
      room.localParticipant.audioTracks.forEach((publication) => {
        publication.track.enable();
      });
      setAudioStatus(!audioStatus);
    }
  };
  const handleMuteAudio = () => {
    streamedAudioHandler();
  };

  const handleVideoOff = () => {
    streamedVideoHandler();
  };
  const remoteParticipants = participants.map((participant) => (
    <div className="remote-participant">
      <Participant
        key={participant.sid}
        videoId={participant.sid + "-video"}
        participant={participant}
      />
    </div>
  ));

  return (
    <div className="meeting-room">
      {chatOpen && (
        <Drawer place="left">
          <ChatApp
            sendMessage={sendMessage}
            chatState={{ ...state }}
            setChatProps={setState}
            scrollDiv={scrollDiv}
            identity={identity}
          />
        </Drawer>
      )}

      <div className="room-board">
        <div className="room">
          {room && (
            <div className="local-participant">
              <Participant
                key={room.localParticipant.sid}
                participant={room.localParticipant}
                videoId={"local-video"}
              />
            </div>
          )}
          {remoteParticipants}
        </div>
      </div>
      {boardOpen && <DrawingBoard roomId={roomId} socket={socket} />}
      <div className="callActions">
        <button className="callBtn" onClick={() => setchatOpen(!chatOpen)}>
          {newMessage ? <AiOutlineMessage fontSize="30px" color="red" /> : <AiOutlineMessage fontSize="30px" color="black" />}
        </button>
        <button className="callBtn" onClick={handleMuteAudio}>
          {audioStatus ? (
            <FiMic fontSize="30px" color="black" />
          ) : (
            <FiMicOff fontSize="30px" color="black" />
          )}
        </button>
        <button className="endCallBtn" onClick={handleLogout}>
          <MdCallEnd fontSize="40px" color="white" />
        </button>
        <button className="callBtn" onClick={handleVideoOff}>
          {cameraStatus ? (
            <FiCamera fontSize="30px" color="black" />
          ) : (
            <FiCameraOff fontSize="30px" color="black" />
          )}
        </button>
        <button className="callBtn" onClick={() => setBoardOpen(!boardOpen)}>
          <FaChalkboard fontSize="30px" color="black" />
        </button>
      </div>
    </div>
  );
};

export default Room;