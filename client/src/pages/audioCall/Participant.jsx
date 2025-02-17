import React, { useState, useEffect, useRef } from "react";

const Participant = ({ participant, videoId }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  // const [videoStatus, setVideoStatus] = useState(true);
  // const [audioStatus, setAudioStatus] = useState(true);

  const videoRef = useRef();
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <>
      <div className="participant">
        {/* <video ref={videoRef} autoPlay={true} id={videoId} /> */}
        <audio ref={audioRef} autoPlay={true} muted={false} />
        {/* <div className="participant-actions">
          <button className="">
            {audioStatus ? (
              <FiMic fontSize="15px" color="black" />
            ) : (
              <FiMicOff fontSize="15px" color="black" />
            )}
          </button>
          <button className="">
            {videoStatus ? (
              <FiCamera fontSize="15px" color="black" />
            ) : (
              <FiCameraOff fontSize="15px" color="black" />
            )}
          </button>
        </div> */}
      </div>
    </>
  );
};

export default Participant;
