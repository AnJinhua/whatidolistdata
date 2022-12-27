import { MediaTextArea, MediaUploadContainer } from "./styles";
import { useState, useRef, useEffect, memo } from "react";
import { IconButton } from "@material-ui/core";
import { BiImageAdd } from "react-icons/bi";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { MdOutlineOndemandVideo } from "react-icons/md";
import DropZone from "./DropZone";
import ImagePreview from "./ImagePreview";
import AddMediaBtn from "./AddMediaBtn";
import { useCookies } from "react-cookie";
import uuid from "react-uuid";
import MediaVideoPreveiw from "./MediaVideoPreveiw";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../constants/api";
import useSWR from "swr";
import { fetchList } from "../../actions/list";
import { getMediaProcessed, postNewMedia } from "../../actions/media";
import { mutate } from "swr";
import { toast } from "react-toastify";
import {
  ADD_SENDING_MEDIA,
  REMOVE_SENDING_MEDIA,
  ADD_MEDIA_FILE,
  REMOVE_MEDIA_FILE,
} from "../../constants/actions";

function MediaUpload({ home }) {
  const [showUploadBtn, setshowUploadBtn] = useState(false);
  const [mediaInputValue, setMediaInputValue] = useState("");
  const inputRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const playVideo = useRef(null);
  const [displayComponent, setDisplayComponent] = useState("DROPZONE");
  const [{ user }] = useCookies(["user"]);
  const [{ token }] = useCookies(["token"]);
  const userCategory = user?.expertCategories[0];
  const { profile } = useSelector((state) => state.user);

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [error, setError] = useState(null);
  const [youtube, setYoutube] = useState("");
  const mediaFile = useSelector((state) => state.media.files);
  const catigoryList = useSelector((state) => state.list.List);
  const dispatch = useDispatch();
  const mediaUrl = `${API_URL}/media/all/${user?.slug}`;

  const { data } = useSWR(`${API_URL}/getExpertsCategoryList`);

  useEffect(() => {
    if (catigoryList.length === 0 && data) {
      dispatch(fetchList(data));
    }
  }, [catigoryList.length, data, dispatch]);

  //useEffect to toggle upload and cancel buttons
  useEffect(() => {
    if (mediaInputValue === "" && !mediaFile?.[0] && !youtube) {
      setshowUploadBtn(false);
    } else if (mediaInputValue !== "" || mediaFile?.[0] || youtube) {
      setshowUploadBtn(true);
    }
  }, [error, mediaFile, mediaInputValue, youtube]);

  //function regulates input height
  const handleInputHeight = () => {
    const maxheight = 140;
    const scrollHeight = inputRef.current.scrollHeight;
    if (scrollHeight < maxheight) {
      inputRef.current.style.height = scrollHeight + "px";
    }
  };

  const onChange = (e) => {
    setMediaInputValue(e.target.value);
    handleInputHeight();
  };

  const handleNewImageUpload = async (e) => {
    const file = e.target.files[0];

    dispatch({
      type: ADD_MEDIA_FILE,
      payload: { file: file },
    });
    setError(null);
    setThumbnailFile(null);
    setDisplayComponent("IMAGEPREVIEW");
  };

  const handleImgBtnClick = () => {
    imageRef.current.click();
  };

  const handleVideoBtnClick = () => {
    videoRef.current.click();
  };

  const handleDefaultVideofile = async (e) => {
    const file = e.target.files[0];
    if (file.size > 200000000) {
      setError("upload video story below 200mb");
    } else {
      dispatch({
        type: ADD_MEDIA_FILE,
        payload: { file: file },
      });
      setError(null);
      setThumbnailFile(null);
      setDisplayComponent("EDITOR");
    }
  };

  const removeFile = () => {
    setDisplayComponent("DROPZONE");
    dispatch({ type: REMOVE_MEDIA_FILE });
    setError(null);
    setThumbnailFile(null);
    setshowUploadBtn(false);
  };

  const clearMediaData = () => {
    removeFile();
    setMediaInputValue("");
    setYoutube("");
  };

  const mediaType = () => {
    if (
      mediaFile?.[0]?.file?.["type"].split("/")[0] === "image" &&
      mediaInputValue === ""
    ) {
      return "image";
    } else if (
      mediaFile?.[0]?.file?.["type"].split("/")[0] === "image" &&
      mediaInputValue !== ""
    ) {
      return "imageText";
    } else if (
      mediaFile?.[0]?.file?.["type"].split("/")[0] === "video" &&
      mediaInputValue === ""
    ) {
      return "video";
    } else if (
      mediaFile?.[0]?.file?.["type"].split("/")[0] === "video" &&
      mediaInputValue !== ""
    ) {
      return "videoText";
    } else if (mediaInputValue !== "") {
      return "text";
    } else if (youtube) {
      return "youtube";
    } else return null;
  };

  const getExpertCommunity = () =>
    catigoryList?.find((item) =>
      item.subcategories.find((subitem) => subitem.slug === userCategory)
    );

  //function that takes videoFile and convert to base64 string
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadNewMedia = async (data) => {
    try {
      const res = await postNewMedia(data, token);

      //remove sending media from redux
      dispatch({ type: REMOVE_SENDING_MEDIA, payload: res.data });

      mutate(mediaUrl);
      toast.success("successfully posted media", {
        position: "top-center",
        theme: "dark",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
      toast.error("posting media failed", {
        position: "top-center",
        theme: "dark",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleNewMediaUpload = async () => {
    setshowUploadBtn(false);
    let thumbnail = null;
    if (mediaType() === "videoText" || mediaType() === "video") {
      if (!thumbnailFile) {
        const videoData = new FormData();
        videoData.append("video", mediaFile?.[0]?.file);
        videoData.append("start_offset", 0.1);

        const res = await getMediaProcessed(videoData, "thumbnail");
        if (!res.ok) {
          clearMediaData();
          toast.error("posting media failed", {
            position: "top-center",
            theme: "dark",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }

        const thumbnailBlob = await res.blob();
        thumbnail = new File([thumbnailBlob], "video_thumbnail", {
          type: "image/png",
        });
      } else {
        thumbnail = thumbnailFile[0];
      }
    }

    let sendingData = {
      mediaId: uuid(),
      mediaType: mediaType(),
      community: getExpertCommunity()?.slug,
      userSlug: user.slug,
      youtubeLink: youtube,
      text: mediaInputValue,
      file: [{ cdnUrl: mediaFile?.[0]?.fileString }],
      thumbnail: !mediaFile?.[0]
        ? null
        : mediaType() === "videoText" || mediaType() === "video"
        ? [{ cdnUrl: window.URL.createObjectURL(thumbnail) }]
        : [
            {
              cdnUrl: window.URL.createObjectURL(mediaFile?.[0]?.file),
            },
          ],
    };

    const mediaData = new FormData();
    mediaData.append("mediaId", sendingData.mediaId);
    mediaData.append("mediaType", mediaType());
    mediaFile?.forEach((f) => {
      mediaData.append("media", f.file);
    });
    if (mediaType() === "videoText" || mediaType() === "video") {
      mediaData.append("thumbnail", thumbnail);
    }
    if (mediaType() === "imageText" || mediaType() === "image") {
      mediaData.append("thumbnail", mediaFile?.[0]?.file);
    }
    mediaData.append("text", mediaInputValue);
    mediaData.append("userSlug", user.slug);
    mediaData.append("community", getExpertCommunity()?.slug);
    mediaData.append("youtubeLink", youtube);

    if (!error) {
      dispatch({ type: ADD_SENDING_MEDIA, payload: sendingData });
      clearMediaData();
      uploadNewMedia(mediaData);
    }
  };

  return (
    <MediaUploadContainer>
      <div className="flex-center top-upload-container">
        <img
          loading="lazy"
          width="40"
          height="40"
          style={{
            height: "3rem",
            width: "3rem",
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer",
            marginRight: "1rem",
          }}
          src={
            profile?.imageUrl ? profile?.imageUrl?.cdnUrl : "/img/profile.png"
          }
          alt="profile"
        />

        <MediaTextArea
          ref={inputRef}
          value={mediaInputValue}
          onChange={(e) => onChange(e)}
          placeholder="share what you do"
        />
      </div>

      {!home && (
        <div className="bottom-upload-container">
          <IconButton className="upload-btn" onClick={handleImgBtnClick}>
            <BiImageAdd className="image icon" />
            <p className="upload-btn-text">image</p>
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
          </IconButton>
          <IconButton className="upload-btn" onClick={handleVideoBtnClick}>
            <AiOutlineVideoCameraAdd className="video icon" />
            <p className="upload-btn-text">video</p>
            <input
              type="file"
              ref={videoRef}
              onChange={handleDefaultVideofile}
              accept="video/*"
              style={{
                display: "none",
              }}
            />
          </IconButton>
          <IconButton
            className="upload-btn"
            onClick={() => setDisplayComponent("YOUTUBE")}
          >
            <MdOutlineOndemandVideo className="youtube icon" />
            <p className="upload-btn-text">youtube embed</p>
          </IconButton>
        </div>
      )}

      {/* youtube input */}
      {displayComponent === "YOUTUBE" && (
        <div className="youtube-container">
          <input
            type="text"
            className="youtube-area"
            value={youtube}
            onChange={(e) => {
              let url = e.target.value;
              const regExp =
                /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
              const match = url.match(regExp);
              if (match && match[2].length == 11) {
                setYoutube(url);
              } else {
                // Do anything for not being valid
                alert("paste valid youtube video link");
                e.target.value = "";
              }
            }}
            placeholder="paste youtube embed url here..."
          />
        </div>
      )}

      {/* dropzone */}

      {displayComponent === "DROPZONE" && (
        <DropZone
          getBase64={getBase64}
          handleDefaultVideofile={handleDefaultVideofile}
          handleNewImageUpload={handleNewImageUpload}
        />
      )}

      {displayComponent === "IMAGEPREVIEW" && (
        <ImagePreview
          file={mediaFile?.[0]?.file}
          removeFile={removeFile}
          home={home}
        />
      )}

      {displayComponent === "EDITOR" && (
        <MediaVideoPreveiw
          file={mediaFile?.[0]?.file}
          setError={setError}
          removeFile={removeFile}
          setThumbnailFile={setThumbnailFile}
          playVideo={playVideo}
          home={home}
        />
      )}

      {thumbnailFile && (
        <div className="thumbnail-container">
          <img
            loading="lazy"
            src={thumbnailFile[0].fileString}
            alt="thumbnail"
            className="thumbnail-image"
          />
        </div>
      )}

      {error && (
        <div className={"warning"}>
          {" "}
          <div>{error}</div>
        </div>
      )}

      {showUploadBtn && !error && (
        <AddMediaBtn
          clearMediaData={clearMediaData}
          handleNewMediaUpload={handleNewMediaUpload}
        />
      )}
    </MediaUploadContainer>
  );
}

export default memo(MediaUpload);
