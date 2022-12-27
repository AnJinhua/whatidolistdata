import { useEffect, useRef, useState, memo } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { RiArchiveLine, RiDeleteBinLine } from "react-icons/ri";
import { MdRestore } from "react-icons/md";
import { format } from "timeago.js";
import {
  ListContainer,
  ListTopInnerGrid,
  ListFlexBottom,
  ListFlexTop,
  TextLgDark,
  Textflex,
  TextMdDark,
  TextSmGray,
  TextMdGray,
  ListTopGrid,
  ElipsDot,
  HeadFlex,
  TextRed,
  FlexBorder,
  NoArchiveIconContiner,
} from "./styles";
import { AmberDot, GreenDot } from "../../messageScreen/meessageHeader/styles";
import useSWR, { useSWRConfig } from "swr";
import { useCookies } from "react-cookie";
import { API_URL } from "../../../../constants/api";
import {
  putArchiveConversation,
  putRestoreConversation,
  putDeleteConversation,
  deleteBadConversation,
} from "../../../../actions/conversation";
import { socket } from "../../../../actions/messenger";
import { filterDuplicatesById } from "../../../../reducers/reducers_services";

function List({ conversation, currentUser, activeChat }) {
  const history = useHistory();
  const { mutate } = useSWRConfig();
  const [{ user }] = useCookies(["user"]);
  const [messageUser, setMessageUser] = useState("");
  const slug = user?.slug;
  //reciever's slug
  const friendSlug = conversation?.members?.find((m) => m !== slug);
  const userUrl = `${API_URL}/getExpertDetail/${friendSlug}`;
  const onGoingConversationUrl = `${API_URL}/conversations/ongoing/${slug}`;
  const archiveConversationUrl = `${API_URL}/conversations/archive/${slug}`;
  const lastMessageUrl = `${API_URL}/message/last/${conversation._id}/${slug}`;
  const unreadUrl = `${API_URL}/message/unread/${conversation._id}/${slug}`;
  const messengerUrl = `${API_URL}/message/page/${conversation._id}/${slug}?page=0`;
  const { data: unreadMessages } = useSWR(unreadUrl);
  const { data: lastMessages } = useSWR(lastMessageUrl);
  const { data: userData, error } = useSWR(userUrl);
  const { data: messages } = useSWR(messengerUrl);
  const unreadMessageCount = useRef(0);
  const lastMessage = lastMessages?.[0];

  const lastUserserUrl = `${API_URL}/getExpertDetail/${lastMessage?.sender}`;
  const { data: lastMessagesUsers } = useSWR(lastUserserUrl);

  const conversationUser = userData?.data;

  const lastMessageUser = lastMessagesUsers?.data;

  const onlineUsers = useSelector((state) => state.messenger.onlineUsers);
  const friendIsOline = onlineUsers.includes(
    (user) => user.userSlug === friendSlug
  );

  useEffect(() => {
    socket.on("getMessage", ({ data }) => {
      if (data.conversationId === conversation._id) {
        mutate(unreadUrl);
        mutate(lastMessageUrl);
      }
    });
    socket.on("getDeletedMessage", () => {
      mutate(lastMessageUrl);
    });
  }, [conversation._id, lastMessageUrl, mutate, unreadUrl]);

  useEffect(() => {
    if (friendSlug === null) {
      const deleteAConversation = async () => {
        const deletedConversation = await deleteBadConversation(
          conversation._id
        );
        console.log("user no dey", deletedConversation);
        mutate(onGoingConversationUrl, (ongoingConversationMutate) => {
          const filteredConversation = filterDuplicatesById(
            ongoingConversationMutate,
            conversation._id
          );
          return filteredConversation;
        });
      };
      deleteAConversation();
    }
  }, [friendSlug]);

  useEffect(() => {
    unreadMessageCount.current = unreadMessages?.length;
  }, [unreadMessages]);

  useEffect(() => {
    let thisUser = lastMessageUser?.profile?.firstName;
    setMessageUser(thisUser);
  }, [lastMessageUser?.profile?.firstName]);

  const goChat = () => {
    history.push({
      pathname: `/messages/${activeChat}/${conversation._id}/${friendSlug}`,
    });
    mutate(messengerUrl, messages);
  };

  //function that archives a conversation
  const archiveConversation = async () => {
    try {
      const archiveConversation = await putArchiveConversation(
        conversation._id,
        currentUser
      );
      mutate(onGoingConversationUrl, (ongoingConversationMutate) => {
        const filteredConversation = filterDuplicatesById(
          ongoingConversationMutate,
          archiveConversation._id
        );
        return filteredConversation;
      });
      mutate(archiveConversationUrl);
    } catch (e) {
      console.log(e);
    }
  };
  //function that restores archived conversation
  const restoreConversation = async () => {
    try {
      const putConversation = putRestoreConversation(
        conversation._id,
        currentUser
      );
      mutate(archiveConversationUrl, (restoredConversations) => {
        const filteredConversation = filterDuplicatesById(
          restoredConversations,
          putConversation._id
        );

        return filteredConversation;
      });

      mutate(onGoingConversationUrl);
    } catch (e) {
      console.log(e);
    }
  };
  //function that temporaryly delete conversation
  const deleteConversation = async () => {
    try {
      const deletedConversation = await putDeleteConversation(
        conversation._id,
        currentUser
      );
      mutate(archiveConversationUrl, (deletedConversations) => {
        const filteredConversation = deletedConversations.filter(
          (c) => c._id !== deletedConversation._id
        );

        return filteredConversation;
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ListContainer>
      <ListFlexTop onClick={goChat}>
        <img
          loading="lazy"
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "50%",
            marginRight: "20px",
            height: "40px",
            width: "40px",
            flexShrink: "0",
            objecFit: "cover",
          }}
          src={
            conversationUser?.imageUrl?.cdnUrl
              ? conversationUser?.imageUrl?.cdnUrl
              : "/img/profile.png"
          }
          alt="profile"
        />

        <ListTopGrid>
          <HeadFlex>
            {error && <TextLgDark>suspended account</TextLgDark>}
            {!userData && !error && (
              <ElipsDot>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </ElipsDot>
            )}
            {conversationUser && (
              <TextLgDark>
                {conversationUser?.profile?.firstName +
                  "  " +
                  conversationUser?.profile?.lastName}{" "}
              </TextLgDark>
            )}

            {friendIsOline ? <GreenDot /> : <AmberDot />}
          </HeadFlex>

          <ListTopInnerGrid>
            <Textflex>
              <TextMdDark>{messageUser}</TextMdDark>
              {unreadMessageCount?.current > 0 && (
                <TextRed>{unreadMessageCount.current}</TextRed>
              )}
              <TextSmGray>{format(lastMessage?.updatedAt)}</TextSmGray>
            </Textflex>
            <TextMdGray>{lastMessage?.text}</TextMdGray>
          </ListTopInnerGrid>
        </ListTopGrid>
      </ListFlexTop>
      <ListFlexBottom>
        {activeChat === "archive" && (
          <NoArchiveIconContiner>
            <FlexBorder onClick={restoreConversation}>
              <MdRestore className="icon" />
              <p>restore</p>
            </FlexBorder>
            <FlexBorder onClick={deleteConversation}>
              <RiDeleteBinLine className="icon" />
              <p>delete</p>
            </FlexBorder>
          </NoArchiveIconContiner>
        )}
        {activeChat === "inbox" && (
          <NoArchiveIconContiner>
            <FlexBorder>
              <MdRestore className="icon" />
              <p>block</p>
            </FlexBorder>
            <FlexBorder>
              <RiDeleteBinLine className="icon" />
              <p>accept</p>
            </FlexBorder>
          </NoArchiveIconContiner>
        )}
        {activeChat === "ongoing" && (
          <FlexBorder onClick={archiveConversation}>
            <RiArchiveLine className="icon" />
            <p>Archive</p>
          </FlexBorder>
        )}
      </ListFlexBottom>
    </ListContainer>
  );
}

export default memo(List);
