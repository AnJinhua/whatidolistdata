import {
  ADD_MANY_MEDIA,
  ADD_NEW_MEDIA,
  ADD_SENDING_MEDIA,
  REMOVE_SENDING_MEDIA,
  ADD_MEDIA_FILE,
  REMOVE_MEDIA_FILE,
  ADD_MANY_MEDIA_COMMENTS,
  TOGGLE_MEDIA_MODAL,
} from "../constants/actions";
import {
  filterDuplicatesById,
  reduceDuplicateArray,
  filterDuplicatesByMiD,
} from "./reducers_services";

const INITIAL_STATE = {
  media: [],
  sendingMedia: [],
  files: [],
  mediaComments: [],
  mediaModal: false,
};

export default function mediaReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_NEW_MEDIA:
      const mediaId = action.payload._id;
      const mediaArray = [
        ...filterDuplicatesById(state.media, mediaId),
        action.payload,
      ];
      return {
        ...state,
        media: mediaArray,
      };
    case ADD_MANY_MEDIA:
      let preAllMedia = [...state.media, ...action.payload];

      const allMediaArray = reduceDuplicateArray(preAllMedia);

      return {
        ...state,
        media: allMediaArray,
      };

    case ADD_SENDING_MEDIA:
      const sendingMediaId = action.payload.mediaId;
      const sendingMediaArray = [
        ...filterDuplicatesByMiD(state.sendingMedia, sendingMediaId),
        action.payload,
      ];

      return {
        ...state,
        sendingMedia: sendingMediaArray,
      };

    case REMOVE_SENDING_MEDIA:
      const removeSendingMediaId = action.payload.mediaId;
      const removeSendingMediaArray = [
        ...filterDuplicatesByMiD(state.sendingMedia, removeSendingMediaId),
      ];
      return {
        ...state,
        sendingMedia: removeSendingMediaArray,
      };

    case TOGGLE_MEDIA_MODAL:
      return {
        ...state,
        mediaModal: action.payload,
      };
    case ADD_MEDIA_FILE:
      return {
        ...state,
        files: [action.payload],
      };

    case REMOVE_MEDIA_FILE:
      return {
        ...state,
        files: [],
      };
    case ADD_MANY_MEDIA_COMMENTS:
      let preAllMediaComment = [...state.mediaComments, ...action.payload];

      const allMediaCommentArray = reduceDuplicateArray(preAllMediaComment);

      return {
        ...state,
        mediaComments: allMediaCommentArray,
      };

    default:
      return state;
  }
}
