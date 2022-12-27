import React, { useRef, useState, useEffect } from "react";
import { REVIEW } from "../../constants/actions";
import { useSelector, useDispatch } from "react-redux";
import { saveUserReview } from "../../actions/expert";
import { Modal } from "react-bootstrap";
import Close from "../../assets/close.svg";
import Image from "../common/ImageHandler/Image";
import LogoIcon from "../../assets/logo-icon.png";
import SendIcon from "@mui/icons-material/Send";
import "./ReviewModal.css";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import swal from "sweetalert";
import { toast } from "react-toastify";

const ReviewModal = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const [value, setValue] = useState();
  const [textReview, setTextReview] = useState("");
  const { show, expert } = useSelector((state) => state.review);
  const { authenticated } = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user.profile);

  const handleClose = () => {
    dispatch({
      type: REVIEW,
      payload: false,
    });
  };

  const handleTextStories = (e) => {
    if (e.target.value.length < 201) {
      setTextReview(e.target.value);
    }
  };

  const handelSubmit = async () => {
    if (authenticated) {
      const reviewData = {
        usersAvatar: user?.imageCloudinaryRef?.public_id,
        rating: value,
        review: textReview,
        expertEmail: expert.expertEmail,
        expertFullName: expert.expertFullName,
        userEmail: user.email,
        userFullName: `${user?.profile.firstName} ${user?.profile.lastName}`,
        expertSlug: expert.expertSlug,
        reviewBy: `User ${user?.profile.firstName} ${user?.profile.lastName}`,
        title: "Review",
      };

      const reviewResponse = await dispatch(saveUserReview(reviewData));

      console.log(reviewResponse);
      if (reviewResponse.status == 1) {
        handleClose();
        swal("Review Submitted!", "", "success");
      }
    } else {
      toast.info(" Login to send review", {
        position: "top-center",
        theme: "dark",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title"
    >
      <Modal.Header>
        <div className="modal-header-row">
          <Modal.Title>
            <div className="review-modal-title">
              <img
                loading="lazy"
                src={LogoIcon}
                alt="logo"
                className="logo-icon-review"
              />
              <div
                className="
              "
              >
                add review{" "}
              </div>
            </div>
          </Modal.Title>
          <img loading="lazy" src={Close} alt="close" onClick={handleClose} />
        </div>
      </Modal.Header>
      <Modal.Body>
        {" "}
        <Image
          width="200"
          height="200"
          style={{
            height: "100%",
            width: "100%",
            maxWidth: "100px",
            maxHeight: "100px",
            borderRadius: "50%",
            objectFit: "cover",
            backgroundColor: "grey",
          }}
          public_id={expert.avatar}
          placeholder="/img/profile.png"
          alt="profile image"
        />
        <div className="review-info">Rate your experence with expert</div>
        <div className="rating-con">
          <Rating
            name="size-large"
            size="large"
            precision={0.5}
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </div>
        <textarea
          ref={inputRef}
          value={textReview}
          onChange={handleTextStories}
          className="review-text-area"
          placeholder="Write your review here..."
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handelSubmit}
        >
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewModal;
