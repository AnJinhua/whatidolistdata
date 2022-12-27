import {
  STORE_ONLINE_USER,
  QUOTE_MESSAGE,
  GET_CONVERSATION_MESSAGE,
  ADD_CONVERSATION_MESSAGE,
  DELETE_CONVERSATION_MESSAGE,
  ADD_SENDING_MESSAGE,
  REMOVE_SENDING_MESSAGE,
  ADD_MESSAGE_FILE,
  REMOVE_MESSAGE_FILE,
  FETCH_CONVERSATION_MESSAGE,
} from "../constants/actions";
import {
  filterDuplicatesById,
  reduceDuplicateArray,
  flattenArray,
  filterDuplicatesByMessageID,
} from "./reducers_services";

const INITIAL_STATE = {
  messages: [],
  sendingMessages: [],
  files: [],
  quote: null,
  onlineUsers: [],
};

export default function messengerReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    //store action payload for messages
    case GET_CONVERSATION_MESSAGE:
      let preConversationMessages = [...state.messages, ...action.payload];

      const conversationMessageArray = reduceDuplicateArray(
        preConversationMessages
      );

      return {
        ...state,
        messages: conversationMessageArray,
      };

    //store fetch from swr
    case FETCH_CONVERSATION_MESSAGE:
      const flatMessageArray = flattenArray(action.payload);

      return {
        ...state,
        messages: flatMessageArray,
      };

    //add message to message array by first removing duplicates
    case ADD_CONVERSATION_MESSAGE:
      const messageId = action.payload._id;
      const messageArray = [
        ...filterDuplicatesById(state.messages, messageId),
        action.payload,
      ];
      return {
        ...state,
        messages: messageArray,
      };

    //delete archived conversation
    case DELETE_CONVERSATION_MESSAGE:
      const deleteMessageId = action.payload._id;
      const deletedMessageArray = [
        ...filterDuplicatesById(state.messages, deleteMessageId),
      ];
      return {
        ...state,
        messages: deletedMessageArray,
      };

    case ADD_SENDING_MESSAGE:
      const sendingMessageArray = [state.sendingMessages, action.payload];
      return {
        ...state,
        sendingMessage: sendingMessageArray,
      };

    case REMOVE_SENDING_MESSAGE:
      const removeSendingMessageId = action.payload.messageId;
      const removeSendingMessageArray = [
        ...filterDuplicatesByMessageID(
          state.sendingMessages,
          removeSendingMessageId
        ),
      ];
      return {
        ...state,
        sendingMessages: removeSendingMessageArray,
      };

    case ADD_MESSAGE_FILE:
      const messageFileArray = [state.files, action.payload];
      return {
        ...state,
        files: messageFileArray,
      };

    case REMOVE_MESSAGE_FILE:
      const removeMessageFileId = action.payload._id;
      const removeMessageFileArray = [
        ...filterDuplicatesById(state.files, removeMessageFileId),
      ];
      return {
        ...state,
        files: removeMessageFileArray,
      };

    //store online users in state
    case STORE_ONLINE_USER:
      return {
        ...state,
        onlineUsers: action.payload,
      };

    case QUOTE_MESSAGE:
      return {
        ...state,
        quote: action.payload,
      };
    default:
      return state;
  }
}
