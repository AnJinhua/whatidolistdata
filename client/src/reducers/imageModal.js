import { IMAGE_CHANGE } from '../constants/actions'

const INITIAL_STATE = {
  show: false,
}

export default function imageModal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case IMAGE_CHANGE:
      return {
        show: action.payload,
      }

    default:
      return state
  }
}
