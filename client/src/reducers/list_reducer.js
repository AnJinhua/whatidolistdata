import { LIST_FAIL, LIST_REQUEST, LIST_SUCCESS } from '../constants/actions'

export const listReducer = (state = { loading: true, List: [] }, action) => {
  switch (action.type) {
    case LIST_REQUEST:
      return { loading: true, list: [] }
    case LIST_SUCCESS:
      return {
        loading: false,
        List: action.payload,
      }
    case LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
