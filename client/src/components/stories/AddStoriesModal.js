import { useState, useRef, useEffect, memo, useMemo } from "react";
import { StoriesModal } from "./styles";
import { BiImageAdd } from "react-icons/bi";
import { RiVideoAddLine } from "react-icons/ri";
import { CgCloseR } from "react-icons/cg";
import { IconButton } from "@material-ui/core";
import { useCookies } from "react-cookie";
import { API_URL } from "../../constants/api";
import { useDispatch, useSelector } from "react-redux";
import useSWR, { mutate } from "swr";
import { fetchList } from "../../actions/list";
import VideoEditor from "./VideoEditor";
import { postNewStory } from "../../actions/stories";
import uuid from "react-uuid";
import { sendMassNotification } from "../../subscription";
import { getMediaProcessed } from "../../actions/media";
import {
  ADD_STORY_FILE,
  REMOVE_STORY_FILE,
  ADD_SENDING_STORIES,
  REMOVE_SENDING_STORIES,
  TOGGLE_STORY_MODAL,
  TOGGLE_PREVIEW_COMPONENT,
} from "../../constants/actions";
// import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

function AddStoriesModal() {
  const [textStories, setTextStories] = useState("");
  const storyFile = useSelector((state) => state.stories.files);
  const [trimOffset, setTrimOffset] = useState({
    start: 0,
    end: 1,
    duration: 2,
  });
  const openModal = useSelector((state) => state.stories.openModal);
  const previewComponent = useSelector(
    (state) => state.stories.previewComponent
  );
  //usememo to store value of storyFile
  // const storyFileUrlMemo = useMemo(
  //   () => storyFile?.file && window.URL.createObjectURL(storyFile?.file),
  //   [storyFile?.file]
  // );

  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const inputRef = useRef(null);
  const errorRef = useRef(null);
  const playVideo = useRef(null);
  const [{ user, token }] = useCookies(["user"]);

  const dispatch = useDispatch();
  const catigoryList = useSelector((state) => state.list.List);
  const userCategory = user?.expertCategories[0];
  const [error, setError] = useState(null);

  const { data } = useSWR(`${API_URL}/getExpertsCategoryList`);
  const storiesUrl = `${API_URL}/stories/${user?.slug}`;

  // const ffmpeg = createFFmpeg({
  //   log: true,
  // });

  useEffect(() => {
    if (catigoryList.length === 0 && data) {
      dispatch(fetchList(data));
    }
  }, [catigoryList.length, data, dispatch]);

  const handleTextStories = (e) => {
    if (e.target.value.length < 201) {
      setTextStories(e.target.value);
    }
  };

  // const trimVideo = async (file, start_offset, duration) => {
  //   await ffmpeg.load();
  //   ffmpeg.FS("writeFile", "video.mp4", await fetchFile(file));

  //   await ffmpeg.run(
  //     "-i",
  //     "video.mp4",
  //     "-t",
  //     duration,
  //     "-ss",
  //     start_offset,
  //     "-codec:v",
  //     "libx264",
  //     "-profile:v",
  //     "main",
  //     "-preset",
  //     "slow",
  //     "-b:v",
  //     "400k",
  //     "-maxrate",
  //     "400k",
  //     "-bufsize",
  //     "800k",
  //     "-vf",
  //     `scale=-1:360`,
  //     "-threads",
  //     "0",
  //     "-b:a",
  //     "96k",
  //     "-f",
  //     "mp4",
  //     "trimed.mp4"
  //   );
  //   const data = ffmpeg.FS("readFile", "video.mp4");

  //   return new Blob([data.buffer], { type: "video/mp4" });
  // };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImgBtnClick = () => {
    imageRef.current.click();
  };

  const handleVideoBtnClick = () => {
    videoRef.current.click();
  };

  const handleNewImageUpload = async (e) => {
    const file = e.target.files[0];

    dispatch({
      type: ADD_STORY_FILE,
      payload: { thumbnail: file },
    });

    setError(null);
    dispatch({
      type: TOGGLE_PREVIEW_COMPONENT,
      payload: "IMAGEPREVIEW",
    });
  };

  const handleDefaultVideofile = async (e) => {
    const file = e.target.files[0];
    if (file.size > 250000000) {
      setError("upload maximum file size 250mb");
    } else {
      const videoData = new FormData();
      videoData.append("video", file);
      videoData.append("start_offset", 1);
      const res = await getMediaProcessed(videoData, "thumbnail");
      if (!res.ok) {
        throw new Error("creating thumbnail failed");
      }

      const thumbnailBlob = await res.blob();
      let thumbnailFile = new File([thumbnailBlob], "video_thumbnail", {
        type: "image/png",
      });
      dispatch({
        type: ADD_STORY_FILE,
        payload: { file: file, thumbnail: thumbnailFile },
      });
      setError(null);
      dispatch({
        type: TOGGLE_PREVIEW_COMPONENT,
        payload: "EDITOR",
      });
    }
  };

  const removeFile = () => {
    dispatch({
      type: TOGGLE_PREVIEW_COMPONENT,
      payload: "DROPZONE",
    });
    setError(null);
    dispatch({ type: REMOVE_STORY_FILE });
  };

  const clearStroyData = () => {
    dispatch({
      type: TOGGLE_STORY_MODAL,
      payload: false,
    });
    setTextStories("");
    removeFile();
  };

  const storyType = () => {
    if (
      storyFile?.thumbnail?.["type"].split("/")[0] === "image" &&
      textStories === "" &&
      !storyFile?.file
    ) {
      return "image";
    }
    if (!storyFile?.file && !storyFile?.thumbnail && textStories !== "") {
      return "text";
    }
    if (
      storyFile?.thumbnail?.["type"].split("/")[0] === "image" &&
      textStories !== "" &&
      !storyFile?.file
    ) {
      return "imageText";
    }
    if (
      storyFile?.file?.["type"].split("/")[0] === "video" &&
      textStories === ""
    ) {
      return "video";
    }
    if (
      storyFile?.file?.["type"].split("/")[0] === "video" &&
      textStories !== ""
    ) {
      return "videoText";
    }
    return;
  };

  const getExpertCommunity = () =>
    catigoryList.find((item) =>
      item.subcategories.find((subitem) => subitem.slug === userCategory)
    );

  const uploadNewStory = async (data) => {
    try {
      const res = await postNewStory(data, token);
      // console.log("newStory", res.data);

      dispatch({ type: REMOVE_SENDING_STORIES, payload: res.data });

      mutate(storiesUrl, (story) => {
        const newStory = [...story, res.data];
        return newStory;
      });

      let notificationData = {
        title: `${user?.firstName} ${user.lastName} posted a new story`,
        action: "view story",
        userSlug: user.slug,
        endUrl: `/community-stories/${res?.data?.community}/${res?.data?._id}`,
      };
      // sendMassNotification(notificationData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNewStoriesUpload = async () => {
    let thumbnail = storyFile?.thumbnail;

    const videoData = new FormData();

    if (storyType() === "videoText" || storyType() === "video") {
      videoData.append("video", storyFile?.file);
      videoData.append("start_offset", trimOffset.start + 1);
      videoData.append("duration", trimOffset.end - trimOffset.start);

      const res = await getMediaProcessed(videoData, "thumbnail");
      if (!res.ok) {
        throw new Error("creating thumbnail failed");
      }

      const thumbnailBlob = await res.blob();
      thumbnail = new File([thumbnailBlob], "video_thumbnail", {
        type: "image/png",
      });
    }

    let sendingData = {
      storyId: uuid(),
      storyType: storyType(),
      text: textStories,
      userSlug: user.slug,
      thumbnail: storyFile && { cdnUrl: window.URL.createObjectURL(thumbnail) },
    };

    const storyData = new FormData();
    storyData.append("storyId", sendingData.storyId);
    storyData.append("storyType", storyType());

    storyData.append("thumbnail", thumbnail);

    storyData.append("text", textStories);
    storyData.append("userSlug", user.slug);
    storyData.append("community", getExpertCommunity()?.slug);

    if (!storyType()) return;

    if (error) {
      errorRef.current.scrollIntoView({
        behavior: "smooth",
      });

      return;
    }

    dispatch({ type: ADD_SENDING_STORIES, payload: sendingData });

    if (storyType() === "videoText" || storyType() === "video") {
      // const thumbnailBlob = await trimVideo(
      //   storyFile?.file,
      //   trimOffset.start,
      //   trimOffset.end - trimOffset.start
      // );
      // processedVideo = new File([thumbnailBlob], "video_trim", {
      //   type: "video/mp4",
      // });

      storyData.append("story", storyFile?.file);
    }

    clearStroyData();

    uploadNewStory(storyData);
  };

  return (
    <StoriesModal
      open={openModal}
      onClose={() => {
        dispatch({
          type: TOGGLE_STORY_MODAL,
          payload: false,
        });
      }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className="modal-container">
        <div>
          <p className="text-lg">add story</p>

          <div>
            <div className="flex-container flex-between">
              <p className="text-md">what's happening?</p>
              <p className="text-sm">{textStories.length}/200</p>
            </div>

            <textarea
              ref={inputRef}
              value={textStories}
              onChange={handleTextStories}
              className="text-area"
              placeholder="Write your story here..."
            />

            <div className="flex-container">
              <IconButton onClick={handleImgBtnClick} className="add-icon-btn">
                <BiImageAdd className="icon" />
              </IconButton>

              <input
                type="file"
                ref={imageRef}
                onChange={handleNewImageUpload}
                accept="image/*"
                multiple
                style={{
                  display: "none",
                }}
              />

              <IconButton
                onClick={handleVideoBtnClick}
                className="add-icon-btn"
              >
                <RiVideoAddLine className="icon" />
              </IconButton>

              <input
                type="file"
                ref={videoRef}
                onChange={handleDefaultVideofile}
                accept="video/*"
                style={{
                  display: "none",
                }}
              />
            </div>
          </div>
        </div>

        <div className="preview-editor">
          {previewComponent === "EDITOR" && (
            <div className="image-preview-container">
              <VideoEditor
                file={storyFile?.file}
                poster={storyFile?.thumbnail}
                playVideo={playVideo}
                removeFile={removeFile}
                setError={setError}
                trimOffset={trimOffset}
                setTrimOffset={setTrimOffset}
              />
            </div>
          )}

          {previewComponent === "IMAGEPREVIEW" && (
            <div className="image-preview-container">
              <img
                loading="lazy"
                className="image-preview"
                src={window.URL.createObjectURL(storyFile?.thumbnail)}
                alt=""
              />
              <IconButton onClick={removeFile} className="icon-btn">
                <CgCloseR className="image-preview-icon" />
              </IconButton>
            </div>
          )}

          {/* warning message */}
          {error && (
            <div className={"warning"} ref={errorRef}>
              {" "}
              <div>{error}</div>
            </div>
          )}
        </div>

        <div className="post-submit">
          <div className="btn-container">
            <button className="btn" onClick={clearStroyData}>
              cancel
            </button>
            <button className="btn" onClick={handleNewStoriesUpload}>
              post
            </button>
          </div>
        </div>
      </div>
    </StoriesModal>
  );
}

export default memo(AddStoriesModal);
