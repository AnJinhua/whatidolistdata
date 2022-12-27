import React from "react";
import { useSelector } from "react-redux";
import Image from "../common/ImageHandler/Image";
const CommentForm = (props) => {
  const user = useSelector((state) => state.user);
  const { profile } = user;
  return (
    <form
      onSubmit={(e) => {
        props.handleSubmitComment(e);
      }}
    >
      {props.formType === "form_reply" && (
        <div className="input-column">
          <div className="image-wrapper">
            {profile?.imageUrl ? (
              <img
                loading="lazy"
                width="200"
                height="200"
                style={{
                  height: "50px",
                  width: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  background: "grey",
                }}
                src={
                  profile?.imageUrl
                    ? profile?.imageUrl?.cdnUrl
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
                  height: "50px",
                  width: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        </div>
      )}
      <div className="input-column full-width">
        <div className="input-row">
          <textarea
            name="text"
            maxLength="10000"
            autoComplete="off"
            value={props.text}
            rows={props.text ? props.text.split("\n").length : 1}
            placeholder={props.placeholder}
            onChange={(e) => props.handleChangeText(e.target.value)}
          />
        </div>
        <div className="input-row">
          <div className="button-wrapper">
            <button
              className="button-cancel button-reply"
              onClick={(e) => props.handleShowForm(e, false)}
            >
              Cancel
            </button>
            <button className="button-reply" type="submit">
              {props.buttonName}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
