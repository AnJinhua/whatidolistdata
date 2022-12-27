import { useState, useRef, useEffect, memo } from "react";
import { IconButton } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";
import recorder from "./recorder.js";
import {
  MessageFormContainer,
  SendContainer,
  TextArea,
  RecordContainer,
  SendBtn,
} from "./styles";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiMic, FiImage } from "react-icons/fi";
import axios from "axios";
import { useCookies } from "react-cookie";
import { API_URL, CLIENT_ROOT_URL } from "../../../../constants/api";

import {
  quoteMessage,
  sendMaillNotification,
  uploadS3,
  socket,
  getRedirectUrl,
  uploadMultiS3,
} from "../../../../actions/messenger";
import Imageprevew from "./Imageprevew.js";
import QuoteReply from "./QuoteReply";
import { sendNotification } from "../../../../subscription.js";
import { ADD_CONVERSATION_MESSAGE } from "../../../../constants/actions.js";

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

function MessageForm({
  withAvatar,
  setwithAvatar,
  inputRef,
  friend,
  setMessageQue,
  setSendingImg,
  setSendingAudio,
  scrollRef,
  currentConversation,
  unBlockConversation,
  mutateSwr,
  currentConversationUrl,
}) {
  const [cookies] = useCookies(["user"]);
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");
  const imageRef = useRef(null);
  const [rawImgFile, setRawImgFile] = useState([]);
  const [imageFile, setImageFile] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState("00:00");
  const [focus, setFocus] = useState(false);
  const timerInterval = useRef();
  const record = useRef();
  const handleImgBtnClick = () => {
    imageRef.current.click();
  };

  const quote = useSelector((state) => state.messenger.quote);
  const onlineUsers = useSelector((state) => state.messenger.onlineUsers);

  const blocked = currentConversation?.blocked?.includes(cookies?.user?.slug);

  const blockedEnd = currentConversation?.blocked?.includes(friend?.slug);

  const friendIsOline = onlineUsers?.includes(
    (o) => o.userSlug === friend?.slug
  );

  const sendEmailNotification = async (message) => {
    const emailNotificationData = {
      recieverName: `${friend?.firstName}  ${friend?.lastName}`,
      message: message,
      senderName: `${cookies?.user?.firstName} ${cookies?.user?.lastName}`,
      recieverEmail: friend?.email,
      url:
        CLIENT_ROOT_URL +
        (await getRedirectUrl(friend?.slug, cookies?.user?.slug)),
      defaultUrl: CLIENT_ROOT_URL,
    };

    sendMaillNotification(emailNotificationData, "notifyUser");
  };

  const postUpdateConversation = async (message) => {
    //update conversations
    try {
      const res = await axios.put(
        API_URL + "/conversations/" + currentConversation?._id,
        message
      );
      socket.emit("updateConversation", {
        data: res.data,
        recieverSlug: friend?.slug,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const restoreDeletedConversation = async () => {
    //find where cookie.user.slug in conversation.deleted array
    const deleted = currentConversation?.deleted?.includes(
      (d) => d === cookies?.user?.slug
    );
    const deletedEnd = currentConversation?.deleted?.includes(
      (d) => d === friend?.slug
    );

    if (deleted) {
      axios
        .put(
          `${API_URL}/conversations/restoreTempDeleted/${currentConversation._id}`,
          {
            restored: cookies?.user?.slug,
          }
        )
        .then((res) => mutateSwr(currentConversationUrl, res.data))
        .catch((err) => {
          console.log(err);
        });
    }
    if (deletedEnd) {
      axios
        .put(
          `${API_URL}/conversations/restoreTempDeleted/${currentConversation._id}`,
          {
            restored: friend.slug,
          }
        )
        .then((res) => {
          mutateSwr(currentConversationUrl, res.data);
          socket.emit("updateConversation", {
            data: res.data,
            recieverSlug: friend?.slug,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSendMessage = async (message, setSentMessage) => {
    // post message to db
    try {
      const res = await axios.post(API_URL + "/message", message);
      setSentMessage((prev) =>
        prev.filter((m) => m.messageId !== res.data.messageId)
      );

      dispatch({ type: ADD_CONVERSATION_MESSAGE, payload: res.data });

      //notifications
      if (!friendIsOline) {
        sendEmailNotification(res.data.text);
      }
      let pushNotificationData = {
        title: `${res.data.senderName.firstName} sent a message`,
        description: res.data.text,
        userSlug: res.data.reciever,
        action: "view message",
        senderSlug: `${res.data.sender}`,
        endUrl: await getRedirectUrl(res.data.reciever, res.data.sender),
        redirectUrl: null,
      };

      sendNotification(pushNotificationData);
      socket.emit("sendMessage", {
        data: res.data,
        recieverSlug: friend?.slug,
      });
      setwithAvatar(false);
      setTimeout(() => {
        setwithAvatar(true);
      }, 60000);
    } catch (error) {
      console.log(error);
    }
  };

  const sendAudioMessage = async (audioFile, audioLength) => {
    restoreDeletedConversation();
    let audioMessageData = {
      conversationId: currentConversation?._id,
      messageId: uuid(),
      sender: cookies?.user?.slug,
      reciever: friend?.slug,
      text: "sent recording",
      imgFileArray: null,
      withAvatar: withAvatar,
      quote: null,
      senderName: {
        firstName: cookies.user.firstName,
        lastName: cookies.user.lastName,
      },
      audioFile: {
        audioLength: audioLength,
        audioUrl: {},
      },
      blocked: [],
    };

    setSendingAudio((oldSendingAudio) => [
      ...oldSendingAudio,
      { ...audioMessageData, time: new Date() },
    ]);

    const lastConversationMessage = {
      lastReciever: friend?.slug,
    };

    const audioData = new FormData();
    audioData.append("file", audioFile);

    try {
      const res = await uploadS3(audioData, cookies.token);

      //update audioMessageData with audio as res.data.file
      audioMessageData.audioFile.audioUrl = res.data;

      postUpdateConversation(lastConversationMessage);
      handleSendMessage(audioMessageData, setSendingAudio);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile.length > 0 && newMessage === "") {
      return;
    }

    if (imageFile.length > 0) {
      //image uploads
      try {
        restoreDeletedConversation();
        let baseImgMessage = {
          conversationId: currentConversation?._id,
          messageId: uuid(),
          sender: cookies?.user?.slug,
          reciever: friend?.slug,
          text: "sent image",
          imgFileArray: imageFile,
          withAvatar: withAvatar,
          quote: null,
          senderName: {
            firstName: cookies.user.firstName,
            lastName: cookies.user.lastName,
          },
          blocked: [],
        };

        const imageUploadFiles = rawImgFile;
        setImageFile([]);
        setRawImgFile([]);

        setSendingImg((oldSendingImg) => [
          ...oldSendingImg,
          { ...baseImgMessage, time: new Date() },
        ]);
        //rawImgFile

        const imageData = new FormData();
        imageUploadFiles.forEach((file) => {
          imageData.append("file", file);
        });

        const newImgFileArray = await uploadMultiS3(imageData, cookies.token);

        if (newImgFileArray.data) {
          baseImgMessage.imgFileArray = newImgFileArray.data;

          const lastConversationMessage = {
            lastReciever: friend?.slug,
          };

          postUpdateConversation(lastConversationMessage);
          handleSendMessage(baseImgMessage, setSendingImg);
        } else {
          console.log("error uploading images");
          return;
        }
      } catch (error) {
        console.log(error);
      }
    } else if (newMessage !== "") {
      restoreDeletedConversation();
      const message = {
        conversationId: currentConversation?._id,
        messageId: uuid(),
        sender: cookies.user?.slug,
        reciever: friend?.slug,
        text: newMessage,
        withAvatar: withAvatar,
        read: false,
        quote: quote,
        senderName: {
          firstName: cookies.user.firstName,
          lastName: cookies.user.lastName,
        },
        blocked: [],
      };

      //if blockend push value to blocked array
      if (blockedEnd) {
        message.blocked.push(friend?.slug);
      }

      const lastConversationMessage = {
        lastReciever: friend?.slug,
      };

      setMessageQue((prev) => [...prev, { ...message, time: new Date() }]);
      setNewMessage("");
      inputRef.current.style.height = "40px";
      dispatch(quoteMessage(null));
      socket.emit("istyping", {
        data: {
          text: null,
          sender: cookies?.user?.slug,
        },
        recieverSlug: friend?.slug,
      });
      postUpdateConversation(lastConversationMessage);
      handleSendMessage(message, setMessageQue);
    }
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  const convertFileToBase64 = (file) => {
    let reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        let Base64 = reader.result;
        setImageFile((files) => [...files, { cdnUrl: Base64 }]);
      };
      reader.onerror = (err) => {
        console.log("error", err);
      };
    }
  };

  const handleNewImageUpload = (e) => {
    const file = e.target.files[0];
    setRawImgFile((files) => [...files, file]);

    convertFileToBase64(file);
  };

  const pad = (val) => {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  };

  const timer = () => {
    const start = Date.now();
    timerInterval.current = setInterval(setTime, 100);

    function setTime() {
      const delta = Date.now() - start; // milliseconds elapsed since start
      const totalSeconds = Math.floor(delta / 1000);
      setRecordingTimer(
        pad(parseInt(totalSeconds / 60)) + ":" + pad(totalSeconds % 60)
      );
    }
  };

  const startManualRecording = async (e) => {
    e.preventDefault();
    if (window.navigator.onLine) {
      if (focus) {
        inputRef.current.focus();
      }
      await wait(100);
      record.current = await recorder();
      await wait(305);
      setRecording(true);
    } else {
      alert("No access to internet !!!");
    }
  };

  const stopManualRecording = async (e) => {
    if (focus) {
      inputRef.current.focus();
    }
    clearInterval(timerInterval.current);
    const stopped = record.current.stop();
    await wait(300);
    setRecording(false);
    const time = recordingTimer;
    setRecordingTimer("00:00");
    return [stopped, time];
  };

  const finishManualRecording = async (e) => {
    let [audio, time] = await stopManualRecording();
    audio = await audio;
    console.log("audioFile", audio.audioFile);
    sendAudioMessage(audio.audioFile, time);
  };

  const handleInputHeight = (e) => {
    e.target.style.height = "inherit";
    const maxheight = 140;
    const scrollHeight = e.target.scrollHeight;
    if (scrollHeight < maxheight) {
      e.target.style.height = scrollHeight + "px";
    }
  };

  const onChange = (e) => {
    setNewMessage(e.target.value);
    handleInputHeight(e);
    socket.emit("istyping", {
      data: {
        text: e.target.value,
        sender: cookies?.user?.slug,
      },
      recieverSlug: friend?.slug,
    });
  };

  useEffect(() => {
    const reRecord = async () => {
      await wait(100);
      timer();
      record.current.start();
    };
    if (recording) {
      reRecord();
    }
  }, [recording]);

  useEffect(() => {
    if (recordingTimer === "01:58") {
      finishManualRecording();
    }
  }, [recordingTimer]);

  if (blocked) {
    return (
      <MessageFormContainer>
        <p className="block-message">
          you blocked this conversation{" "}
          <span className="unblock" onClick={unBlockConversation}>
            unblock
          </span>
        </p>
      </MessageFormContainer>
    );
  }

  return (
    <MessageFormContainer>
      {/* emoji picker */}
      {/* {emojiOpen && (
        <EmojiPickerBox
          emojiOpen={emojiOpen}
          setNewMessage={setNewMessage}
          inputRef={inputRef}
          handleImgBtnClick={handleImgBtnClick}
        />
      )} */}

      {/* image preview */}
      {imageFile.length > 0 && (
        <Imageprevew
          imageFile={imageFile}
          setImageFile={setImageFile}
          handleImgBtnClick={handleImgBtnClick}
        />
      )}

      {/* quote */}
      {quote && <QuoteReply quote={quote} />}

      <TextArea
        ref={inputRef}
        value={newMessage}
        onChange={(e) => !recording && onChange(e)}
        placeholder="Type a message"
        onKeyPress={recording ? () => false : null}
        onFocus={() => setFocus(true)}
      />

      {/* message form */}
      <SendContainer>
        <div className="right-container">
          {/* <IconButton
          onClick={() => setEmojiOpen(false)}
          className={`iconBtn ${!emojiOpen && "none"}  right `}
        >
          <FaTimes className="icon" />
        </IconButton>
        <IconButton
          className="iconBtn right"
          onClick={() => setEmojiOpen((open) => !open)}
        >
          <MdOutlineEmojiEmotions className="icon" />
        </IconButton> */}

          {!recording && (
            <>
              {/* capture voicenote */}
              <IconButton
                onClick={startManualRecording}
                className="iconBtn left"
              >
                <FiMic className="icon " />
              </IconButton>

              {/* image upload */}

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
              <IconButton onClick={handleImgBtnClick} className="iconBtn left">
                <FiImage className="icon" />
              </IconButton>
            </>
          )}
        </div>

        {recording && (
          <RecordContainer>
            <FaTimesCircle
              onClick={stopManualRecording}
              className="recordIcon redIcon"
            />

            <div className="record_div">
              <div className="record__redcircle" />
              <div className="record__duration">{recordingTimer}</div>
            </div>

            <FaCheckCircle
              onClick={finishManualRecording}
              className="recordIcon greenIcon"
            />
          </RecordContainer>
        )}

        {!recording && (
          <SendBtn
            grayed={newMessage === "" && !imageFile.length > 0}
            onClick={handleSubmit}
          >
            <p>send</p>
          </SendBtn>
        )}
      </SendContainer>
    </MessageFormContainer>
  );
}

export default memo(MessageForm);
