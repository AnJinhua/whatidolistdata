import axios from 'axios'
import { errorHandler } from './index'
import { toast } from 'react-toastify'

import {
  API_URL,
  // CLIENT_ROOT_URL
} from '../constants/api'
import {
  // AUTH_USER,
  AUTH_ERROR,
  UPDATE_EXPERT_VISIBILITY,
  UPDATE_EXPERT_LOCATION,
  USER_FETCH_REQUEST,
  USER_FETCH_SUCESS,
  USER_FETCH_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_FAIL,
  USER_UPDATE_SUCESS,
  IMAGE_UPDATE_FAIL,
  IMAGE_UPDATE_SUCESS,
  IMAGE_CHANGE,
} from '../constants/actions'

import { Cookies } from 'react-cookie'

const cookies = new Cookies()

export const profileUploadS3 = (data, token) => {
  const url = `${API_URL}/profile/uploads3/`
  return axios.post(url, data, {
    headers: {
      authorization: token,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const resumeUploadS3 = (data, token) => {
  const url = `${API_URL}/resume/uploads3/`
  return axios.post(url, data, {
    headers: {
      authorization: token,
      'Content-Type': 'multipart/form-data',
    },
  })
}

// upload profile picture
export const uploadPhoto = (data) => async (dispatch) => {
  const token = cookies.get('token')
  try {
    const imageFileObject = await axios.post(`${API_URL}/uploadImage/`, data, {
      headers: {
        authorization: token,
      },
    })
    if (
      imageFileObject.status == 201 &&
      imageFileObject.data.success === true
    ) {
      dispatch({
        type: IMAGE_UPDATE_SUCESS,
        payload: imageFileObject.data.user_data,
      })
      dispatch({
        type: IMAGE_CHANGE,
        payload: false,
      })
      toast.success(' Profile Picture Updated Sucessfully', {
        position: 'top-center',
        theme: 'dark',
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  } catch (error) {
    dispatch({
      type: IMAGE_UPDATE_FAIL,
      payload: 'upload failed',
    })
    toast.error(' Failed to Updated Picture Sucessfully', {
      position: 'top-center',
      theme: 'dark',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
}

//delete image in datababase
export const deletePhoto = (data) => async (dispatch) => {
  const token = cookies.get('token')
  try {
    const imageFileObject = await axios.post(`${API_URL}/imageDelete/`, data, {
      headers: {
        authorization: token,
      },
    })
    console.log(imageFileObject)
    if (
      imageFileObject.status == 201 &&
      imageFileObject.data.success === true
    ) {
      dispatch({
        type: IMAGE_UPDATE_SUCESS,
        payload: imageFileObject.data.user_data,
      })
      dispatch({
        type: IMAGE_CHANGE,
        payload: false,
      })
      toast.success(' Profile Picture Updated Sucessfully', {
        position: 'top-center',
        theme: 'dark',
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  } catch (error) {
    dispatch({
      type: IMAGE_UPDATE_FAIL,
      payload: 'upload failed',
    })
    toast.error(' Failed to Updated Picture Sucessfully', {
      position: 'top-center',
      theme: 'dark',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
}

export const fetchUser = (data) => async (dispatch) => {
  try {
    dispatch({ type: USER_FETCH_REQUEST })
    dispatch({
      type: USER_FETCH_SUCESS,
      payload: data?.data,
    })
  } catch (error) {
    dispatch({
      type: USER_FETCH_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const updateUser = (data) => async (dispatch) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST })
    dispatch({
      type: USER_UPDATE_SUCESS,
      payload: data.user_data,
    })
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export function getUserReviews({ userEmail }) {
  return function (dispatch) {
    return axios
      .get(`${API_URL}/user/getUserReviews/${userEmail}`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log('error: ' + error)
        errorHandler(dispatch, error.response, AUTH_ERROR)
      })
  }
}

// GetMyLocationVisibiliy
export function GetMyLocationVisibiliy({ id }) {
  const token = cookies.get('token')
  return function (dispatch) {
    return axios
      .get(`${API_URL}/visibility/${id}`, {
        headers: {
          authorization: token,
        },
      })
      .then((response) => {
        dispatch({
          type: UPDATE_EXPERT_VISIBILITY,
          payload: response.data,
        })
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

// setLocation
export const setLocation = (email) => async (dispatch) => {
  try {
    let data1 = {
      locationLat: '',
      locationLng: '',
      email: email,
    }
    if (navigator.geolocation) {
      const geoId = navigator.geolocation.watchPosition(
        async (position) => {
          data1.locationLat = position.coords.latitude
          data1.locationLng = position.coords.longitude
          const { data } = await axios.put(`${API_URL}/location`, data1)
          console.log(data)
          dispatch({
            type: UPDATE_EXPERT_LOCATION,
            payload: data,
          })
        },
        (e) => {
          console.log(e)
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      )
      window.navigator.geolocation.clearWatch(geoId)
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  } catch (error) {
    console.log(error)
  }
}

// UpdateMyLocationVisibiliy
export function UpdateMyLocationVisibiliy(data) {
  const token = cookies.get('token')
  return function (dispatch) {
    return axios
      .put(`${API_URL}/visibility`, data, {
        headers: {
          authorization: token,
        },
      })
      .then((response) => {
        dispatch({
          type: UPDATE_EXPERT_VISIBILITY,
          payload: response.data.locationVisbility,
        })
        return response.data
      })
      .catch((error) => {
        console.log(error.response.data.error)
      })
  }
}

// UpdateMyProfile
export function UpdateMyProfile(data) {
  const token = cookies.get('token')
  return function (dispatch) {
    return axios
      .post(`${API_URL}/user/update`, {
        headers: { Authorization: token },
        body: data,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log('error: ' + error)
        errorHandler(dispatch, error.response, AUTH_ERROR)
      })
  }
}
// UpdateAccountInfo
export function UpdateAccountInfo(data) {
  const token = cookies.get('token')
  return function (dispatch) {
    return axios
      .post(`${API_URL}/user/add-account-info`, {
        headers: { Authorization: token },
        body: data,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log('error: ' + error)
        errorHandler(dispatch, error.response, AUTH_ERROR)
      })
  }
}
// FetchAccountInfo
export function FetchAccountInfo(data) {
  const token = cookies.get('token')
  return function (dispatch) {
    return axios
      .post(`${API_URL}/user/fetch-account-info`, {
        headers: { Authorization: token },
        body: data,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log('error: ' + error)
        errorHandler(dispatch, error.response, AUTH_ERROR)
      })
  }
}

//show user Image Change modal
export const handleShow = () => (dispatch) => {
  dispatch({
    type: IMAGE_CHANGE,
    payload: true,
  })
}
