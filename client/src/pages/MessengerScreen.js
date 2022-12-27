import {
  MdContainer,
  MessageScreenContainer,
} from "../components/messenger/gen.styles";
import MessageScreen from "../components/messenger/messageScreen";

function MessengerScreen() {
  return (
    <MessageScreenContainer>
      <MdContainer>
        <MessageScreen />
      </MdContainer>
    </MessageScreenContainer>
  );
}

export default MessengerScreen;
