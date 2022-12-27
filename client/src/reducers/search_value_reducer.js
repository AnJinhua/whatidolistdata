import { SEARCH_VISIBILITY } from '../constants/actions'
const initialState = {
  searchval: [],
  searchshow: false,
}

export default function searchValueReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE': {
      return Object.assign({}, state, {
        searchval: action.payload,
      })
    }
    case SEARCH_VISIBILITY:
      return {
        ...state,
        searchshow: action.payload,
      }
    default:
      return state
  }
}
