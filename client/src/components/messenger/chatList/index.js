import { useEffect, memo } from "react";
import { ChatListContainer } from "./styles";
import { useCookies } from "react-cookie";
import List from "./List/index";
import LoadingBar from "./LoadingBar";
import { useDispatch, useSelector } from "react-redux";
import { quoteMessage, socket } from "../../../actions/messenger";
import NoArchive from "./NoArchive";
import { API_URL } from "../../../constants/api";
import useSWR, { useSWRConfig } from "swr";

function ChatList({ activeChat }) {
  //user data
  const dispatch = useDispatch();
  const [cookies] = useCookies(["user"]);
  const slug = cookies?.user?.slug;
  const url = `${API_URL}/conversations/${activeChat}/${slug}`;
  const { data: conversations, error } = useSWR(url, {
    revalidateOnMount: true,
  });

  const { mutate } = useSWRConfig();

  const quote = useSelector((state) => state.messenger.quote);

  useEffect(() => {
    socket.on("getUpdateConversation", () => {
      mutate(url);
    });
  }, [mutate, url]);

  useEffect(() => {
    quote && dispatch(quoteMessage(null));
  }, [dispatch, quote]);

  if (!conversations && !error) {
    return <LoadingBar />;
  }

  return (
    <>
      <ChatListContainer>
        {!conversations ||
          (!conversations?.length > 0 && (
            <NoArchive
              src="https://res.cloudinary.com/dqzqilslm/image/upload/v1644266940/etuke6retqi86n95kf8f.png"
              bottomLine=" You don't have any ongoing conversations"
            />
          ))}
        {conversations
          ?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          ?.map((conversation) => (
            <List
              activeChat={activeChat}
              currentUser={cookies.user.slug}
              conversation={conversation}
              key={conversation._id}
            />
          ))}
      </ChatListContainer>
    </>
  );
}

export default memo(ChatList);
