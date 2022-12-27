/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie'
import { useHistory } from 'react-router'
import { SHOWLOGIN } from '../../constants/actions'
const Login = () => {
  const [cookies] = useCookies()
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    if (cookies.user) {
      history.push('/profile')
    } else {
      history.push('/')
      dispatch({
        type: SHOWLOGIN,
        payload: true,
      })
    }
  }, [cookies, history])

  return (
    <div className='col-sm-6 mtop100 col-sm-offset-3'>
      <div className='page-title text-center'>login redirect!</div>
    </div>
  )
}

export default Login
