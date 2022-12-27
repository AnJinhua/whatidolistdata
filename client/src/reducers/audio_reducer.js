import {
  START_AUDIO_CALL_RINGER,
  END_AUDIO_CALL_RINGER,
  START_AUDIO_CALL_SESSION,
  END_AUDIO_CALL_SESSION,
  SET_PEER_ID,
} from '../constants/actions'

const INITIAL_STATE = {
  onRing: false,
  onAnswer: false,
  peerId: '',
  remotePeerIdValue: '',
  remotePeer: null,
}

export default function audioReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case START_AUDIO_CALL_RINGER:
      return {
        ...state,
        onRing: true,
        onAnswer: true,
      }
    case END_AUDIO_CALL_RINGER:
      return {
        ...state,
        onRing: false,
      }
    case START_AUDIO_CALL_SESSION:
      return {
        ...state,
        onAnswer: true,
        peerId: action.payload.peerId,
        remotePeerIdValue: action.payload.remotePeerIdValue,
        remotePeer: action.payload.remotePeer,
        caller: action.payload.caller,
      }
    case SET_PEER_ID:
      return {
        ...state,
        peerId: action.payload.peerId,
      }
    case END_AUDIO_CALL_SESSION:
      return {
        ...state,
        onAnswer: false,
      }
    default:
      return state
  }
}
