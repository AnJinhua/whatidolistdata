import { AudioContainer } from "./styles";
import { useState, useEffect, useRef, memo } from "react";
import {
  FaRegStopCircle,
  FaRegPlayCircle,
  FaRegPauseCircle,
} from "react-icons/fa";
import { MdOutlineReplay } from "react-icons/md";

function AudioPlayer({ audioFile, sending }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderPlayedWidth, setSliderPlayedWidth] = useState("0%");
  const [duration, setDuration] = useState("");
  const totalDuration = useRef("");
  const audio = useRef(new Audio(audioFile?.audioUrl?.cdnUrl));
  const interval = useRef();

  function play() {
    audio.current.play();
    interval.current = setInterval(seekUpdate, 50);
    setIsPlaying(true);
  }

  function pause() {
    audio.current.pause();
    clearInterval(interval.current);
    setIsPlaying(false);
    setDuration(totalDuration.current);
  }

  function inputChange(e) {
    const value = e.target.value;
    if (mediaLoaded) {
      const seekto = audio.current.duration * (value / 100);
      audio.current.currentTime = seekto;
      setSliderValue(value);
      setSliderPlayedWidth(`${value - 5.7 * (value / 100)}%`);
    }
  }

  function getCurrentTime() {
    // Calculate the time left and the total duration
    let currentMinutes = Math.floor(audio.current.currentTime / 60);
    let currentSeconds = Math.floor(
      audio.current.currentTime - currentMinutes * 60
    );

    // Add a zero to the single digit time values
    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }

    // Display the updated duration
    return currentMinutes + ":" + currentSeconds;
  }

  function seekUpdate() {
    let seekPosition = 0;
    // Check if the current track duration is a legible number
    if (!isNaN(audio.current.duration)) {
      seekPosition = audio.current.currentTime * (100 / audio.current.duration);
      setSliderValue(seekPosition);
      setSliderPlayedWidth(seekPosition + "%");
      setDuration(getCurrentTime());
    }
  }

  function loadAudioAgain() {
    audio.current.load();
    setError(false);
  }

  function calculateMediaDuration(media) {
    return new Promise((resolve, reject) => {
      media.onloadedmetadata = function () {
        // set the mediaElement.currentTime  to a high value beyond its real duration
        media.currentTime = Number.MAX_SAFE_INTEGER;
        // listen to time position change
        media.ontimeupdate = function () {
          media.ontimeupdate = function () {};
          // setting player currentTime back to 0 can be buggy too, set it first to .1 sec
          media.currentTime = 0.1;
          media.currentTime = 0;
          // media.duration should now have its correct value, return it...
          resolve(media.duration);
        };
      };
    });
  }

  useEffect(() => {
    if (!sending) {
      audio.current.addEventListener("error", () => {
        setError(true);
      });
      calculateMediaDuration(audio.current).then(() => {
        setMetadataLoaded(true);
      });
    }
  }, [sending]);

  useEffect(() => {
    if (metadataLoaded) {
      audio.current.addEventListener("canplaythrough", async () => {
        if (totalDuration.current === "") {
          setMediaLoaded(true);
          let durationMinutes = Math.floor(audio.current.duration / 60);
          let durationSeconds = Math.floor(
            audio.current.duration - durationMinutes * 60
          );
          // Add a zero to the single digit time values
          if (durationSeconds < 10) {
            durationSeconds = "0" + durationSeconds;
          }
          if (durationMinutes < 10) {
            durationMinutes = "0" + durationMinutes;
          }
          // Display the updated duration
          totalDuration.current = durationMinutes + ":" + durationSeconds;
          setDuration(totalDuration.current);
        }
      });
      audio.current.addEventListener("ended", () => {
        clearInterval(interval.current);
        setDuration(totalDuration.current);
        setSliderValue(0);
        setSliderPlayedWidth("0%");
        setIsPlaying(false);
      });
    }
  }, [metadataLoaded]);

  //if sending and metadata is not null and there is no error return  fareg
  return (
    <AudioContainer>
      <div className="audio_element">
        {!mediaLoaded && !error && sending ? (
          <FaRegStopCircle className="audio_icons" />
        ) : isPlaying && !error ? (
          <FaRegPauseCircle className="audio_icons" onClick={pause} />
        ) : !isPlaying && !error ? (
          <FaRegPlayCircle className="audio_icons" onClick={play} />
        ) : (
          <MdOutlineReplay className="audio_icons" onClick={loadAudioAgain} />
        )}

        <div className="audio_range">
          <span
            style={{
              width: sliderPlayedWidth,
            }}
            className="audioplayer__slider--played"
          />
          <input
            type="range"
            min="1"
            max="100"
            value={sliderValue}
            onChange={inputChange}
            className="audioplayer__slider"
          />
        </div>
      </div>
      <p className="audio_time">{duration}</p>
    </AudioContainer>
  );
}

export default memo(AudioPlayer);
