import { LIST_FAIL, LIST_REQUEST, LIST_SUCCESS } from '../constants/actions'

// import useSWR from 'swr'

export const fetchList = (data) => async (dispatch) => {
  try {
    dispatch({ type: LIST_REQUEST })
    dispatch({
      type: LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}
