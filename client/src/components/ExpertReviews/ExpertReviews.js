/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Collapse } from 'react-bootstrap'

import { getExpertReviews } from '../../actions/expert'

import './ExpertReviews.css'
import Review from './Review'
let _isMounted = false

const ExpertReviews = (props) => {
  const { show } = useSelector((state) => state.review)
  const _default = {
    expertSlug: props.expertSlug,
    expertReviews: [],
  }

  const [state, setState] = useState(_default)
  const dispatch = useDispatch()

  useEffect(() => {
    _isMounted = true
    let expertSlug = state.expertSlug
    _isMounted &&
      dispatch(getExpertReviews({ expertSlug }))
        .then((response) => {
          _isMounted &&
            setState((state) => ({
              ...state,
              expertReviews: response?.reviews,
            }))
        })
        .catch((err) => {
          console.log(err)
        })
    return () => {
      _isMounted = false
    }
  }, [show])

  const expertReviewList = () => {
    var expertReviews = state.expertReviews
    var firstExpertReviews = expertReviews?.slice(0, 4)
    var secondExpertReviews = expertReviews?.slice(4)
    if (expertReviews?.length === 0) {
      return (
        <div className='review-outside'>
          <h4 className='alert alert-warning'>No reviews submitted yet.</h4>
        </div>
      )
    }
    return (
      <div className='review-outside'>
        {firstExpertReviews?.map((review, index) => (
          <Review review={review} key={index} />
        ))}

        <Collapse in={state.open} className='expert-reviews-collapse'>
          <div>
            {secondExpertReviews?.map((reviews, index) => (
              <Review review={reviews} key={index} />
            ))}
          </div>
        </Collapse>

        <div
          className='view-all-wrap'
          style={{ display: secondExpertReviews?.length ? 'block' : 'none' }}
        >
          <a onClick={() => setState({ ...state, open: !state.open })}>
            {!state.open ? 'View all reviews' : 'View some reviews'}
          </a>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className='col-sm-12'>{expertReviewList()}</div>
    </div>
  )
}

export default ExpertReviews
