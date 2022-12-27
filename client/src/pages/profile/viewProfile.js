import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import useSWR from "swr";
import axios from "axios";
import { Field, reduxForm } from "redux-form";
// import AudioRecording from "../AudioRecording";
import ExpertReviews from "../../components/ExpertReviews/ExpertReviews";
import CommentBox from "../../components/comment/CommentBox";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { API_URL, CLIENT_ROOT_URL } from "../../constants/api";
import { toast } from "react-toastify";
import { handleShow } from "../../actions/user";
import Socials from "./Socials";
import Rating from "@mui/material/Rating";
import ProfileStories from "../../components/stories/ProfileStories";
import { ProfileIconsContainer, ShareIconsContainer } from "./styles";
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  TwitterIcon,
  LinkedinIcon,
  RedditIcon,
  WhatsappIcon,
  TelegramIcon,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { MdOutlineContentCopy } from "react-icons/md";
import MediaFeeds from "../../components/MediaFeeds";
import ReactCountryFlag from "react-country-flag";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as coordinateToCountry from "coordinate_to_country";

let ViewProfile = () => {
  const [cookies] = useCookies(["user"]);
  const [addStory, setAddStory] = useState(false);
  const [responseEmailMsg, setResponseEmailMsg] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { onlineUsers } = useSelector((state) => state.messenger);

  const largeScreen = useMediaQuery("(min-width:768px)");

  let user = useSelector((state) => state.user);
  let { loading, error, profile } = user;

  const dispatch = useDispatch();
  const history = useHistory();

  const fetcher = (url) =>
    axios
      .get(url, {
        params: {
          slug: cookies?.user?.endorsements,
        },
      })
      .then((res) => res.data);

  const { data: endorsements } = useSWR(`${API_URL}/getEndorsements/`, fetcher);

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  ));

  // const { data: locationDetails } = useSWR('http://ip-api.com/json')
  const expertCountry = coordinateToCountry(
    user?.profile?.locationLat,
    user?.profile?.locationLng,
    true
  );

  const { data: transactions } = useSWR(
    `${API_URL}/transactions/${user?.profile?.slug}`
  );
  const { data: balance } = useSWR(
    `${API_URL}/stripe-connect/account/balance/${user?.profile?.slug}`
  );
  const { data: payout } = useSWR(
    `${API_URL}/stripe-connect/account/payouts/${user?.profile?.slug}`
  );

  // convert balance and payout to USD
  const { data: balanceToUsd } = useSWR(
    `https://api.exchangerate.host/convert?from=${
      balance?.pending[0]?.currency
    }&to=USD&amount=${balance?.pending[0]?.amount / 100}`
  );

  const { data: payoutToUsd } = useSWR(
    `https://api.exchangerate.host/convert?from=${
      balance?.pending[0]?.currency
    }&to=USD&amount=${payout?.payoutsAmount / 100}`
  );

  let contractBalance = 0;

  transactions?.map((transaction) => {
    if (transaction?.paymentProvider === "smart contract") {
      contractBalance += transaction?.amount;
    }
    return contractBalance;
  });

  const totalFundsMade =
    Math.ceil(balanceToUsd?.result) +
      Math.ceil(payoutToUsd?.result) +
      contractBalance || 0;

  useEffect(() => {
    if (cookies?.user?.slug == "undefined") {
      history.push("/login");
    }
    window.$(document).ready(function () {
      window.$("#send_email_form").validate({
        rules: {
          email: { required: true, email: true },
          message: { required: true },
        },
        messages: {
          email: { required: "Please enter this field" },
          message: { required: "Please enter this field" },
        },
      });
      window.$("#send_text_form").validate({
        rules: {
          email: { required: true, email: true },
          message: { required: true },
        },
        messages: {
          email: { required: "Please enter this field" },
          message: { required: "Please enter this field" },
        },
      });
    });
  }, [cookies]);

  const renderTextarea = (field) => (
    <div>
      <textarea
        required
        rows="3"
        placeholder="Your message here"
        className="form-control"
        {...field.input}
      ></textarea>
      {field.touched && field.error && (
        <div className="error">{field.error}</div>
      )}
    </div>
  );

  const renderFileInput = (field) => (
    <div>
      <input
        required
        type="file"
        className="form-control"
        {...field.input}
      ></input>
      {field.touched && field.error && (
        <div className="error">{field.error}</div>
      )}
    </div>
  );

  const addNewStory = (e) => {
    setAddStory(!addStory);
  };

  const submitNewStory = (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(document.getElementById("thumbnailMediaFile").files[0]);
    console.log(document.getElementById("storyMediaFile").files[0]);
    formData.append(
      "thumbnail",
      document.getElementById("thumbnailMediaFile").files[0]
    );
    formData.append(
      "story",
      document.getElementById("storyMediaFile").files[0]
    );
    axios
      .post(`${API_URL}/user/add-story/${cookies.user.slug}`, formData, {
        headers: {
          Authorization: cookies.token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const renderLoading = () => {
    return (
      <img
        loading="lazy"
        height="100"
        width="60"
        btnS
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
        className="loader-center"
        src="/img/Pulse-sm.svg"
        alt="loader"
      />
    );
  };

  const renderError = () => {
    if (profile && profile === undefined) {
      return (
        <div id="profiles-list" className="profiles-list section-padding">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <NavLink to="/">Home</NavLink>
                  </li>
                  <li className="breadcrumb-item active">{profile.category}</li>
                </ol>
                <div id="center">
                  <div id="pageTitle">
                    <div className="title">{profile.category}</div>
                    <div className="alert-danger alert">
                      Alas, No profile found in this category!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div id="profiles-list" className="profiles-list section-padding">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <NavLink to="/">Home</NavLink>
                  </li>
                  <li className="breadcrumb-item active">{profile.category}</li>
                </ol>
                <div id="center">
                  <div id="pageTitle">
                    <div className="title">{profile.category}</div>
                    <div className="alert-danger alert">Uh oh: {error}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
  const getOnlineStatus = (onlineStatus) => {
    const found = onlineUsers.some((item) => item.userSlug === onlineStatus);
    return found;
  };

  const goToMessage = () => {
    history.push("/messages");
  };

  const renderPosts = () => {
    const endorsements_render = endorsements?.map((endorsement, index) => {
      return (
        <img
          loading="lazy"
          key={`IMG_${index}`}
          className="endorsement-image"
          width="50"
          height="50"
          src={
            endorsement?.imageUrl
              ? endorsement.imageUrl?.cdnUrl
              : "/img/profile.png"
          }
          alt="profile"
          style={{
            objectFit: "cover",
            backgroundColor: "grey",
          }}
        />
      );
    });

    if (error) {
      return renderError();
    }

    if (profile) {
      return (
        <div id="view-experts" className="view-experts">
          {/* bread crumbs */}
          <div className="container">
            <div className="row">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <NavLink to="/">home</NavLink>
                </li>

                <li className="breadcrumb-item active">profile</li>
              </ol>
            </div>
          </div>

          {/* left side profile  details */}
          <div className="expert-list-wrap">
            <div
              btnS
              style={
                largeScreen
                  ? {
                      display: "none",
                    }
                  : {
                      float: "right",
                      textTransform: "capitalize",
                      position: "absolute",
                      right: 0,
                      padding: "6px 8px",
                      top: "122px",
                    }
              }
              className="text-right label"
            >
              <ReactCountryFlag
                countryCode={expertCountry[0]}
                style={{
                  fontSize: "4em",
                  lineHeight: "2em",
                }}
                aria-label={expertCountry[0]}
                svg
                // cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                cdnSuffix="svg"
              />
            </div>
            <div className="container">
              <div className="row">
                <div
                  className="expert-list-inner-wrap"
                  btnS
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div
                    btnS // style={{ marginInline: '20px' }}
                    className="col-md-12"
                  >
                    <div className="expert-detail-wrap">
                      <div className="row">
                        <div className="col-md-3 col-sm-4">
                          <div className="image-con">
                            <div
                              className="expert-image"
                              onClick={() => dispatch(handleShow())}
                            >
                              {profile?.imageUrl?.cdnUrl ? (
                                window.innerWidth < 600 ? (
                                  <img
                                    loading="lazy"
                                    width="200"
                                    height="200"
                                    btnS
                                    style={{
                                      height: "200px",
                                      Width: "200px",
                                      borderRadius: "50px",
                                      objectFit: "cover",
                                      backgroundColor: "grey",
                                      borderRadius: "50%",
                                    }}
                                    src={
                                      profile?.imageUrl
                                        ? profile?.imageUrl.cdnUrl
                                        : "/img/profile.png"
                                    }
                                    alt="profile"
                                  />
                                ) : (
                                  <img
                                    loading="lazy"
                                    btnS
                                    style={{
                                      width: "100%",
                                      minHeight: "320px",
                                      minWidth: "260px",
                                      maxWidth: "300px",
                                      maxHeight: "400px",
                                      borderRadius: "50px",
                                      backgroundColor: "grey",
                                      objectFit: "cover",
                                    }}
                                    src={
                                      profile?.imageUrl
                                        ? profile?.imageUrl.cdnUrl
                                        : "/img/profile.png"
                                    }
                                    alt="profile"
                                  />
                                )
                              ) : window.innerWidth < 600 ? (
                                <img
                                  loading="lazy"
                                  className="image_view"
                                  src="/img/profile.png"
                                  alt=""
                                  style={{
                                    height: "200px",
                                    Width: "200px",
                                    borderRadius: "50px",
                                    objectFit: "contain",
                                    backgroundColor: "grey",
                                    borderRadius: "50%",
                                  }}
                                />
                              ) : (
                                <img
                                  loading="lazy"
                                  className="image_view"
                                  src="/img/profile.png"
                                  alt=""
                                  style={{
                                    width: "100%",
                                    minHeight: "320px",
                                    maxWidth: "300px",
                                    maxHeight: "400px",
                                    borderRadius: "50px",
                                    backgroundColor: "grey",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                              {getOnlineStatus(profile.slug) ? (
                                <i
                                  data-toggle="title"
                                  title="Online"
                                  className={"user-online-o fa fa-circle"}
                                  aria-hidden="true"
                                ></i>
                              ) : (
                                <i
                                  data-toggle="title"
                                  title="Offline"
                                  className={"user-offline-o fa fa-circle"}
                                  aria-hidden="true"
                                ></i>
                              )}
                            </div>
                          </div>
                          <ShareIconsContainer>
                            <div className="earn-text">
                              you've earned&nbsp;
                              <span
                                style={{ fontSize: "18px", fontWeight: "bold" }}
                              >{`$${totalFundsMade}`}</span>
                              &nbsp;from whatido
                            </div>

                            <p className="share-text">share profile</p>
                            <ProfileIconsContainer>
                              <FacebookShareButton
                                quote="Profile"
                                url={`${CLIENT_ROOT_URL}/expert/${profile?.expertCategories[0]}/${profile?.slug}`}
                              >
                                <FacebookIcon className="icon right" />
                              </FacebookShareButton>
                              <WhatsappShareButton
                                title="Profile"
                                url={`${CLIENT_ROOT_URL}/expert/${profile?.expertCategories[0]}/${profile?.slug}`}
                                separator=":: "
                              >
                                <WhatsappIcon className="icon right" />
                              </WhatsappShareButton>
                              <TelegramShareButton
                                title="Profile"
                                url={`${CLIENT_ROOT_URL}/expert/${profile?.expertCategories[0]}/${profile?.slug}`}
                              >
                                <TelegramIcon className="icon right" />
                              </TelegramShareButton>
                              <TwitterShareButton
                                quote="Profile"
                                url={`${CLIENT_ROOT_URL}/expert/${profile?.expertCategories[0]}/${profile?.slug}`}
                              >
                                <TwitterIcon className="icon right" />
                              </TwitterShareButton>
                              <LinkedinShareButton
                                quote="Profile"
                                url={`${CLIENT_ROOT_URL}/expert/${profile?.expertCategories[0]}/${profile?.slug}`}
                              >
                                <LinkedinIcon className="icon right" />
                              </LinkedinShareButton>
                              <RedditShareButton
                                title="Profile"
                                url={`${CLIENT_ROOT_URL}/expert/${profile?.expertCategories[0]}/${profile?.slug}`}
                                windowWidth={660}
                                windowHeight={460}
                              >
                                <RedditIcon className="icon right" />
                              </RedditShareButton>
                              <MdOutlineContentCopy
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `${CLIENT_ROOT_URL}/expert/${profile?.expertCategories[0]}/${profile?.slug}`
                                  );
                                  toast.success("Link copied to clipboard", {
                                    position: "top-center",
                                    theme: "light",
                                    autoClose: 4000,
                                    hideProgressBar: true,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  });
                                }}
                                className="icon right"
                              />
                            </ProfileIconsContainer>
                          </ShareIconsContainer>
                        </div>

                        <div className="col-md-9 col-sm-8">
                          <div className="profile-detail">
                            <div className="name">
                              <dl className="dl-horizontal">
                                {profile.profile?.firstName !== "undefined" &&
                                profile.profile?.firfstName !== "" &&
                                profile.profile?.firstName !== null ? (
                                  <div className="profile-bor-detail">
                                    <dt>name</dt>
                                    <dd>
                                      <div className="text-left-detail">
                                        {`${profile.profile?.firstName}  ${profile.profile?.lastName}`}
                                      </div>
                                      <div
                                        btnS
                                        style={
                                          largeScreen
                                            ? {
                                                float: "right",
                                                textTransform: "capitalize",
                                                position: "absolute",
                                                right: 0,
                                                padding: "6px 0",
                                                bottom: "60px",
                                              }
                                            : {
                                                display: "none",
                                              }
                                        }
                                        className="text-right label"
                                      >
                                        <ReactCountryFlag
                                          countryCode={expertCountry[0]}
                                          style={{
                                            fontSize: "4em",
                                            lineHeight: "2em",
                                          }}
                                          aria-label={expertCountry[0]}
                                          svg
                                          // cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                          cdnSuffix="svg"
                                        />
                                      </div>
                                    </dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail inactive_div">
                                    <dt>name</dt>
                                    <dd>
                                      <div className="text-left-detail">
                                        {`${profile.profile?.firstName}  ${profile.profile?.lastName}`}
                                      </div>
                                    </dd>
                                  </div>
                                )}
                                {profile.expertCategories !== "undefined" &&
                                profile.expertCategories !== "" &&
                                profile.expertCategories !== null ? (
                                  <div className="profile-bor-detail">
                                    <dt>area of expertise</dt>
                                    <dd>
                                      {profile?.expertCategories[0]?.replace(
                                        /-/g,
                                        " "
                                      )}
                                    </dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail inactive_div">
                                    <dt>area of expertise</dt>
                                    <dd>
                                      {profile?.expertCategories[0]?.replace(
                                        /-/g,
                                        " "
                                      )}
                                    </dd>
                                  </div>
                                )}

                                <div className="profile-bor-detail">
                                  <dt>years of expertise</dt>
                                  <dd>{profile?.yearsexpertise}</dd>
                                </div>

                                <div className="profile-bor-detail">
                                  <dt>focus of expertise</dt>
                                  <dd>
                                    {profile?.expertFocusExpertise?.toLocaleLowerCase()}
                                  </dd>
                                </div>

                                {profile.university !== "undefined" &&
                                profile.university !== "" &&
                                profile.university !== null ? (
                                  <div className="profile-bor-detail">
                                    <dt>university</dt>
                                    <dd>{profile.university}</dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail inactive_div">
                                    <dt>university</dt>
                                    <dd>{profile.university}</dd>
                                  </div>
                                )}

                                <div className="profile-bor-detail">
                                  <dt>rates</dt>
                                  <dd>{profile?.expertRates}</dd>
                                </div>

                                {profile.expertRating !== "undefined" &&
                                profile.expertRating !== "" &&
                                profile.expertRating !== null ? (
                                  <div className="profile-bor-detail">
                                    <dt>rating</dt>
                                    <dd>
                                      {profile.expertRating &&
                                      profile.expertRating !== null &&
                                      profile.expertRating !== undefined &&
                                      profile.expertRating !== "" ? (
                                        <Rating
                                          size="large"
                                          name="read-only"
                                          value={profile.expertRating}
                                          readOnly
                                          precision={0.5}
                                        />
                                      ) : (
                                        "No Ratings Available"
                                      )}
                                    </dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail inactive_div">
                                    <dt>rating</dt>
                                    <dd>
                                      {profile.expertRating &&
                                      profile.expertRating !== null &&
                                      profile.expertRating !== undefined &&
                                      profile.expertRating !== "" ? (
                                        <Rating
                                          size="large"
                                          name="read-only"
                                          value={profile.expertRating}
                                          readOnly
                                          precision={0.5}
                                        />
                                      ) : (
                                        "No Ratings Available"
                                      )}
                                    </dd>
                                  </div>
                                )}
                                <Socials expert={profile} />
                                {endorsements !== "undefined" &&
                                endorsements !== "" &&
                                endorsements !== null ? (
                                  <div className="profile-bor-detail expert-endorsements">
                                    <dt>followers </dt>
                                    <dd>{endorsements_render}</dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail expert-endorsements inactive_div">
                                    <dt>followers </dt>
                                    <dd>{endorsements_render}</dd>
                                  </div>
                                )}
                                <div className="profile-bor-detail">
                                  <dt>download resume</dt>
                                  <dd>
                                    <a
                                      href={profile?.resumeUrl?.cdnUrl}
                                      title="Download"
                                      download
                                      className="fa fa-file-pdf-o"
                                    ></a>
                                  </dd>
                                </div>
                              </dl>
                            </div>
                            {/* stories */}

                            <ProfileStories profile={profile} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <MediaFeeds profile={profile} />

                  <div className="column-37">
                    <div className="">
                      <ExpertReviews expertSlug={profile.slug} />
                    </div>
                    <div className="comment">
                      <CommentBox
                        expert={profile.slug}
                        userEmail={profile.email}
                        expertEmail={profile.email}
                      />
                    </div>
                    {/* <div className="">
                      <Carousel
                        //   ref={this.carousel_ref}
                        height={400}
                        sources={profile.portfolio}
                      />
                      
                 
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* email sending modal */}
          <div
            id="myModalEmail"
            className="modal fade continueshoppingmodal"
            role="dialog"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">
                    ×
                  </button>
                  <h4 className="modal-title">Send Email</h4>
                </div>
                <form id="send_email_form">
                  <div className="modal-body">
                    <p className="text-center">
                      {" "}
                      Shoot email message to expert{" "}
                    </p>
                    <table className="table table-hover">
                      <tbody>
                        <tr>
                          <td>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: responseEmailMsg,
                              }}
                            ></div>
                            <div
                              className="row form-group"
                              btnS
                              style={{ opacity: 0, height: 0 }}
                            >
                              <div
                                className="col-md-12"
                                btnS
                                style={{ opacity: 0, height: 0 }}
                              >
                                <label>Your Email</label>
                                {/*<Field*/}
                                {/*  name="email"*/}
                                {/*  component={renderField}*/}
                                {/*  type="email"*/}
                                {/*  value="00@mail.com"*/}
                                {/*/>*/}
                              </div>
                            </div>
                            <div className="row form-group">
                              <div className="col-md-12">
                                <label>Your Message</label>
                                <Field
                                  name="message"
                                  rows="3"
                                  component={renderTextarea}
                                  type="text"
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {/*end of table*/}
                  </div>
                  {/*end of modal body*/}
                  <div className="modal-footer">
                    <div className="bootstrap-dialog-footer">
                      <div className="bootstrap-dialog-footer-buttons text-center">
                        <div className="form-group">
                          <button type="submit" className="btn btn-primary">
                            Send Email
                          </button>
                          &nbsp;
                          <button
                            type="button"
                            className="btn btn-default"
                            data-dismiss="modal"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* myModalEmail for email end here */}
        </div>
      );
    }
  };

  return <div>{loading ? renderLoading() : renderPosts()}</div>;
};

ViewProfile = reduxForm({
  form: "email-form",
})(ViewProfile);

export default ViewProfile;
