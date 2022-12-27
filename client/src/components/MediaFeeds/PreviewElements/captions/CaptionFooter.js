import { CaptionFooterContainer, CaptionTextArea } from "./caption.styles";
import { IconButton } from "@material-ui/core";
import { BiSend } from "react-icons/bi";
import { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";
import uuid from "react-uuid";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { postNewMediaComment } from "../../../../actions/media";
import useSWR, { mutate } from "swr";
import { API_URL } from "../../../../constants/api";
import { sendNotification } from "../../../../subscription";
import { SHOWLOGIN } from "../../../../constants/actions";
import { HiOutlineLightBulb } from "react-icons/hi";
import { MdOutlineLightbulb } from "react-icons/md";
import { RiShareForwardLine } from "react-icons/ri";
import axios from "axios";

function CaptionFooter({ viewedMedia, setSendingMediaComment }) {
  const [commentValue, setCommentValue] = useState("");
  const [isInspired, setIsInspired] = useState(false);
  const textAreaRef = useRef(null);
  const [{ user }] = useCookies(["user"]);
  const [{ token }] = useCookies(["token"]);
  const reduxUser = useSelector(({ user }) => user.profile);
  const history = useHistory();
  const dispatch = useDispatch();

  const getVideoUrl = `${API_URL}/feed/for-you/${user?.slug}?page=0`;
  const mediaApiUrl = `${API_URL}/media/fetch/${viewedMedia?._id}`;
  const commentUrl = `${API_URL}/media/page/comment/${
    viewedMedia?._id
  }?page=${0}`;

  const beInspired = async () => {
    if (user?.slug) {
      try {
        if (viewedMedia?.inspired?.includes(user?.slug)) {
          // unlike and change the icon
          await axios.post(`${API_URL}/media/unlikeVideo`, {
            id: viewedMedia?._id,
            userSlug: user?.slug,
          });

          mutate(mediaApiUrl);
          mutate(getVideoUrl);
          setIsInspired(false);
        } else {
          // like and change the icon
          await axios.post(`${API_URL}/media/likeVideo`, {
            id: viewedMedia?._id,
            userSlug: user?.slug,
          });

          mutate(mediaApiUrl);
          mutate(getVideoUrl);
          setIsInspired(true);
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

  const openShare = () => {
    if (user?.slug) {
      history.push({
        state: { share: true, mediaId: viewedMedia?._id },
      });
    } else {
      dispatch({
        type: SHOWLOGIN,
        payload: true,
      });
    }
  };

  const handleInputHeight = () => {
    const maxheight = 80;
    const scrollHeight = textAreaRef.current.scrollHeight;
    if (scrollHeight < maxheight) {
      textAreaRef.current.style.height = scrollHeight + "px";
    }
  };

  const onChange = () => {
    setCommentValue(textAreaRef?.current?.value);
    handleInputHeight();
  };

  const handleCommentSubmit = async () => {
    if (reduxUser?.profile) {
      if (commentValue.trim() !== "") {
        const commentData = {
          mediaId: viewedMedia._id,
          text: commentValue,
          userSlug: user?.slug,
          mediaCommentId: uuid(),
        };
        setSendingMediaComment((prev) => [...prev, commentData]);
        setCommentValue("");
        textAreaRef.current.style.height = "40px";

        try {
          const newMediaComment = await postNewMediaComment(commentData, token);

          mutate(commentUrl, (comment) => {
            const newComment = [...comment, newMediaComment.data];
            return newComment;
          });

          setSendingMediaComment((prev) =>
            prev.filter(
              (m) => m.mediaCommentId !== newMediaComment.data.mediaCommentId
            )
          );
        } catch (error) {
          console.log(error);
        }

        if (reduxUser?.slug !== viewedMedia?.userSlug) {
          let pushNotificationData = {
            title: `${user?.firstName} commented on your media post`,
            description: commentData?.text,
            userSlug: viewedMedia?.userSlug,
            action: "view comment",
            senderSlug: user?.slug,
            endUrl: "/profile",
            mediaId: viewedMedia?._id,
          };

          sendNotification(pushNotificationData);
        }
      }
    } else {
      history.goBack();
      dispatch({
        type: SHOWLOGIN,
        payload: true,
      });
    }
  };

  useEffect(() => {
    if (viewedMedia?.inspired?.includes(user?.slug)) {
      // liked and change the icon
      setIsInspired(true);
    } else {
      setIsInspired(false);
    }
  }, [viewedMedia?.inspired, user?.slug]);

  return (
    <CaptionFooterContainer>
      <div className="icons-container">
        <div className="icon-wrapper">
          <IconButton className="sidebar-icons" onClick={beInspired}>
            {isInspired ? (
              <HiOutlineLightBulb className="inspired" />
            ) : (
              <MdOutlineLightbulb />
            )}
          </IconButton>
          <span className="sidebar-count">{viewedMedia?.inspired?.length}</span>
        </div>

        <div className="icon-wrapper">
          <IconButton className="sidebar-icons" onClick={openShare}>
            <RiShareForwardLine />
          </IconButton>
          <span className="sidebar-count">
            {viewedMedia?.shares?.length || "0"}
          </span>
        </div>
      </div>

      <div className="comment-container">
        <CaptionTextArea
          ref={textAreaRef}
          value={commentValue}
          onChange={(e) => onChange(e)}
          placeholder="add a comment"
        />
        <IconButton className="icon-btn" onClick={handleCommentSubmit}>
          <BiSend className="icon" />
        </IconButton>
      </div>
    </CaptionFooterContainer>
  );
}

export default CaptionFooter;
