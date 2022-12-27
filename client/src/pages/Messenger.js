import { useState, memo } from "react";
import { LgContainer, MessageGrid } from "../components/messenger/gen.styles";
import ChatHeader from "../components/messenger/chatHeader";
import ChatList from "../components/messenger/chatList";

function Messenger() {
  const [activeChatPage, setActivePage] = useState("conversations_list");

  return (
    <LgContainer>
      <MessageGrid>
        <ChatHeader
          activeChatPage={activeChatPage}
          setActivePage={setActivePage}
        />

        <ChatList activeChat={activeChatPage} />
      </MessageGrid>
    </LgContainer>
  );
}

export default memo(Messenger);
