import { CaptionHeaderContainer } from "./caption.styles";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IconButton } from "@material-ui/core";
import {
  ReUsableSmallText,
  ReusedBigText,
  ReUsedImageContainer,
} from "../../../reusables/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { useState } from "react";
import { deleteNewMedia } from "../../../../actions/media";
import { useCookies } from "react-cookie";
import { API_URL } from "../../../../constants/api";
import useSWR, { mutate } from "swr";
import { ElipsDot } from "../../../messenger/gen.styles";

function CaptionHeader({ viewedMedia, handleClose }) {
  const [options, setOptions] = useState(false);
  const [{ user }] = useCookies();
  const [{ token }] = useCookies(["token"]);
  const mediaUserUrl = `${API_URL}/getExpertDetail/${viewedMedia?.userSlug}`;
  const mediaUrl = `${API_URL}/media/all/${user?.slug}`;
  const { data: mediaUserRequest, error } = useSWR(mediaUserUrl);
  const mediaUser = mediaUserRequest?.data;

  const myMedia = user?.slug === viewedMedia?.userSlug;

  const handleClickAway = () => {
    if (options === true) {
      setOptions(false);
    }
  };

  const handleClick = () => {
    setOptions((prev) => !prev);
  };

  const handleDeleteMedia = async () => {
    const deletedMediaData = await deleteNewMedia(viewedMedia._id, token);
    handleClose();
    mutate(mediaUrl, (media) => {
      const newMedia = [...media, deletedMediaData];
      return newMedia;
    });
  };

  return (
    <CaptionHeaderContainer>
      <div className="flex">
        <ReUsedImageContainer className="margined">
          <img
            loading="lazy"
            src={
              mediaUser?.imageUrl?.cdnUrl
                ? mediaUser.imageUrl?.cdnUrl
                : "/img/profile.png"
            }
            alt=""
            className="image"
          />
        </ReUsedImageContainer>
        <div>
          {viewedMedia?.userSlug && !mediaUserRequest && !error && (
            <ElipsDot>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </ElipsDot>
          )}

          {viewedMedia?.userSlug && error && (
            <ReusedBigText>suspended account</ReusedBigText>
          )}

          {mediaUser && (
            <ReusedBigText>
              {mediaUser?.profile?.firstName +
                "  " +
                mediaUser?.profile?.lastName}{" "}
            </ReusedBigText>
          )}
          {mediaUser && (
            <ReUsableSmallText>
              {"expert in " + mediaUser?.expertCategories[0]}
            </ReUsableSmallText>
          )}
        </div>
      </div>

      <ClickAwayListener onClickAway={handleClickAway}>
        <div className="options">
          <IconButton className="icon-btn">
            <BsThreeDotsVertical
              onClick={handleClick}
              className="media-option-icon"
            />
          </IconButton>
          {options && (
            <div className="option-container">
              {myMedia && (
                <p className="option-text" onClick={handleDeleteMedia}>
                  delete
                </p>
              )}
              {/* <p className="option-text">turn off commenting</p>
              <p className="option-text">report a concern</p> */}
              <p className="option-text" onClick={() => handleClose()}>
                close
              </p>
            </div>
          )}
        </div>
      </ClickAwayListener>
    </CaptionHeaderContainer>
  );
}

export default CaptionHeader;
