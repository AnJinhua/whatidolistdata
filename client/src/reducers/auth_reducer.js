import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  RESET_PASSWORD_REQUEST,
  PROTECTED_TEST,
  EXPERT_SIGNUP_LINK_REQUEST,
  UPDATE_EXPERT_VISIBILITY,
  UPDATE_EXPERT_LOCATION,
  CURRENT_USER,
  TOGGLE_SIGNUP_STEP,
} from "../constants/actions";

const INITIAL_STATE = {
  error: "",
  message: "",
  content: "",
  resetMessage: "",
  resetErrorMessage: "",
  authenticated: false,
  visibility: false,
  user: {},
  location: {},
  page: 0,
};

export default function authReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TOGGLE_SIGNUP_STEP:
      return {
        ...state,
        page: action.payload,
      };
    case AUTH_USER:
      return {
        ...state,
        error: "",
        message: "",
        authenticated: true,
      };
    case UNAUTH_USER:
      return {
        ...state,
        authenticated: false,
        error: action.payload,
        user: {},
      };
    case AUTH_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        resetMessage: action.payload.message,
        resetErrorMessage: action.payload.error,
      };
    case PROTECTED_TEST:
      return {
        ...state,
        content: action.payload.message,
      };
    case CURRENT_USER:
      return {
        ...state,
        user: action.payload,
      };
    case EXPERT_SIGNUP_LINK_REQUEST:
      return {
        ...state,
        content: action.payload,
      };
    case UPDATE_EXPERT_VISIBILITY:
      return {
        ...state,
        visibility: action.payload,
      };
    case UPDATE_EXPERT_LOCATION:
      return {
        ...state,
        location: action.payload,
      };
    default:
      return state;
  }
}
