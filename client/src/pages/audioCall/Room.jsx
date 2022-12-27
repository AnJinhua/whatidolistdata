import React, { useEffect, useState } from "react";
import Participant from "./Participant";
import { MdCallEnd } from "react-icons/md";
import { FiMic, FiMicOff } from "react-icons/fi";

const Room = ({ room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);
  const [audioStatus, setAudioStatus] = useState(true);

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

  const remoteParticipants = participants.map((participant) => (
    <div className="remote-audio-participant2">
      <Participant
        key={participant.sid}
        videoId={participant.sid + "-video"}
        participant={participant}
      />
    </div>
  ));

  return (
    <div className="meeting-room">
      <div className="room-board">
        <div className="room">
          {room && (
            <div className="remote-audio-participant">
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
      <div className="callActions">
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
      </div>
    </div>
  );
};

export default Room;
