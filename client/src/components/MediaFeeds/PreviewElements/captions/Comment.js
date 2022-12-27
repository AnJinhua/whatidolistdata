import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  ReusedBigText,
  ReUsedImageContainer,
  ReUsableSmallText,
} from "../../../reusables/styles";
import { deleteMediaComment } from "../../../../actions/media";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { BsThreeDots } from "react-icons/bs";
import { IconButton } from "@material-ui/core";
import { useCookies } from "react-cookie";
import { API_URL } from "../../../../constants/api";
import useSWR, { mutate } from "swr";
import { ElipsDot } from "../../../messenger/gen.styles";

function Comment({ comment, mediaId }) {
  const [options, setOptions] = useState(false);
  const cookieUser = useCookies()[0]?.user;
  const [{ token }] = useCookies(["token"]);
  const commentUserUserUrl = `${API_URL}/getExpertDetail/${comment?.userSlug}`;
  const commentUrl = `${API_URL}/media/page/comment/${mediaId}?page=${0}`;
  const { data: commenttUserRequest, error } = useSWR(commentUserUserUrl);
  const commentUser = commenttUserRequest?.data;

  const myComment = cookieUser?.slug === comment?.userSlug;

  const handleDeleteComment = async () => {
    const deletedMediaComment = await deleteMediaComment(comment?._id, token);
    handleClickAway();
    mutate(commentUrl, (comment) => {
      const newComment = [...comment, deletedMediaComment];
      return newComment;
    });
  };

  const handleClickAway = () => {
    if (options === true) {
      setOptions(false);
    }
  };

  const handleClick = () => {
    setOptions((prev) => !prev);
  };

  return (
    <div className="flex">
      <ReUsedImageContainer height="3rem" width="3rem" className="margined">
        <img
          loading="lazy"
          src={
            commentUser?.imageUrl?.cdnUrl
              ? commentUser.imageUrl?.cdnUrl
              : "/img/profile.png"
          }
          alt=""
          className="image"
        />
      </ReUsedImageContainer>
      <div>
        {!commenttUserRequest && !error && (
          <ElipsDot>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </ElipsDot>
        )}

        {error && <ReusedBigText>suspended account</ReusedBigText>}

        {commentUser && (
          <ReusedBigText>
            {commentUser?.profile?.firstName +
              "  " +
              commentUser?.profile?.lastName}{" "}
          </ReusedBigText>
        )}
        {commentUser && (
          <ReUsableSmallText>
            {"expert in " + commentUser?.expertCategories[0]} {"    "}{" "}
          </ReUsableSmallText>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <p className="comment">{comment?.text}</p>

          <ClickAwayListener onClickAway={handleClickAway}>
            <div className="options">
              <IconButton className="icon-btn">
                <BsThreeDots
                  onClick={handleClick}
                  className="media-option-icon"
                />
              </IconButton>
              {options && (
                <div className="option-container">
                  {myComment && (
                    <p className="option-text" onClick={handleDeleteComment}>
                      delete
                    </p>
                  )}
                  <p className="option-text" onClick={handleClickAway}>
                    cancel
                  </p>
                </div>
              )}
            </div>
          </ClickAwayListener>
        </div>
      </div>
    </div>
  );
}

export default Comment;
