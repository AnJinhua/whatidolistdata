import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import { API_URL } from "../../constants/api";
import ReplyList from "./ReplyList";
import CommentForm from "./CommentForm";
import trash from "../../assets/images/trash.svg";

const Comment = ({
  i,
  comments,
  author,
  expert,
  parentId,
  likeComment,
  dislikeComment,
  handleShowModal,
  handleLoadComments,
}) => {
  const _default = {
    id: comments._id,
    text: "",
    showMenu: false,
    showModal: false,
    showReply: false,
    showUpdate: false,
    replies: [],
  };
  const [state, setState] = useState(_default);
  const user = useSelector((state) => state.user);
  const { profile } = user;

  useEffect(() => {
    getReplies(state.id);
  }, [state.showReply]);

  const onDeleteComment = (e) => {
    e.preventDefault();
    const id = comments._id;
    axios.post(`${API_URL}/deleteComment`, { id }).then((res) => {
      if (!res.data.success) {
        setState({ ...state, error: res.error });
      } else {
        handleLoadComments();
      }
    });
  };

  const onShowReply = (e, value) => {
    e.preventDefault();
    setState({ ...state, showReply: value, text: "" });
  };

  const onChangeText = (text) => {
    setState({ ...state, text: text });
  };

  const submitNewComment = (e) => {
    e.preventDefault();
    const { text } = state;

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
          });
        } else {
          onShowReply(e, false);
          handleLoadComments();
          getReplies(state.id);
        }
      });
  };
  const onSubmitComment = (e) => {
    e.preventDefault();
    const { text } = state;
    if (!text) return;

    if (!author) {
      handleShowModal(true);
      return;
    }

    submitNewComment(e);
  };

  const getReplies = (id) => {
    axios.post(`${API_URL}/get-replies`, { id }).then((res) => {
      if (!res.data.success) {
        setState((state) => ({
          ...state,
          error: res.data.error.message || res.data.error,
        }));
      } else {
        setState((state) => ({ ...state, replies: res.data.data }));
      }
    });
  };

  return (
    <div className="comments_list" key={`COMMENT_ITEM_${i}`}>
      {comments.users[0]?.imageUrl ? (
        <img
          loading="lazy"
          width="200"
          height="200"
          style={{
            height: "45px",
            width: "45px",
            borderRadius: "50%",
            objectFit: "cover",
            background: "grey",
          }}
          src={
            comments.users[0]?.imageUrl
              ? comments.users[0]?.imageUrl?.cdnUrl
              : "/img/profile.png"
          }
          alt="profile"
        />
      ) : (
        <img
          loading="lazy"
          role="presentation"
          alt="presentation"
          src="/img/person.jpg"
          className="comment-user"
          style={{
            height: "45px",
            width: "45px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}

      <a
        href={
          "/expert/" +
          comments.users[0]?.expertCategories[0] +
          "/" +
          comments.users[0]?.slug
        }
        style={{ cursor: "pointer" }}
      >
        {comments.users[0]?.profile.firstName +
          " " +
          comments.users[0]?.profile.lastName}
      </a>
      <p>
        {comments.text}
        <span className="time" style={{ fontSize: "10px" }}>
          {" "}
          ({moment(comments.updatedAt).fromNow()})
        </span>
      </p>

      <div className="like_section list">
        <span>{comments.voters.length ? comments.voters.length : ""}</span>

        <i
          className={
            "fa fa-thumbs-up like " +
            (comments.like_slugs.includes(author) ? "green" : "")
          }
          onClick={() => {
            likeComment(comments._id);
          }}
          style={{ padding: "0 8px", fontSize: "18px" }}
          data-status="no"
          data-id={comments._id}
        ></i>

        <span>
          {comments.voters_dislikes && comments.voters_dislikes.length
            ? comments.voters_dislikes.length
            : ""}
        </span>
        <i
          className={
            "fa fa-thumbs-down dislike " +
            (comments.dislike_slugs.includes(author) ? "red2" : "")
          }
          onClick={() => {
            dislikeComment(comments._id);
          }}
          data-status="no"
          data-id={comments._id}
          style={{ padding: "0 8px", fontSize: "18px" }}
        ></i>

        <label
          className="reply"
          onClick={(e) => {
            onShowReply(e, true);
          }}
        >
          Reply
        </label>

        {(profile?.slug && comments.author === profile?.slug) ||
        (profile?.slug && comments.expert === profile?.slug) ? (
          <img
            loading="lazy"
            onClick={onDeleteComment}
            src={trash}
            style={{
              marginLeft: "10px",
              height: "15px",
              width: "15px",
            }}
          />
        ) : null}
        {/* <CommentMenu /> */}
      </div>
      <div className="form">
        {state.showReply && (
          <CommentForm
            text={state.text}
            placeholder="Add a public reply..."
            buttonName="Reply"
            formType="form_reply"
            handleChangeText={(value) => {
              onChangeText(value);
            }}
            handleShowForm={(e, isShown) => {
              onShowReply(e, isShown);
            }}
            handleSubmitComment={(e) => {
              onSubmitComment(e);
            }}
          />
        )}
      </div>

      <ReplyList
        id={comments._id}
        author={author}
        parentId={parentId}
        expert={expert}
        onShowReply={onShowReply}
        handleLoadComments={handleLoadComments}
        replies={state.replies}
        handleShowModal={handleShowModal}
      />
    </div>
  );
};

export default Comment;
