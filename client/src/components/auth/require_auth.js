import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { useCookies } from 'react-cookie'

const RequireAuth = (ComposedPage) => {
  const Authentication = (props) => {
    const cookies = useCookies()

    const { authenticated } = useSelector((state) => state.auth)
    const history = useHistory()

    useEffect(() => {
      if (!authenticated && !cookies[0].token) history.push('/login')
    }, [authenticated, history])

    return (
      <>
        <ComposedPage />
      </>
    )
  }
  return Authentication
}

export default RequireAuth
