import { useState, useRef, memo, useEffect } from "react";
import axios from "axios";
import { ChatScreenContainer } from "./styles";
import MessageHeader from "./meessageHeader";
import MessageBody from "./messageBody/index";
import MessageForm from "./messageForm";
import { useHistory, useLocation } from "react-router-dom";
import { API_URL } from "../../../constants/api";
import { useCookies } from "react-cookie";
import useSWR, { useSWRConfig } from "swr";
import { socket } from "../../../actions/messenger";
import {
  putBlockConversation,
  putUnBlockConversation,
} from "../../../actions/conversation";

function MessageScreen() {
  const history = useHistory();
  const match = useLocation();
  const [messageQue, setMessageQue] = useState([]);
  const [sendingImg, setSendingImg] = useState([]);
  const [sendingAudio, setSendingAudio] = useState([]);
  const [withAvatar, setwithAvatar] = useState(true);
  const [cookies] = useCookies(["user"]);
  const { mutate } = useSWRConfig();
  //input ref
  const inputRef = useRef(null);
  const scrollRef = useRef();
  const path = match.pathname.split("/")[2];
  const conversation = match.pathname.split("/")[3];
  const reciever = match.pathname.split("/")[4];

  const endUserserUrl = `${API_URL}/getExpertDetail/${reciever}`;

  const userUnreadUrl = `${API_URL}/message/unread/user/${cookies?.user?.slug}`;
  const unreadUrl = `${API_URL}/message/unread/${conversation}/${cookies?.user?.slug}`;
  const { data: endUser } = useSWR(endUserserUrl);
  const expert = endUser?.data;
  const currentConversationUrl = `${API_URL}/conversations/conversation/${conversation}`;
  const { data: currentConversation } = useSWR(currentConversationUrl);
  const { data: unreadMessages } = useSWR(unreadUrl);

  const friend = {
    firstName: expert?.profile?.firstName,
    lastName: expert?.profile?.lastName,
    photo: expert?.imageUrl?.cdnUrl,
    email: expert?.email,
    slug: expert?.slug,
    expertise: expert?.expertFocusExpertise,
    category: expert?.expertCategories,
    online: expert?.onlineStatus,
  };

  const handleClose = () => {
    history.push("/messages/" + path);
  };

  useEffect(() => {
    socket.on("getUpdateConversation", ({ data }) => {
      if (data._id === currentConversation?._id) {
        mutate(currentConversationUrl, data);
      }
    });

    socket.on("getMessage", ({ data }) => {
      if (data.sender === reciever) {
        mutate(unreadUrl);
      }
    });
  }, [
    mutate,
    currentConversationUrl,
    currentConversation?._id,
    reciever,
    unreadUrl,
  ]);

  //Read unread messages
  useEffect(() => {
    unreadMessages?.forEach(({ _id }) => {
      axios
        .put(API_URL + "/message/" + _id, {
          read: true,
        })
        .then((res) => {
          mutate(unreadUrl);
          mutate(userUnreadUrl);
          socket.emit("readMessage", {
            data: res.data,
            recieverSlug: reciever,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }, [reciever, mutate, unreadMessages, unreadUrl, userUnreadUrl]);

  const blockConversation = async () => {
    try {
      const res = await putBlockConversation(
        currentConversation._id,
        cookies?.user?.slug
      );
      mutate(currentConversationUrl, res.data);
      socket.emit("updateConversation", {
        data: res.data,
        recieverSlug: reciever,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const unBlockConversation = async () => {
    try {
      const res = await putUnBlockConversation(
        currentConversation._id,
        cookies?.user?.slug
      );

      mutate(currentConversationUrl, res.data);
      socket.emit("updateConversation", {
        data: res.data,
        recieverSlug: reciever,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ChatScreenContainer>
      <MessageHeader
        friend={friend}
        onClose={handleClose}
        currentConversation={currentConversation}
        currentConversationUrl={currentConversationUrl}
        blockConversation={blockConversation}
        unBlockConversation={unBlockConversation}
        expert={expert}
      />
      <MessageBody
        messageQue={messageQue}
        sendingImg={sendingImg}
        sendingAudio={sendingAudio}
        friend={friend}
        inputRef={inputRef}
        scrollRef={scrollRef}
        currentConversation={currentConversation}
        conversationId={conversation}
      />

      <MessageForm
        scrollRef={scrollRef}
        setMessageQue={setMessageQue}
        setSendingImg={setSendingImg}
        setSendingAudio={setSendingAudio}
        withAvatar={withAvatar}
        setwithAvatar={setwithAvatar}
        inputRef={inputRef}
        friend={friend}
        currentConversation={currentConversation}
        currentConversationUrl={currentConversationUrl}
        unBlockConversation={unBlockConversation}
        mutateSwr={mutate}
      />
    </ChatScreenContainer>
  );
}

export default memo(MessageScreen);
