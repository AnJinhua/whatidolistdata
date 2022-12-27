import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { API_URL } from '../../constants/api'
import Reply from './Reply'

const ReplyList = (props) => {
  const _default = {
    replies: props.replies,
    error: null,
    text: '',
    showReply: false,
    expert: props.expert,
    author: props.author,
    parentId: props.parentId,
  }
  const [state, setState] = useState(_default)
  const [cookies] = useCookies()

  const onShowReply = (e, value) => {
    e.preventDefault()
    setState({ ...state, showReply: value, text: '' })
  }

  const submitNewComment = (e) => {
    e.preventDefault()
    let { expert, author, text, parentId } = state

    text = `@${props.author} ${text}`

    axios
      .post(`${API_URL}/addComment`, {
        expert,
        author,
        text,
        parentId,
        _id: Date.now().toString(),
      })
      .then((res) => {
        if (!res.data.success) {
          setState({
            ...state,
            error: res.data.error.message || res.data.error,
          })
        } else {
          onShowReply(e, false)
          props.handleLoadComments()
        }
      })
  }

  const getReplies = () => {
    let id = props.id
    axios.post(`${API_URL}/get-replies`, { id }).then((res) => {
      if (!res.data.success) {
        setState((state) => ({
          ...state,
          error: res.data.error.message || res.data.error,
        }))
      } else {
        setState((state) => ({ ...state, replies: res.data.data }))
      }
    })
  }

  const likeComment = (id) => {
    const author = cookies.user?.slug
    axios.post(`${API_URL}/likeComment`, { id, author }).then((res) => {
      if (!res.data.success) {
        setState({
          ...state,
          error: res.data?.error?.message || res.data?.error,
        })
      } else {
        getReplies()
      }
    })
  }

  const dislikeComment = (id) => {
    var author = cookies.user?.slug
    axios.post(`${API_URL}/dislikeComment`, { id, author }).then((res) => {
      if (!res.data.success) {
        setState({ ...state, error: res.data.error.message || res.data.error })
      } else {
        getReplies()
      }
    })
  }

  const addReply = (id) => {
    if (cookies.user === undefined) {
      props.openLoginRequestModal(true)
    } else {
      const author = props.author
      const text = window.$('.reply_' + id).val()
      const expert = props.expert

      window.$('.reply_field').val('')

      if (!text || !expert) return
      if (!author) {
        //   props.onModalShow(e, 'need_login');
        return
      }
      const parentId = id
      console.log('xxxxxxxxx')
      axios
        .post(`${API_URL}/addComment`, {
          expert: expert.expert,
          author: author.id,
          text,
          parentId,
          _id: Date.now().toString(),
        })
        .then((res) => {
          if (!res.data.success) {
            setState({
              ...state,
              error: res.data.error.message || res.data.error,
            })
          } else {
            console.log('---new reply added---')
            // getReplies();
          }
        })
    }
  }

  useEffect(() => {
    getReplies()
  }, [props.replies])

  return (
    <div
      className='reply_list'
      style={{ marginLeft: '30px', marginTop: '20px' }}
    >
      {state.replies.map((reply, i) => {
        return (
          <Reply
            key={1}
            reply={reply}
            expert={props.expert}
            parentId={props.parentId}
            author={props.author}
            dislikeComment={dislikeComment}
            likeComment={likeComment}
            handleShowModal={(isShown) => {
              props.handleShowModal(isShown)
            }}
            handleLoadComments={() => {
              props.handleLoadComments()
            }}
            getReplies={getReplies}
          />
        )
      })}
    </div>
  )
}

export default ReplyList
