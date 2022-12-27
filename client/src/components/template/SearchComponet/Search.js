import React, { useRef, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { API_URL } from "../../../constants/api";
import Image from "../../common/ImageHandler/Image";
import getOnlineStatus from "../../../utils/getOnlineStatus";
import {
  SearchContainer,
  SearchInput,
  SearchIcon,
} from "../HeaderComponents/styles.component";

import { SearchMain, ListGroup } from "./styles.component";
import Rating from "@mui/material/Rating";
const Search = ({ setSearch }) => {
  const ulRef = useRef();
  const inputRef = useRef();
  const searchvalue = useSelector((state) => state.searchvalue.searchval);
  const history = useHistory();
  let cancelToken;
  const { onlineUsers } = useSelector((state) => state.messenger);
  useEffect(() => {
    inputRef.current.addEventListener("click", (event) => {
      event.stopPropagation();
      ulRef.current.style.display = "flex";
    });

    document.addEventListener("click", (event) => {
      if (ulRef.current !== null) {
        ulRef.current.style.display = "none";
      }
    });
  }, []);

  const searchInvoke = async (e) => {
    if (cancelToken) {
      cancelToken.cancel("Operations cancelled due to new request");
    }
    history.listen(() => {
      e.target.value = "";
    });

    cancelToken = axios.CancelToken.source();
    let results;

    try {
      if (e.target.value && e.target.value.length >= 1) {
        results = await axios.get(
          `${API_URL}/getExpertsListingByKeyword/&${e.target.value}`,
          {
            cancelToken: cancelToken.token,
          }
        );
      } else {
        setSearch([]);
      }
    } catch (e) {}

    if (results?.data.length > 0) {
      setSearch(results?.data);
    } else {
      setSearch([]);
    }
  };

  return (
    <SearchMain>
      <SearchContainer>
        <SearchIcon />
        <SearchInput
          placeholder="search"
          type="text"
          ref={inputRef}
          onChange={(e) => searchInvoke(e)}
        />
      </SearchContainer>
      <ListGroup ref={ulRef}>
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
                      src={option.imageUrl?.cdnUrl}
                      alt="profile"
                      width="40"
                      height="40"
                      style={{
                        height: "100%",
                        width: "100%",
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
      </ListGroup>
    </SearchMain>
  );
};

export default Search;
