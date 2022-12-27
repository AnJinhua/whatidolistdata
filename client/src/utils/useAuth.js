import React, { useEffect, useState } from 'react'
import { API_URL } from '../constants/api'
import useSWR from 'swr'
import axios from 'axios'
import { useSelector } from 'react-redux'
import store from '../store'
import { loginUserFed } from '../actions/auth'
import { Cookies } from 'react-cookie'
import { useHistory } from 'react-router'
import decode from 'jwt-decode'
import { fetchUser } from '../actions/user'
import { AUTH_USER, SET_PEER_ID } from '../constants/actions'
import { customLogoutUser } from '../actions/auth'
const useAuth = () => {
  const history = useHistory()
  const cookies = new Cookies()
  const [token, setToken] = useState(null)
  const [cookiesUser, setCokkiesUser] = useState(null)
  const user = useSelector((state) => state.auth.user)
  useEffect(() => {
    const getUser = async () => {
      const response = await axios
        .get(`${API_URL}/auth/login/success`, { withCredentials: true })
        .catch((err) => {
          console.log(err)
        })

      if (response?.status !== 200) {
      } else {
        store.dispatch(loginUserFed(response?.data, history))
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    setCokkiesUser(cookies.get('user'))
    setToken(cookies.get('token'))
  }, [user])
  const { data } = useSWR(`${API_URL}/getExpertDetail/${cookiesUser?.slug}`)

  useEffect(() => {
    if (token) {
      const decodedToken = decode(token)
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        store.dispatch(customLogoutUser(history))
      }
      if (data?.success === true) {
        store.dispatch(fetchUser(data))
        store.dispatch({ type: AUTH_USER })
        store.dispatch({
          type: SET_PEER_ID,
          payload: { peerId: localStorage.getItem('local_user_id') },
        })
      }
    }
  }, [data, token])
  return
}

export default useAuth
