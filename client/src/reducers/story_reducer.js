import {
  ADD_MANY_STORIES,
  ADD_NEW_STORY,
  DELETE_STORY,
  SET_CURRENT_COMMUNITY_STORY,
  ADD_SENDING_STORIES,
  REMOVE_SENDING_STORIES,
  ADD_STORY_FILE,
  REMOVE_STORY_FILE,
  TOGGLE_STORY_OPTION,
  TOGGLE_STORY_MODAL,
  TOGGLE_PREVIEW_COMPONENT,
  SET_VIDEO_PRESET,
} from "../constants/actions";
import {
  filterDuplicatesById,
  reduceDuplicateArray,
  filterDuplicatesBySiD,
} from "./reducers_services";

const INITIAL_STATE = {
  stories: [],
  sendingStories: [],
  files: null,
  openModal: false,
  previewComponent: "DROPZONE",
  videoPresets: {
    duration: 2,
    start: 0,
    end: 1,
  },
  currentCommunityStory: null,
  toggleStory: false,
};

export default function storyReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_NEW_STORY:
      const storyId = action.payload._id;
      const storyArray = [
        ...filterDuplicatesById(state.stories, storyId),
        action.payload,
      ];
      return {
        ...state,
        stories: storyArray,
      };

    case ADD_MANY_STORIES:
      let preAllStrories = [...state.stories, ...action.payload];

      const allStoriesArray = reduceDuplicateArray(preAllStrories);

      return {
        ...state,
        stories: allStoriesArray,
      };

    case SET_CURRENT_COMMUNITY_STORY:
      return {
        ...state,
        currentCommunityStory: action.payload,
      };

    case ADD_SENDING_STORIES:
      const sendingStoryId = action.payload.storyId;
      const sendingStoryArray = [
        ...filterDuplicatesBySiD(state.sendingStories, sendingStoryId),
        action.payload,
      ];

      return {
        ...state,
        sendingStories: sendingStoryArray,
      };

    case REMOVE_SENDING_STORIES:
      const removeSendingStoryId = action.payload.storyId;
      const removeSendingStoryArray = [
        ...filterDuplicatesBySiD(state.sendingStories, removeSendingStoryId),
      ];
      return {
        ...state,
        sendingStories: removeSendingStoryArray,
      };

    case ADD_STORY_FILE:
      return {
        ...state,
        files: { ...state.files, ...action.payload },
      };
    case SET_VIDEO_PRESET:
      return {
        ...state,
        videoPresets: action.payload,
      };

    case REMOVE_STORY_FILE:
      return {
        ...state,
        files: null,
      };
    case TOGGLE_STORY_MODAL:
      return {
        ...state,
        openModal: action.payload,
      };
    case TOGGLE_PREVIEW_COMPONENT:
      return {
        ...state,
        previewComponent: action.payload,
      };

    case DELETE_STORY:
      const deleteStoryId = action.payload._id;
      const deletedStoryArray = [
        ...filterDuplicatesById(state.stories, deleteStoryId),
      ];
      return {
        ...state,
        stories: deletedStoryArray,
      };

    case TOGGLE_STORY_OPTION:
      return {
        toggleStory: action.payload,
      };
    default:
      return state;
  }
}
