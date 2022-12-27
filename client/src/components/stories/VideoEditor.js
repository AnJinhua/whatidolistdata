import { VideoEditorCotainer } from "./styles";
import { useState, useEffect, useRef } from "react";
import { CgCloseR } from "react-icons/cg";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

import { FaPause, FaPlay } from "react-icons/fa";
import { IconButton } from "@material-ui/core";

function VideoEditor({
  file,
  setError,
  removeFile,
  playVideo,
  trimOffset,
  setTrimOffset,
  poster,
}) {
  const [videoLength, setVideoLength] = useState(null);
  const trimPresets = useRef({
    start_offset: 0,
    end_offset: 1,
  });

  const [playing, setPlaying] = useState(false);
  const videoUrl = file;

  //states

  const playPause = () => {
    if (playing) {
      playVideo.current.pause();
    } else {
      if (playVideo.current.currentTime >= trimOffset.end) {
        playVideo.current.pause();
        setPlaying(false);

        playVideo.current.currentTime = trimOffset.start;
      }

      playVideo.current.play();
    }
    setPlaying((xstate) => !xstate);
  };

  //useEffect that runs when the video is loaded

  useEffect(() => {
    // Check if video ended

    playVideo.current.onloadedmetadata = () => {
      if (playVideo?.current?.duration > 120) {
        setError("upload videos less than 2 minutes");
      } else {
        setError(null);
      }
      setTrimOffset({
        start: 0,
        end:
          playVideo?.current?.duration > 30 ? 30 : playVideo?.current?.duration,
        duration: playVideo?.current?.duration,
      });

      trimPresets.current.start_offset = 0;
      trimPresets.current.end_offset =
        playVideo?.current?.duration > 30 ? 30 : playVideo?.current?.duration;

      //convert playVideo.current.duration to minutes and seconds
      let minutes = Math.floor(playVideo?.current?.duration / 60);
      let seconds = Math.floor(playVideo?.current?.duration % 60);
      setVideoLength(`${minutes}:${seconds}`);
    };

    playVideo?.current?.addEventListener("timeupdate", function () {
      if (playVideo?.current?.currentTime >= trimPresets?.current?.end_offset) {
        playVideo?.current?.pause();
        setPlaying(false);
        playVideo.current.currentTime = trimPresets.current.start_offset;
      }
    });
  }, [playVideo, setError, setTrimOffset, trimOffset]);

  return (
    <VideoEditorCotainer>
      <div className="video-preview-container">
        <video
          className="video"
          autoload="metadata"
          poster={window.URL.createObjectURL(poster)}
          ref={playVideo}
          onClick={playPause}
        >
          <source src={window.URL.createObjectURL(videoUrl)} type="video/mp4" />
        </video>
        <IconButton onClick={removeFile} className="icon-btn">
          <CgCloseR className="image-preview-icon" />
        </IconButton>

        {videoLength && <p className="duration-text">{videoLength}</p>}
      </div>

      <div className="icon-options-container">
        <IconButton onClick={playPause} className="icon-option-btn">
          {playing ? (
            <FaPause className="option-icon" />
          ) : (
            <FaPlay className="option-icon" />
          )}
        </IconButton>
        <div className="playback-icon-container">
          <Nouislider
            range={{ min: 0, max: trimOffset.duration }}
            limit={30}
            background={"#000"}
            onEnd={(value) => {
              setTrimOffset((oldValue) => ({
                ...oldValue,
                start: value[0],
                end: value[1],
              }));
              playVideo.current.currentTime = value[0];
              trimPresets.current.start_offset = value[0];
              trimPresets.current.end_offset = value[1];
            }}
            start={[trimOffset.start, trimOffset.end]}
            behaviour="tap-drag"
            connect
          />
        </div>
        {/* <IconButton onClick={captureThumbnail} className="icon-option-btn">
          <FaCamera className="option-icon" />
        </IconButton> */}
      </div>
    </VideoEditorCotainer>
  );
}

export default VideoEditor;
