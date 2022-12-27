import NoArchive from "./NoArchive";
import { ArchiveListContainer, ArchiveBottomText } from "./styles";

function ChatInbox() {
  return (
    <>
      <ArchiveListContainer>
        <NoArchive
          src="https://res.cloudinary.com/dqzqilslm/image/upload/v1644266940/etuke6retqi86n95kf8f.png"
          bottomLine=" You don't have any inbox conversations"
        />
      </ArchiveListContainer>
      <ArchiveBottomText>
        Not seeing a message? We clear out less recent communications from this
        view to declutter your history.
      </ArchiveBottomText>
    </>
  );
}

export default ChatInbox;
