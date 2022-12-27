import axios from 'axios'
import { API_URL, CLIENT_ROOT_URL } from '../constants/api'
import { errorHandler } from './index'
import { AUTH_ERROR } from '../constants/actions'
import { Cookies } from 'react-cookie'

import io from 'socket.io-client'

const cookies = new Cookies().getAll()

const socket = io.connect(API_URL)

export const videoCallRequest = async ({ expert }) => {
  // async (dispatch) => {
  let callRequestConfig = {
    method: 'post',
    url: API_URL + '/createvideocall/' + expert?._id,
    headers: {
      Authorization: cookies.token,
      'Content-Type': 'application/json',
    },
  }

  try {
    const { data } = await axios(callRequestConfig)
    localStorage.setItem('currentVideoSession', JSON.stringify(data))
    socket.emit('calling', {
      expertId: data?.session?.expertId,
      roomId: data?.roomId,
    })
    // props.history?.push("/video-session/" + data?.session?.roomId);
    const win = window.open(
      `${CLIENT_ROOT_URL}video-session/` + data?.session?.roomId,
      '_blank'
    )
    win.focus()

    console.log('emmited the event ')
    const videoLink = `${CLIENT_ROOT_URL}video-session/${data?.session?.roomId}`
    return videoLink
  } catch (error) {
    console.log(error)
  }
}

export function openVideoCallModal({ expertSlug }) {
  return function (dispatch) {
    return axios
      .get(`${API_URL}/getExpertReviews/${expertSlug}`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log('error: ' + error)
        errorHandler(dispatch, error.response, AUTH_ERROR)
      })
  }
}
