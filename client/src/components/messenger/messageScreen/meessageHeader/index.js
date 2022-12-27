import { memo, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@material-ui/core";
import { BiPhoneCall, BiVideo } from "react-icons/bi";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import { BiDotsVertical } from "react-icons/bi";
import {
  HeadGrid,
  ScreenHeaderContainer,
  ScreenTextLg,
  ScreenTextMd,
  TimesIcon,
  GreenDot,
  AmberDot,
  OptionContainer,
  OptionalText,
} from "./styles";

import { VIDEOCALL_CHANGE } from "../../../../constants/actions";
import { ElipsDot } from "../../gen.styles";
import { HeadFlex } from "../../chatList/List/styles";
import { showChatRoom } from "../../../audioChat";
import axios from "axios";
import { API_URL } from "../../../../constants/api";
import { useCookies } from "react-cookie";

function MessageHeader({
  onClose,
  friend,
  currentConversation,
  unBlockConversation,
  blockConversation,
  expert,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [options, setOptions] = useState(false);
  const [cookies] = useCookies(["user"]);

  const blocked = currentConversation?.blocked?.includes(cookies?.user?.slug);

  const onlineUsers = useSelector((state) => state.messenger.onlineUsers);
  const friendIsOline = onlineUsers.includes(
    (o) => o.userSlug === friend?.slug
  );

  const handleClickAway = () => {
    if (options === true) {
      setOptions(false);
    }
  };

  const goProfile = () => {
    history.push(`/expert/${friend.category}/${friend?.slug}`);
  };

  const handleStartAudioCall = async () => {
    onClose();
    let updatedFriend = (
      await axios.get(`${API_URL}/getExpertDetail/${friend?.slug}`)
    ).data.data;

    updatedFriend = {
      ...updatedFriend,
      firstName: updatedFriend.profile.firstName,
      lastName: updatedFriend.profile.lastName,
    };

    showChatRoom(updatedFriend);
  };

  const openVideoCallModal = () => {
    dispatch({
      type: VIDEOCALL_CHANGE,
      payload: { show: true, expert: expert },
    });
  };

  return (
    <ScreenHeaderContainer>
      <IconButton className="iconsBtn right" onClick={onClose}>
        <TimesIcon />
      </IconButton>

      <img
        loading="lazy"
        width="40"
        height="40"
        style={{
          height: "4rem",
          width: "4rem",
          flexShrink: "0",
          borderRadius: "50%",
          objectFit: "cover",
          marginRight: "0.75rem",
          border: "1px solid #e5e7eb",
        }}
        src={friend?.photo ? friend?.photo : "/img/profile.png"}
        alt="profile"
      />

      <HeadGrid>
        <HeadFlex>
          {!friend.firstName ? (
            <ElipsDot>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </ElipsDot>
          ) : (
            <ScreenTextLg onClick={goProfile}>
              {friend?.firstName?.toLowerCase() +
                "  " +
                friend?.lastName?.toLowerCase()}{" "}
            </ScreenTextLg>
          )}

          {friendIsOline ? <GreenDot /> : <AmberDot />}
        </HeadFlex>

        <ScreenTextMd>expert in {friend?.category}</ScreenTextMd>
      </HeadGrid>
      <div className="right-icons">
        {!blocked && (
          <IconButton className="iconBtn right" onClick={handleStartAudioCall}>
            <BiPhoneCall className="icons" />
          </IconButton>
        )}
        {!blocked && (
          <IconButton className="iconBtn right" onClick={openVideoCallModal}>
            <BiVideo className="icons" />
          </IconButton>
        )}

        <ClickAwayListener onClickAway={handleClickAway}>
          <div className="options-container">
            <IconButton
              className="iconBtn"
              onClick={() => setOptions((prev) => !prev && true)}
            >
              <BiDotsVertical className="icons" />
            </IconButton>

            {options && (
              <OptionContainer>
                {blocked ? (
                  <OptionalText onClick={unBlockConversation}>
                    unblock
                  </OptionalText>
                ) : (
                  <OptionalText red onClick={blockConversation}>
                    block
                  </OptionalText>
                )}

                <OptionalText onClick={onClose}>close</OptionalText>
              </OptionContainer>
            )}
          </div>
        </ClickAwayListener>
      </div>
    </ScreenHeaderContainer>
  );
}

export default memo(MessageHeader);
