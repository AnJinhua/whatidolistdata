import React from 'react'

import Comments from './Comment'

const CommentList = ({
  data,
  author,
  expert,
  handleShowModal,
  handleLoadComments,
  likeComment,
  dislikeComment,
}) => {
  return (
    <div className='comment list'>
      {data.map((comment, index) => (
        <Comments
          comments={comment}
          key={comment._id}
          type={'comment'}
          author={author?.id}
          expert={expert}
          parentId={comment._id}
          i={index}
          likeComment={likeComment}
          dislikeComment={dislikeComment}
          handleShowModal={(isShown) => {
            handleShowModal(isShown)
          }}
          handleLoadComments={() => {
            handleLoadComments()
          }}
        />
      ))}
    </div>
  )
}

export default CommentList
