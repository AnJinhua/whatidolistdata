import { ADD_REVIEWS } from '../constants/actions'

const INITIAL_STATE = {
  show: false,
}

export default function imageModal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_REVIEWS:
      return {
        show: action.payload,
      }

    default:
      return state
  }
}
