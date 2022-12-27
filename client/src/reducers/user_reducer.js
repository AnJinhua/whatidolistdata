import {
  USER_FETCH_REQUEST,
  USER_FETCH_SUCESS,
  USER_FETCH_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_FAIL,
  USER_UPDATE_SUCESS,
  USER_PROFILE_REMOVE,
  IMAGE_UPDATE_REQUEST,
  IMAGE_UPDATE_FAIL,
  IMAGE_UPDATE_SUCESS,
} from '../constants/actions'

const INITIAL_STATE = {
  loading: true,
  profile: {},
  imageLoading: false,
}

export default function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case USER_FETCH_REQUEST:
      return { loading: true, profile: {} }
    case USER_FETCH_SUCESS:
      return {
        loading: false,
        profile: action.payload,
      }
    case USER_FETCH_FAIL:
      return { loading: false, error: action.payload }

    case USER_UPDATE_REQUEST:
      return { loading: true, profile: {} }
    case USER_UPDATE_SUCESS:
      return {
        loading: false,
        profile: action.payload,
      }
    case USER_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case USER_PROFILE_REMOVE:
      return {
        loading: false,
        profile: {},
      }

    case IMAGE_UPDATE_REQUEST:
      return { ...state, imageLoading: true }

    case IMAGE_UPDATE_SUCESS:
      return {
        imageLoading: false,
        profile: action.payload,
      }
    case IMAGE_UPDATE_FAIL:
      return { ...state, imageLoading: false, error: action.payload }
    default:
      return state
  }
}
