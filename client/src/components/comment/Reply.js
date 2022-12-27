import React, { useState } from "react";
import moment from "moment";
import CommentForm from "./CommentForm";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../../constants/api";
import trash from "../../assets/images/trash.svg";
const Reply = ({
  reply,
  author,
  parentId,
  dislikeComment,
  handleShowModal,
  likeComment,
  expert,
  getReplies,
  handleLoadComments,
}) => {
  const _default = {
    id: reply._id,
    text: "",
    showMenu: false,
    showModal: false,
    showReply: false,
    showUpdate: false,
  };
  const [state, setState] = useState(_default);
  const user = useSelector((state) => state.user);
  const { profile } = user;
  const onShowReply = (e, value) => {
    e.preventDefault();
    setState({ ...state, showReply: value, text: "" });
  };

  const onChangeText = (text) => {
    setState({ ...state, text: text });
  };

  const submitNewComment = (e) => {
    e.preventDefault();
    let { text } = state;

    text = `@${reply.author} ${text}`;

    if (!author) {
      handleShowModal(true);
      return;
    }

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
          getReplies();
        }
      });
  };
  const onSubmitComment = (e) => {
    e.preventDefault();
    const { text } = state;
    if (!text) return;

    submitNewComment(e);
  };

  const onDeleteReply = (e) => {
    e.preventDefault();
    const id = reply._id;
    axios.post(`${API_URL}/delete-reply`, { id }).then((res) => {
      if (!res.data.success) {
        setState({ ...state, error: res.error });
      } else {
        getReplies();
      }
    });
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div className="contents">
        <img
          loading="lazy"
          width="200"
          height="200"
          style={{
            height: "100%",
            width: "100%",
            height: "45px",
            width: "45px",
            borderRadius: "50px",
            objectFit: "cover",
            background: "grey",
          }}
          src={
            reply.users[0]?.imageUrl
              ? reply.users[0]?.imageUrl?.cdnUrl
              : "/img/profile.png"
          }
          alt="profile"
        />

        <a
          href={
            "/expert/" +
            reply.users[0]?.expertCategories[0] +
            "/" +
            reply.users[0]?.slug
          }
          style={{ cursor: "pointer" }}
        >
          {reply.users[0]?.profile.firstName +
            " " +
            reply.users[0]?.profile.lastName}
        </a>
        <p className="text" style={{ marginBottom: "10px" }}>
          {reply.text}{" "}
          <span style={{ fontSize: "10px" }}>
            ({moment(reply.updatedAt).fromNow()})
          </span>
        </p>
      </div>

      <span>{reply.voters.length ? reply.voters.length : ""}</span>
      <i
        className={
          "fa fa-thumbs-up like " +
          (reply.like_slugs.includes(author) ? "green" : "")
        }
        style={{ padding: "0 8px", fontSize: "18px" }}
        onClick={() => {
          likeComment(reply._id);
        }}
        data-status="no"
        data-id={reply._id}
      ></i>

      <span>
        {reply.voters_dislikes && reply.voters_dislikes.length
          ? reply.voters_dislikes.length
          : ""}
      </span>
      <i
        className={
          "fa fa-thumbs-down dislike " +
          (reply.dislike_slugs.includes(author) ? "red2" : "")
        }
        onClick={() => {
          dislikeComment(reply._id);
        }}
        data-status="no"
        data-id={reply._id}
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

      {(profile?.slug && reply.author === profile?.slug) ||
      (profile?.slug && reply.expert === profile?.slug) ? (
        <img
          loading="lazy"
          onClick={onDeleteReply}
          src={trash}
          alt=""
          style={{
            marginLeft: "10px",
            height: "15px",
            width: "15px",
          }}
        />
      ) : null}
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
    </div>
  );
};

export default Reply;
