import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { MdOutlineLightbulb } from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import { GoMute, GoUnmute } from "react-icons/go";
import { RiShareForwardLine } from "react-icons/ri";
import { API_URL } from "../../../constants/api";
import { ContentCard } from "./styles";
import { IconButton } from "@material-ui/core";
import { SHOWLOGIN } from "../../../constants/actions";
import { useHistory } from "react-router";
import MediaTextPreview from "../../MediaFeeds/PreviewElements/MediaTextPreview";

const VideoCard = ({
  videoUrl,
  userSlug,
  thumbnail,
  inspired,
  id,
  shares,
  mediaType,
  text,
}) => {
  const videoRef = useRef(null);
  const user = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();
  const history = useHistory();
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const { data, error } = useSWR(`${API_URL}/getExpertDetail/${userSlug}`);
  const getVideoUrl = `${API_URL}/feed/for-you/${user?.slug}?page=0`;
  const commentUrl = `${API_URL}/media/page/comment/${id}?page=${0}`;
  const { data: mediaComments } = useSWR(commentUrl);

  const handleProfile = () => {
    history.push(`/expert/${data?.data?.expertCategories[0]}/${userSlug}`);
  };

  const beInspired = async () => {
    if (user?.slug) {
      try {
        if (inspired?.includes(user?.slug)) {
          // unlike and change the icon
          await axios.post(`${API_URL}/media/unlikeVideo`, {
            id,
            userSlug: user?.slug,
          });

          mutate(getVideoUrl);
          // setIsInspired(false);
        } else {
          // like and change the icon
          await axios.post(`${API_URL}/media/likeVideo`, {
            id,
            userSlug: user?.slug,
          });

          mutate(getVideoUrl);
          // setIsInspired(true);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      dispatch({
        type: SHOWLOGIN,
        payload: true,
      });
    }
  };

  const goMedia = () => {
    if (user?.slug) {
      history.push({
        state: { media: true, mediaId: id },
      });
    } else {
      dispatch({
        type: SHOWLOGIN,
        payload: true,
      });
    }
  };

  const openShare = () => {
    if (user?.slug) {
      history.push({
        state: { share: true, mediaId: id },
      });
    } else {
      dispatch({
        type: SHOWLOGIN,
        payload: true,
      });
    }
  };

  const callBackFunction = useCallback((entries) => {
    const [entry] = entries;

    if (entry.isIntersecting) {
      //play intersecting video and pause old videos and set as global video
      entry.target.play();
    } else {
      entry.target.pause();
    }
  }, []);

  const callBackOptions = useMemo(
    () => ({
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    }),
    []
  );

  const onVideoClickHandler = () => {
    if (isPlaying) {
      setIsPlaying(false);
      videoRef.current.pause();
    } else {
      setIsPlaying(true);
      videoRef.current.play();
    }
  };

  const onPlayVideoHandler = () => {
    setIsPlaying(true);
    videoRef.current.play();
  };

  const onPauseVideoHandler = () => {
    setIsPlaying(false);
    videoRef.current.pause();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      callBackFunction,
      callBackOptions
    );

    const current = videoRef.current;

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (current) observer.unobserve(current);
    };

    // dependency array
  }, [callBackFunction, callBackOptions]);

  const renderMediaContent = () => {
    if (mediaType === "image" || mediaType === "imageText") {
      return (
        <img loading="lazy" src={thumbnail} alt="" className="video-display" />
      );
    } else if (mediaType === "text") {
      return <MediaTextPreview text={text} />;
    } else if (mediaType === "video" || mediaType === "videoText") {
      return (
        <video
          loop
          ref={videoRef}
          poster={thumbnail}
          type="video/mp4"
          autoload="metadata"
          className="video-display"
          muted={isMuted}
          onClick={onVideoClickHandler}
          id={id}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      );
    }
    return null;
  };

  return (
    <ContentCard>
      <div>
        <div className="user-container" onClick={handleProfile}>
          <div className="img-container">
            <>
              <img
                loading="lazy"
                width={50}
                height={50}
                className="img"
                src={
                  data?.data?.imageUrl?.cdnUrl
                    ? data?.data?.imageUrl?.cdnUrl
                    : "/img/profile.png"
                }
                alt="user-profile"
              />
            </>
          </div>
          <div>
            <div className="user-details">
              <span className="user-name">
                {`${data?.data?.profile?.firstName} ${data?.data?.profile?.lastName}`}{" "}
              </span>
              <span className="user-expertise">
                {data?.data?.expertCategories[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="video-display-container">
        <div className="pausePlayIconCont">
          <div className="video-container">
            {renderMediaContent()}
            {/*  */}
          </div>
          <div className="play-button-container">
            {!isPlaying && (
              <BsFillPlayFill
                className="playIcon"
                onClick={() => onPlayVideoHandler()}
              />
            )}
          </div>

          {isMuted ? (
            <GoMute className="muteButton" onClick={() => setIsMuted(false)} />
          ) : (
            <GoUnmute
              className="UnmuteButton"
              onClick={() => setIsMuted(true)}
            />
          )}
        </div>
        <div className="video-sidebar">
          <div className="side-icon-container">
            <IconButton className="sidebar-icons" onClick={beInspired}>
              {inspired?.includes(user?.slug) ? (
                <HiOutlineLightBulb className="inspired" />
              ) : (
                <MdOutlineLightbulb />
              )}
            </IconButton>
            <p className="sidebar-count">{inspired?.length}</p>
          </div>

          <div className="side-icon-container">
            <IconButton className="sidebar-icons" onClick={goMedia}>
              <FaRegCommentDots />
            </IconButton>
            <p className="sidebar-count">
              {mediaComments ? mediaComments?.length : "_"}
            </p>
          </div>

          <div className="side-icon-container">
            <IconButton className="sidebar-icons" onClick={openShare}>
              <RiShareForwardLine />
            </IconButton>
            <p className="sidebar-count">{shares?.length || "0"} </p>
          </div>
          {/* {isVideoMuted ? (
            <button
              onClick={() => setIsVideoMuted(false)}
              className="play-button speaker-mobile"
            >
              <HiVolumeOff />
            </button>
          ) : (
            <button
              onClick={() => setIsVideoMuted(true)}
              className="play-button speaker-mobile"
            >
              <HiVolumeUp />
            </button>
          )} */}
        </div>
      </div>
    </ContentCard>
  );
};

export default VideoCard;
