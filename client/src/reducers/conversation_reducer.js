import {
  reduceDuplicateArray,
  filterDuplicatesById,
} from "./reducers_services";
import {
  ADD_ALL_CONVERSATION,
  DELETE_All_CONVERSATION,
  FETCH_ALL_CONVERSATIONS,
} from "../constants/actions";

const INITIAL_STATE = {
  allConversations: [],
};

export default function conversationReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    //fetch all conversations
    case FETCH_ALL_CONVERSATIONS:
      let fetchedAllConversation = [
        ...state.allConversations,
        ...action.payload,
      ];

      const reducedAllConversationArray = reduceDuplicateArray(
        fetchedAllConversation
      );
      return {
        ...state,
        allConversations: reducedAllConversationArray,
      };

    //add payload to all conversations
    case ADD_ALL_CONVERSATION:
      const allConversationId = action.payload._id;
      const allConversationArray = [
        ...filterDuplicatesById(state.allConversations, allConversationId),
        action.payload,
      ];
      return {
        ...state,
        allConversations: allConversationArray,
      };

    //delete a conversation from all conversations
    case DELETE_All_CONVERSATION:
      const deleteId = action.payload._id;
      const deletedArchiveArray = [
        ...filterDuplicatesById(state.allConversations, deleteId),
      ];

      return {
        ...state,
        allConversations: deletedArchiveArray,
      };

    default:
      return state;
  }
}
