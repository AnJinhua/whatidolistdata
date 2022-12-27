import { useEffect, useState, memo } from "react";
import {
  MessageBodyContainer,
  ConversationDate,
  ImagePreviewModal,
  ImagePreviewModalContent,
  ImagePreviewModalContainer,
} from "./styles";
import { useCookies } from "react-cookie";
import Message from "./message";
import { API_URL } from "../../../../constants/api";
import { IoIosArrowDown } from "react-icons/io";
import { RiCloseCircleLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import { socket } from "../../../../actions/messenger";
import { FadingDots } from "../../gen.styles";
import {
  ADD_CONVERSATION_MESSAGE,
  FETCH_CONVERSATION_MESSAGE,
} from "../../../../constants/actions";
import { useLocation } from "react-router-dom";

function MessageBody({
  friend,
  inputRef,
  messageQue,
  sendingImg,
  sendingAudio,
  scrollRef,
  conversationId,
}) {
  const [scrollView, setScrollView] = useState(false);
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState(null);
  const [cookies] = useCookies(["user"]);
  const [typing, setTyping] = useState(null);
  const dispatch = useDispatch();
  const messagesArray = useSelector((state) => state.messenger.messages);
  const match = useLocation();
  const conversation = match.pathname.split("/")[3];

  const { data, isValidating, size, setSize } = useSWRInfinite(
    (index) =>
      `${API_URL}/message/page/${conversationId}/${cookies?.user?.slug}?page=${index}`
  );

  const messageCountUrl = `${API_URL}/message/count/${conversationId}/${cookies?.user?.slug}`;
  const { data: messageCount } = useSWR(messageCountUrl);

  const hasMore = size * 20 <= messageCount;

  useEffect(() => {
    if (data) {
      dispatch({ type: FETCH_CONVERSATION_MESSAGE, payload: data });
    }
  }, [data, dispatch]);

  //filter conversationMessages to return where conversationId === match.id and sort from oldest to latest
  const filteredMessages = messagesArray.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  //group filterd messages into date groups and messages of each day to be in chronological order
  const groupedMessages = filteredMessages?.reduce((acc, message) => {
    const date = moment(message.createdAt)?.calendar(null, {
      lastDay: "[Yesterday]",
      sameDay: "[Today]",
      nextDay: "[Tomorrow]",
      lastWeek: "[last] dddd",
      nextWeek: "dddd",
      sameElse: "ddd, L",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});

  //arrange filtered messages into array of date groups and messages of each day to be in chronological order
  const dateSortedMessages = Object?.keys(groupedMessages)?.map((date) => {
    return {
      date: date,
      messages: groupedMessages[date],
    };
  });

  useEffect(() => {
    socket.on("getMessage", ({ data }) => {
      if (data.conversationId === conversation) {
        dispatch({ type: ADD_CONVERSATION_MESSAGE, payload: data });
      }
    });
    socket.on("onTyping", ({ data }) => {
      if (data.sender === friend?.slug) {
        setTyping(data.text);
      }
    });
    socket.on("getReadMessage", ({ data }) => {
      if (data.reciever === friend?.slug) {
        dispatch({ type: ADD_CONVERSATION_MESSAGE, payload: data });
      }
    });
  }, [dispatch, friend.slug]);

  const handleInfiniteScroll = (e) => {
    const scrollHeight = e.target.scrollHeight;
    const scrollTop = e.target.scrollTop;
    const clientHeight = e.target.clientHeight;
    const scrollPosition = -scrollTop + clientHeight;

    //to display icon at the bottom of the message screen
    if (scrollTop > -200) {
      setScrollView(false);
    } else {
      setScrollView(true);
    }
    if (scrollHeight - scrollPosition < 250) {
      if (!isValidating && hasMore) {
        setSize(size + 1);
      }
    }
  };

  const handleScrollToView = () => {
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleCloseImagePreview = () => {
    setOpenImagePreview(false);
    setPreviewImageSrc(null);
  };

  //render message
  return (
    <MessageBodyContainer
      onScroll={handleInfiniteScroll}
      isScrollView={scrollView}
    >
      <div ref={scrollRef}></div>
      <IoIosArrowDown className="icon" onClick={handleScrollToView} />
      {typing && (
        <div className="istyping-container">
          <img
            loading="lazy"
            style={{
              height: "1.5rem",
              width: "1.5rem",
              flexShrink: "0",
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #e5e7eb",
            }}
            src={friend?.photo ? friend?.photo : "/img/profile.png"}
            alt="profile"
          />
          <p className="istyping-text">
            {friend?.firstName.toLowerCase()} is typing
          </p>
          <FadingDots>
            <div></div>
            <div></div>
            <div></div>
          </FadingDots>
        </div>
      )}

      {/* sending audio que */}
      {sendingAudio
        .sort((a, b) => {
          return new Date(b.time) - new Date(a.time);
        })
        .map(
          ({
            sender,
            text,
            read,
            senderName,
            withAvatar,
            quote,
            time,
            messageId,
            imgFileArray,
            audioFile,
          }) => {
            return (
              <Message
                friend={friend}
                myMessage={cookies?.user?.slug === sender}
                message={text}
                imgFileArray={imgFileArray}
                time={time}
                read={read}
                audioFile={audioFile}
                sending={true}
                _id={messageId}
                key={messageId}
                quote={quote}
                inputRef={inputRef}
                senderName={senderName}
                withAvatar={withAvatar}
              />
            );
          }
        )}
      {/* sending image que */}
      {sendingImg
        .sort((a, b) => {
          return new Date(b.time) - new Date(a.time);
        })
        .map(
          ({
            sender,
            text,
            read,
            senderName,
            withAvatar,
            quote,
            time,
            messageId,
            imgFileArray,
          }) => {
            return (
              <Message
                friend={friend}
                myMessage={cookies?.user?.slug === sender}
                message={text}
                imgFileArray={imgFileArray}
                time={time}
                read={read}
                sending={true}
                _id={messageId}
                key={messageId}
                quote={quote}
                inputRef={inputRef}
                senderName={senderName}
                withAvatar={withAvatar}
                setPreviewImageSrc={setPreviewImageSrc}
                setOpenImagePreview={setOpenImagePreview}
              />
            );
          }
        )}
      {/* sending message que */}
      {messageQue
        .sort((a, b) => {
          return new Date(b.time) - new Date(a.time);
        })
        .map(
          ({
            sender,
            text,
            read,
            senderName,
            withAvatar,
            quote,
            time,
            messageId,
          }) => (
            <Message
              friend={friend}
              myMessage={cookies?.user?.slug === sender}
              message={text}
              time={time}
              read={read}
              sending={true}
              _id={messageId}
              key={messageId}
              quote={quote}
              inputRef={inputRef}
              senderName={senderName}
              withAvatar={withAvatar}
            />
          )
        )}
      {/* database message que */}
      {dateSortedMessages?.map(({ date, messages }) => (
        <>
          {messages
            .sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .map(
              ({
                sender,
                text,
                createdAt,
                read,
                senderName,
                withAvatar,
                quote,
                _id,
                imgFileArray,
                audioFile,
                zoomLink,
                share,
              }) => (
                <Message
                  friend={friend}
                  myMessage={cookies?.user?.slug === sender}
                  message={text}
                  time={createdAt}
                  read={read}
                  _id={_id}
                  key={_id}
                  quote={quote}
                  share={share}
                  zoomLink={zoomLink}
                  setPreviewImageSrc={setPreviewImageSrc}
                  setOpenImagePreview={setOpenImagePreview}
                  imgFileArray={imgFileArray}
                  audioFile={audioFile}
                  inputRef={inputRef}
                  senderName={senderName}
                  withAvatar={withAvatar}
                />
              )
            )}
          <ConversationDate key={date}>{date}</ConversationDate>
        </>
      ))}

      {/* full image preview modal */}
      <ImagePreviewModal
        open={openImagePreview}
        onClose={handleCloseImagePreview}
      >
        <ImagePreviewModalContainer>
          <ImagePreviewModalContent>
            <img
              loading="lazy"
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
              }}
              src={previewImageSrc}
              alt="no pic"
            />
          </ImagePreviewModalContent>
          <RiCloseCircleLine
            className="close_icon"
            onClick={() => {
              setOpenImagePreview(false);
              setPreviewImageSrc(null);
            }}
          />
        </ImagePreviewModalContainer>
      </ImagePreviewModal>
    </MessageBodyContainer>
  );
}

export default memo(MessageBody);
