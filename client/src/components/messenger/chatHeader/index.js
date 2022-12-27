import {
  HeadGridContainer,
  HeadSelectContainer,
  LgText,
  SelectText,
} from "./styles";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect } from "react";

function ChatHeader({ activeChatPage, setActivePage }) {
  const history = useHistory();
  const match = useLocation();

  const { pathname } = match;
  const path = pathname.split("/")[2];

  useEffect(() => {
    if (path === "archive") {
      setActivePage("archive");
    } else if (path === "ongoing") {
      setActivePage("ongoing");
    } else if (path === "inbox") {
      setActivePage("inbox");
    }
  }, [path, activeChatPage, setActivePage]);

  const goToMessage = (chat) => {
    history.push(`/messages/${chat}`);
  };

  return (
    <HeadGridContainer>
      <LgText>Messages</LgText>
      <HeadSelectContainer>
        {/* <SelectText
          className="right"
          selected={activeChatPage.current  === "inbox"}
          onClick={() => goToMessage("inbox")}
        >
          inbox
        </SelectText> */}
        <SelectText
          className="right"
          selected={activeChatPage === "ongoing"}
          onClick={() => goToMessage("ongoing")}
        >
          ongoing
        </SelectText>
        <SelectText
          className="left"
          selected={activeChatPage === "archive"}
          onClick={() => goToMessage("archive")}
        >
          archived
        </SelectText>
      </HeadSelectContainer>
    </HeadGridContainer>
  );
}

export default ChatHeader;
