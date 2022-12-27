import { VideoEditorCotainer } from "./styles";
import { useState, useRef, useEffect } from "react";
import { CgCloseR } from "react-icons/cg";

import { FaCamera } from "react-icons/fa";
import { IconButton } from "@material-ui/core";

function MediaVideoPreveiw({
  file,
  setError,
  removeFile,
  setThumbnailFile,
  playVideo,
  home,
}) {
  const [videoLength, setVideoLength] = useState(null);
  const videoUrl = window.URL.createObjectURL(file);

  //states
  const [state, setState] = useState({
    isMuted: false,
    timings: [],
    playing: false,
  });

  const playPause = () => {
    if (state.playing) {
      playVideo.current.pause();
    } else {
      if (
        playVideo.current.currentTime >=
        state.timings[state.timings.length - 1].end
      ) {
        playVideo.current.pause();
        setState((prev) => ({
          ...prev,
          playing: false,
          currentlyGrabbed: { index: 0, type: "start" },
        }));
        playVideo.current.currentTime = state.timings[0].start;
      }
      playVideo.current.play();
    }
    setState((prev) => ({ ...prev, playing: !prev.playing }));
  };

  const captureThumbnail = () => {
    const canvas = document.createElement("canvas");
    canvas.width = playVideo.current.videoWidth;
    canvas.height = playVideo.current.videoHeight;

    canvas
      .getContext("2d")
      .drawImage(
        playVideo.current,
        0,
        0,
        playVideo.current.videoWidth,
        playVideo.current.videoHeight
      );

    fetch(canvas.toDataURL())
      .then((res) => res.blob())
      .then((blob) => {
        const NewFile = new File([blob], "video_thumbnail", {
          type: "image/png",
        });
        setThumbnailFile([{ file: NewFile, fileString: canvas.toDataURL() }]);
      });
  };
  //useEffect that runs when the video is loaded

  useEffect(() => {
    // Check if video ended

    playVideo?.current?.addEventListener("timeupdate", function () {
      if (playVideo?.current?.currentTime >= state.timings[0]?.end) {
        playVideo?.current?.pause();
        setState((prev) => ({ ...prev, playing: false }));
      }
    });

    let time = state.timings;
    playVideo.current.onloadedmetadata = () => {
      time.push({
        start: 0,
        end: playVideo?.current?.duration,
      });
      //convert playVideo.current.duration to minutes and seconds
      let minutes = Math.floor(playVideo.current.duration / 60);
      let seconds = Math.floor(playVideo.current.duration % 60);
      setVideoLength(`${minutes}:${seconds}`);

      if (playVideo.current.duration > 1800) {
        setError("upload videos less than 30 minutes");
      } else {
        setError(null);
      }
      setState((prev) => ({ ...prev, timings: time }));
    };
  }, [setError, state.timings]);

  return (
    <VideoEditorCotainer home={home}>
      <video
        className="video"
        autoload="metadata"
        ref={playVideo}
        onClick={playPause}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <IconButton onClick={removeFile} className="icon-btn">
        <CgCloseR className="image-preview-icon" />
      </IconButton>

      <IconButton onClick={captureThumbnail} className="capture-icon-btn">
        <FaCamera className="image-capture-icon" />
      </IconButton>
      {videoLength && <p className="duration-text">{videoLength}</p>}
    </VideoEditorCotainer>
  );
}

export default MediaVideoPreveiw;
