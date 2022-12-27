import { REVIEW } from '../constants/actions'

const INITIAL_STATE = {
  show: false,
}

export default function reviewModal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REVIEW:
      return {
        show: action.payload,
      }

    default:
      return state
  }
}
