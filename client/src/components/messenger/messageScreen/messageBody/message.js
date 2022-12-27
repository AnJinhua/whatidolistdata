import { useState, memo, useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {
  quoteMessage,
  // getLastMessages,
  selfDispatch,
  socket,
} from "../../../../actions/messenger";
import moment from "moment";
import axios from "axios";
import { API_URL } from "../../../../constants/api";
import { useSpring } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { useDispatch, useSelector } from "react-redux";
import { DELETE_CONVERSATION_MESSAGE } from "../../../../constants/actions";
import MediaComponent from "./MediaComponent";
import {
  AudioRoomJoinButton,
  useAudioRoomLinkParser,
} from "../../../audioChat/audioRoomJoinMessenegrIntegration";
import { useHistory } from "react-router-dom";
import {
  MessageText,
  MessageContainer,
  DotIcon,
  TimeText,
  InnerContainer,
  DoubleCheckIcon,
  OptionContainer,
  OptionalText,
  InnerDiv,
  QuoteTextContainer,
  QuoteText,
  QuoteBackIcon,
  MessageWrapper,
} from "./styles";

function Message({
  message,
  myMessage,
  time,
  read,
  senderName,
  withAvatar,
  quote,
  _id,
  friend,
  inputRef,
  sending,
  imgFileArray,
  setPreviewImageSrc,
  setOpenImagePreview,
  audioFile,
  zoomLink,
  share,
}) {
  const [options, setOptions] = useState(false);
  const dispatch = useDispatch();
  const reduxUser = useSelector(({ user }) => user.profile);
  const audioRoomInviteMessage = useAudioRoomLinkParser(message);
  const history = useHistory();
  // console.log("shared", share);

  const handleClick = () => {
    setOptions((prev) => !prev);
  };

  const handleClickAway = () => {
    if (options === true) {
      setOptions(false);
    }
  };

  //quote message function
  const handleQuote = () => {
    setOptions(false);
    dispatch(
      quoteMessage({ text: message, senderName: senderName, time: time })
    );
    //focus on input
    inputRef.current?.focus();
  };
  //copy message function
  const handleCopy = () => {
    setOptions(false);
    navigator.clipboard.writeText(message);
  };
  //delete message functon
  const handleDelete = () => {
    setOptions(false);
    axios
      .delete(API_URL + "/message/" + _id)
      .then((res) => {
        socket.emit("deleteMessage", {
          data: res.data,
          recieverSlug: friend.slug,
        });
        dispatch(selfDispatch(res.data, DELETE_CONVERSATION_MESSAGE));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  const bind = useGesture(
    {
      onDrag: ({ down, offset: [x] }) => {
        api.start({ x: down ? x : 0 });
      },
      onDragEnd: () =>
        !audioFile &&
        (imgFileArray?.length === 0 || !imgFileArray) &&
        handleQuote(),
    },
    {
      drag: {
        bounds: { right: 50, left: 0 },
        threshold: 40,
        axis: "x",
      },
    }
  );

  const OptionComponent = () => (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <DotIcon onClick={handleClick} className="message-options" />
        {!sending && options && (
          <OptionContainer myMessage={myMessage}>
            {imgFileArray?.length === 0 && (
              <>
                <OptionalText onClick={handleCopy}>Copy</OptionalText>
                <OptionalText onClick={handleQuote}>Quote</OptionalText>
              </>
            )}
            {!myMessage && <OptionalText>Report a concern</OptionalText>}
            {myMessage && (
              <OptionalText onClick={handleDelete}>Remove</OptionalText>
            )}
          </OptionContainer>
        )}
      </div>
    </ClickAwayListener>
  );

  const AvatarComponent = ({ img }) => (
    <img
      loading="lazy"
      style={{
        height: "2.5rem",
        width: "2.5rem",
        flexShrink: "0",
        borderRadius: "50%",
        objectFit: "cover",
        border: "1px solid #e5e7eb",
      }}
      src={img ? img : "/img/profile.png"}
      alt="profile"
    />
  );

  return (
    <MessageWrapper myMessage={myMessage}>
      <MessageContainer {...bind()} style={{ x }}>
        {!myMessage && withAvatar && <AvatarComponent img={friend?.photo} />}
        {myMessage && <OptionComponent />}
        <InnerContainer>
          <InnerDiv myMessage={myMessage} withAvatar={withAvatar}>
            {withAvatar && (
              <TimeText myMessage={myMessage}>
                {moment(time).format("LT")}
              </TimeText>
            )}
            <MessageText myMessage={myMessage}>
              {audioFile && (
                <AudioPlayer audioFile={audioFile} sending={sending} />
              )}
              <div>
                {imgFileArray?.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setPreviewImageSrc(img?.cdnUrl);
                      setOpenImagePreview(true);
                    }}
                  >
                    <img
                      loading="lazy"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                      src={img?.cdnUrl}
                      alt="pic"
                    />
                  </div>
                ))}
              </div>

              {quote && (
                <QuoteTextContainer>
                  <QuoteBackIcon />
                  <div>
                    <TimeText myMessage={myMessage}>
                      {quote.senderName.firstName} {quote.senderName.lastName}{" "}
                      {moment(quote.time).format("LT, ddd MMM Do, YY")}
                    </TimeText>
                    <div className="quote-media-container">
                      {quote?.imageUrl && (
                        <img
                          loading="lazy"
                          src={quote?.imageUrl}
                          alt=""
                          className="quote-img"
                        />
                      )}
                      <QuoteText>{quote.text}</QuoteText>
                    </div>
                  </div>
                </QuoteTextContainer>
              )}
              {share && <MediaComponent mediaID={share} />}

              {message &&
                !audioRoomInviteMessage &&
                !audioFile &&
                (imgFileArray?.length === 0 || !imgFileArray) && (
                  <p>{message}</p>
                )}

              {audioRoomInviteMessage && (
                <div>
                  <p>{audioRoomInviteMessage.messageText}</p>
                  <AudioRoomJoinButton
                    roomId={audioRoomInviteMessage.roomId}
                    onJoined={() => {
                      history.goBack();
                    }}
                  />
                </div>
              )}

              {zoomLink && (
                <a
                  href={zoomLink}
                  className="zoomLink"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {zoomLink}
                </a>
              )}
              {myMessage && read && <DoubleCheckIcon />}
            </MessageText>
          </InnerDiv>
          {myMessage && withAvatar && (
            <AvatarComponent img={reduxUser?.imageUrl?.cdnUrl} />
          )}
          {!myMessage && <OptionComponent />}
        </InnerContainer>
      </MessageContainer>
    </MessageWrapper>
  );
}

export default memo(Message);
