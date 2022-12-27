import { REVIEW } from '../constants/actions'

const INITIAL_STATE = {
  show: false,
  expert: {},
}

export default function reviewReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REVIEW:
      return {
        show: action.payload.show,
        expert: action.payload.expert,
      }

    default:
      return state
  }
}
