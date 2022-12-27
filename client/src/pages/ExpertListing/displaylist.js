import React from "react";
import Image from "../../components/common/ImageHandler/Image";
import NotificationModal from "../notification-modal";
import { Link } from "react-router-dom";
import "./styles.css";

const Displaylist = ({
  posts,
  currentUser,
  topRated,
  getOnlineStatus,
  myFavorite,
  addEndorsements,
  getStars,
  selectedExpertSlug,
  redirectToLogin,
  selectVideoSessionMinutes,
  props,
}) => {
  const round = (value) => {
    var inv = 1.0 / 0.5;
    return Math.round(value * inv) / inv;
  };

  return (
    <div className="tab-content">
      <div role="tabpanel" className="tab-pane active" id="home">
        <div className="expertise-all-detail-wrap">
          {posts?.map((post, index) => (
            <div className="expertise-detail-only" key={`POST_INDEX_${index}`}>
              <div className="row">
                <div className="col-sm-8">
                  <div className="row">
                    <div className="col-sm-2 mobileCol">
                      <div className="img-expert">
                        {post?.imageUrl?.cdnUrl &&
                        post?.imageUrl?.cdnUrl !== null &&
                        post?.imageUrl?.cdnUrl !== undefined &&
                        post?.imageUrl?.cdnUrl !== "" ? (
                          <img
                            loading="lazy"
                            src={
                              post.imageUrl?.cdnUrl
                                ? post.imageUrl?.cdnUrl
                                : "/img/profile.png"
                            }
                            className="mini-profile-pic"
                            alt="profile"
                          />
                        ) : (
                          <img
                            loading="lazy"
                            width="100%"
                            src="/img/profile.png"
                            alt=""
                            className="mini-profile-pic"
                          />
                        )}
                        {getOnlineStatus(post.slug) ? (
                          <i
                            data-toggle="title"
                            title="Online"
                            className={"user-online-m fa fa-circle"}
                            aria-hidden="true"
                          ></i>
                        ) : (
                          <i
                            data-toggle="title"
                            title="Offline"
                            className={"user-offline-m fa fa-circle"}
                            aria-hidden="true"
                          ></i>
                        )}
                      </div>
                    </div>
                    <div className="col-sm-10 mobileInfo">
                      <div className="person-per-info ">
                        <Link
                          to={`/expert/${props.match.params.category}/${post.slug}`}
                        >
                          <h2>
                            {`${post.profile.firstName} ${post.profile.lastName}`}
                          </h2>
                        </Link>

                        <p>University: {post.university}</p>
                        <p>Area of Expertise: {post.expertCategories}</p>

                        <p>
                          Focus of Expertise:
                          {post.expertFocusExpertise}
                        </p>
                        <p>Years of Expertise: {post.yearsexpertise}</p>
                        <p>
                          Rating:
                          {post.expertRating &&
                          post.expertRating != null &&
                          post.expertRating !== undefined &&
                          post.expertRating !== ""
                            ? round(post.expertRating)
                            : "No Ratings Available Yet"}
                          {post.expertRating && post.expertRating !== "" && (
                            <i className="fa fa-star" aria-hidden="true"></i>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 mobileInfo2">
                  <div className="stars-review">
                    <span className="stars right">
                      <span style={getStars(post.expertRating)}></span>
                    </span>
                  </div>
                  <div className="btn-expertise">
                    {
                      <div
                        className="Start-Session btn-strt-session btn btn-primary pull-right"
                        onClick={(e) => addEndorsements(post.slug)}
                      >
                        Follow
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
          {posts &&
            posts != null &&
            posts !== undefined &&
            posts.length === 0 && (
              <div role="tabpanel" className="tab-pane" id="settings">
                <div className="expertise-all-detail-wrap">
                  <div className="alert">No expert found in this section!</div>
                </div>
              </div>
            )}
        </div>
      </div>
      <div>
        {currentUser ? (
          <NotificationModal
            userEmail={currentUser.email}
            expertSlug={selectedExpertSlug}
            modalId="notificationModal"
          />
        ) : (
          ""
        )}
      </div>
      <div role="tabpanel" className="tab-pane" id="profile">
        <div className="expertise-all-detail-wrap">
          {topRated?.map((post, index) => (
            <div className="expertise-detail-only" key={`TAB_ITEM_${index}`}>
              <div className="row">
                <div className="col-sm-8">
                  <div className="row">
                    <div className="col-sm-2 mobileCol">
                      <div className="img-expert">
                        {post?.imageUrl?.cdnUrl &&
                        post?.imageUrl?.cdnUrl !== null &&
                        post?.imageUrl?.cdnUrl !== undefined &&
                        post?.imageUrl?.cdnUrl !== "" ? (
                          <img
                            loading="lazy"
                            src={
                              post.imageUrl?.cdnUrl
                                ? post.imageUrl?.cdnUrl
                                : "/img/profile.png"
                            }
                            alt="profile"
                            width="250"
                            height="250"
                            className="mini-profile-pic"
                          />
                        ) : (
                          <img
                            loading="lazy"
                            width="100%"
                            src="/img/profile.png"
                            alt=""
                            className="mini-profile-pic"
                          />
                        )}
                        {getOnlineStatus(post.slug) ? (
                          <i
                            data-toggle="title"
                            title="Online"
                            className={"user-online-m fa fa-circle"}
                            aria-hidden="true"
                          ></i>
                        ) : (
                          <i
                            data-toggle="title"
                            title="Offline"
                            className={"user-offline-m fa fa-circle"}
                            aria-hidden="true"
                          ></i>
                        )}
                      </div>
                    </div>
                    <div className="col-sm-10 mobileInfo">
                      <div className="person-per-info">
                        <Link
                          to={`/expert/${props.match.params.category}/${post.slug}`}
                        >
                          <h2>
                            {`${post.profile.firstName} ${post.profile.lastName}`}
                          </h2>
                        </Link>
                        <p>About Expert: {post.userBio}</p>
                        <p>Area of Expertise: {post.expertCategories}</p>
                        <p>
                          Country:
                          {post.locationCountry &&
                          post.locationCountry !== "" &&
                          post.locationCountry !== null &&
                          post.locationCountry !== undefined
                            ? post.locationCountry
                            : "-"}
                        </p>
                        <p>
                          State:
                          {post.locationState &&
                          post.locationState !== "" &&
                          post.locationState !== null &&
                          post.locationState !== undefined
                            ? post.locationState
                            : "-"}
                        </p>
                        <p>
                          City:
                          {post.locationCity &&
                          post.locationCity !== "" &&
                          post.locationCity !== null &&
                          post.locationCity !== undefined
                            ? post.locationCity
                            : "-"}
                        </p>
                        <p>
                          Focus of Expertise:
                          {post.expertFocusExpertise}
                        </p>
                        <p>Years of Expertise: {post.yearsexpertise}</p>
                        <p>
                          Rating: {round(post.expertRating)}
                          {post.expertRating && post.expertRating !== "" && (
                            <i className="fa fa-star" aria-hidden="true"></i>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 mobileInfo2">
                  <div className="stars-review">
                    <span className="stars right">
                      <span style={getStars(post.expertRating)}></span>
                    </span>
                  </div>
                  <div className="btn-expertise">
                    <button
                      className="btn-strt-session btn btn-primary pull-right"
                      onClick={(e) => addEndorsements(post.slug)}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {topRated &&
            topRated !== null &&
            topRated !== undefined &&
            topRated.length === 0 && (
              <div role="tabpanel" className="tab-pane" id="settings">
                <div className="expertise-all-detail-wrap">
                  <div className="alert alert-danger">
                    No expert found in this section!
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
      <div role="tabpanel" className="tab-pane" id="messages">
        <div className="expertise-all-detail-wrap">
          <div className="alert alert-danger">
            No expert found in this section!
          </div>
        </div>
      </div>
      <div role="tabpanel" className="tab-pane" id="my_favorite">
        <div className="expertise-all-detail-wrap">
          {myFavorite?.map((post, index) => (
            <div className="expertise-detail-only" key={`FAVORITE_${index}`}>
              <div className="row">
                <div className="col-sm-8">
                  <div className="row">
                    <div className="col-sm-2 mobileCol">
                      <div className="img-expert">
                        {post.imageUrl?.cdnUrl &&
                        post.imageUrl?.cdnUrl !== null &&
                        post.imageUrl?.cdnUrl !== undefined &&
                        post.imageUrl?.cdnUrl !== "" ? (
                          <img
                            loading="lazy"
                            src={
                              post.imageUrl?.cdnUrl
                                ? post.imageUrl?.cdnUrl
                                : "/img/profile.png"
                            }
                            alt="profile"
                            width="250"
                            height="250"
                            className="mini-profile-pic"
                          />
                        ) : (
                          <img
                            loading="lazy"
                            width="100%"
                            src="/img/profile.png"
                            alt=""
                            className="mini-profile-pic"
                          />
                        )}
                        {getOnlineStatus(post.slug) ? (
                          <i
                            data-toggle="title"
                            title="Online"
                            className={"user-online-m fa fa-circle"}
                            aria-hidden="true"
                          ></i>
                        ) : (
                          <i
                            data-toggle="title"
                            title="Offline"
                            className={"user-offline-m fa fa-circle"}
                            aria-hidden="true"
                          ></i>
                        )}
                      </div>
                    </div>
                    <div className="col-sm-10 mobileInfo">
                      <div className="person-per-info">
                        <Link
                          to={`/expert/${props.match.params.category}/${post.slug}`}
                        >
                          <h2>
                            {`${post.profile.firstName} ${post.profile.lastName}`}
                          </h2>
                        </Link>

                        <p>University: {post.university}</p>
                        <p>Area of Expertise: {post.expertCategories}</p>

                        <p>
                          Focus of Expertise:
                          {post.expertFocusExpertise}
                        </p>
                        <p>Years of Expertise: {post.yearsexpertise}</p>
                        <p>
                          Rating:
                          {post.expertRating &&
                          post.expertRating != null &&
                          post.expertRating !== undefined &&
                          post.expertRating !== ""
                            ? round(post.expertRating)
                            : "No Ratings Available Yet"}
                          {post.expertRating && post.expertRating !== "" && (
                            <i className="fa fa-star" aria-hidden="true"></i>
                          )}
                        </p>
                        {/*}<p>Rates: {post.expertRates} <span>★</span></p>{*/}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4 mobileInfo2">
                  <div className="stars-review">
                    <span className="stars right">
                      <span style={getStars(post.expertRating)}></span>
                    </span>
                  </div>
                  <div className="btn-expertise">
                    {/*}<Link to={`/expert/${props.match.params.category}/${post.slug}`} className="btn-strt-session btn btn-primary pull-right">Start Video Session</Link>{*/}
                    {currentUser ? (
                      <Link
                        to="/#"
                        data-toggle="modal"
                        title="Start Video Session"
                        data-target="#notificationModal"
                        onClick={selectVideoSessionMinutes.bind(this, post)}
                        data-slug={post.slug}
                        className="Start-Session btn-strt-session btn btn-primary pull-right"
                      >
                        Connect
                      </Link>
                    ) : (
                      <div
                        onClick={redirectToLogin.bind(this)}
                        className="Start-Session btn-strt-session btn btn-primary pull-right"
                      >
                        Connect
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {myFavorite &&
            myFavorite != null &&
            myFavorite !== undefined &&
            myFavorite.length === 0 && (
              <div role="tabpanel" className="tab-pane" id="settings">
                <div className="expertise-all-detail-wrap">
                  <div className="alert alert-danger">
                    No expert found in this section!
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Displaylist;
