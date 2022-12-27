import React from "react";
import { useSelector } from "react-redux";
import Image from "../../common/ImageHandler/Image";
import getOnlineStatus from "../../../utils/getOnlineStatus";
import Rating from "@mui/material/Rating";
import { useHistory } from "react-router-dom";
import useWindow from "../../../utils/useWindow";

import { MobileListGroup } from "./styles.component";
const MobileSearch = () => {
  const history = useHistory();
  const windowSize = useWindow();
  const searchvalue = useSelector((state) => state.searchvalue.searchval);
  const { onlineUsers } = useSelector((state) => state.messenger);

  const result = () => {
    return (
      <MobileListGroup>
        {searchvalue?.map((option, index) => {
          return (
            <button
              type="button"
              key={index}
              className="list-group-item list-group-item-action item-con"
              onClick={() => {
                history.push(
                  `/expert/${option.expertCategories[0]}/${option.slug}`
                );
              }}
            >
              <div className="search-details">
                <div className="search-img">
                  {option?.imageUrl?.cdnUrl &&
                  option?.imageUrl?.cdnUrl !== null &&
                  option?.imageUrl?.cdnUrl !== undefined &&
                  option?.imageUrl?.cdnUrl !== "" ? (
                    <img
                      loading="lazy"
                      src={
                        option.imageUrl?.cdnUrl
                          ? option.imageUrl?.cdnUrl
                          : "/img/profile.png"
                      }
                      alt="profile"
                      width="40"
                      height="40"
                      style={{
                        borderRadius: "50%",
                        maxWidth: "40px",
                        maxHeight: "40px",
                        objectFit: "cover",
                        backgroundColor: "grey",
                      }}
                    />
                  ) : (
                    <img
                      loading="lazy"
                      width="40px"
                      src="/img/profile.png"
                      alt=""
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                  )}
                  {getOnlineStatus(option.slug, onlineUsers) ? (
                    <i
                      data-toggle="title"
                      title="Online"
                      className={"user-online-o-s fa fa-circle online-size"}
                      aria-hidden="true"
                    ></i>
                  ) : (
                    <i
                      data-toggle="title"
                      title="Offline"
                      className={"user-offline-o-s fa fa-circle online-size"}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="search-dis">
                  <div className="search-name">
                    {" "}
                    {`${option.profile.firstName} ${option.profile.lastName}`}
                  </div>
                  <div className="search-areaOfexp">
                    {option.expertCategories}
                  </div>
                </div>
              </div>
              <div className="search-ratings">
                {option.expertRating !== "undefined" &&
                option.expertRating !== "" &&
                option.expertRating !== null ? (
                  <Rating
                    size="small"
                    name="read-only"
                    value={option.expertRating}
                    readOnly
                    precision={0.5}
                  />
                ) : (
                  <Rating
                    size="small"
                    name="read-only"
                    value={0}
                    readOnly
                    precision={0.5}
                  />
                )}
              </div>
            </button>
          );
        })}
      </MobileListGroup>
    );
  };

  const render = () => {
    if (windowSize.width < 768 && searchvalue.length > 0) {
      return result();
    } else {
      return null;
    }
  };

  return render();
};

export default MobileSearch;
