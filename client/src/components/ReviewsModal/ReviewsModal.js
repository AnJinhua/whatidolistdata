import React from "react";
import { Modal } from "react-bootstrap";
import { ADD_REVIEWS } from "../../constants/actions";
import { useSelector, useDispatch } from "react-redux";
import ReviewIcon from "../../assets/review2.png";
import Close from "../../assets/close.svg";
import Image from "../common/ImageHandler/Image";
import Rating from "@mui/material/Rating";

const ReviewsModal = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.profile);
  const show = useSelector((state) => state.addReview.show);

  const handleClose = () => {
    dispatch({
      type: ADD_REVIEWS,
      payload: false,
    });
  };

  return (
    <Modal
      show={true}
      onHide={handleClose}
      aria-labelledby="contained-modal-title"
    >
      <Modal.Header>
        <div className="modal-header-row">
          <Modal.Title>YOUR REVIEW</Modal.Title>
          <img loading="lazy" src={Close} alt="close" onClick={handleClose} />
        </div>
      </Modal.Header>
      <Modal.Body>
        <img
          loading="lazy"
          src={ReviewIcon}
          alt="review-icon"
          style={{
            height: "40px",
            width: "50px",
            // marginLeft: '40px',
          }}
        />
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
          }}
          public_id={
            user?.imageUrl ? user?.imageUrl.cdnUrl : "/img/profile.png"
          }
          placeholder="/img/profile.png"
          alt="profile image"
        />
        <Rating
          name="customized-10"
          precision={0.5}
          defaultValue={2}
          max={10}
        />
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default ReviewsModal;
