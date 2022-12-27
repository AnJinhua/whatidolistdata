import React, { useEffect, useState } from "react";
import Image from "../common/ImageHandler/Image";
import axios from "axios";
import { API_URL } from "../../constants/api";
import Moment from "moment";
import Rating from "@mui/material/Rating";
const Review = ({ review, index }) => {
  const [userdata, setUserData] = useState();
  useEffect(async () => {
    const { data } = await axios.get(
      `${API_URL}/getExpert/${review.userEmail}`
    );
    setUserData(data);
  }, [review]);

  return (
    <div className="review-section-wrap" key={index}>
      <div className="review-star">
        <span>
          <img
            loading="lazy"
            width="45"
            height="45"
            style={{
              height: "45px",
              width: "45px",
              borderRadius: "50px",
              objectFit: "cover",
              backgroundColor: "grey",
              borderRadius: "50%",
            }}
            src={
              userdata?.imageUrl
                ? userdata?.imageUrl?.cdnUrl
                : "/img/profile.png"
            }
            alt="profile"
          />
        </span>
        <h3>
          <a
            className="reviewer-name"
            href={
              "/expert/" + userdata?.expertCategories[0] + "/" + userdata?.slug
            }
          >
            <strong>{review.userFullName}</strong>
          </a>

          <div className="rating-time">
            {Moment(review.createdAt).fromNow()}
          </div>
        </h3>
      </div>
      <Rating
        size="small"
        name="read-only"
        value={review.rating}
        readOnly
        precision={0.5}
      />
      <div className="comment-review">
        <p>{review.review}</p>
      </div>
    </div>
  );
};

export default Review;
