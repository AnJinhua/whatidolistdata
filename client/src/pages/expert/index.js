import { startConversation } from "../../actions/messenger";
import {
  START_AUDIO_CALL_SESSION,
  REVIEW,
  PAYMENT_OPTIONS,
} from "../../constants/actions";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import useSWR from "swr";
import axios from "axios";
import { Field, reduxForm } from "redux-form";
import ProfileFeeds from "../../components/MediaFeeds/ProfileFeeds";
import ExpertReviews from "../../components/ExpertReviews/ExpertReviews";
import CommentBox from "../../components/comment/CommentBox";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { API_URL, CLIENT_ROOT_URL } from "../../constants/api";
import Socials from "./Socials";
import StoriesThumbs from "../../components/stories/StoriesThumbs";
import { showChatRoom } from "../../components/audioChat";
import { VIDEOCALL_CHANGE } from "../../constants/actions";
import Rating from "@mui/material/Rating";
import {
  ContactButton,
  ContactBtnContainer,
} from "../../components/reusables/styles";
import { BiVideo, BiChat } from "react-icons/bi";
import { RiMailSendLine } from "react-icons/ri";
import { MdAddIcCall } from "react-icons/md";
import { FcDonate } from "react-icons/fc";
import { FcRating } from "react-icons/fc";
import Donation from "../../components/DonationModal";
import EthDonation from "../../components/expertDonation";
import DonationOptions from "../../components/DonationOptions";
import * as coordinateToCountry from "coordinate_to_country";
import ReactCountryFlag from "react-country-flag";
import useMediaQuery from "@mui/material/useMediaQuery";

let ViewExpert = (props) => {
  const userslug = props?.match?.params?.slug;
  const [cookies, setCookie] = useCookies(["user"]);
  const [isPaystackAvailable, setIsPaystackAvailable] = useState(false);

  const largeScreen = useMediaQuery("(min-width:768px)");

  const default_url =
    "https://donnysliststory.sfo3.cdn.digitaloceanspaces.com/profile/profile.png";

  const [expert, setExpert] = useState(null);

  const [endorsements, setEndorsements] = useState([]);
  const [responseEmailMsg, setResponseEmailMsg] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  const User = useSelector((state) => state.user.profile);
  const { onlineUsers } = useSelector((state) => state.messenger);

  const { data, error } = useSWR(`${API_URL}/getExpertDetail/${userslug}`);
  const connectUrl = `${API_URL}/stripe-connect/account/${userslug}`;
  const { data: stripeAccount } = useSWR(connectUrl);

  const { data: transactions } = useSWR(`${API_URL}/transactions/${userslug}`);
  const { data: balance } = useSWR(
    `${API_URL}/stripe-connect/account/balance/${userslug}`
  );
  const { data: payout } = useSWR(
    `${API_URL}/stripe-connect/account/payouts/${userslug}`
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

  // get experts country code from latlng
  const expertCountry = coordinateToCountry(
    data?.data?.locationLat,
    data?.data?.locationLng,
    true
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
    if (data?.success === true) {
      setExpert(data?.data);
    } else if (data?.success === false) {
      history.push("/expert-notfound");
    }
    if (expert?.endorsements) {
      axios
        .get(`${API_URL}/getEndorsements/`, {
          params: {
            slug: expert?.endorsements,
          },
        })
        .then((res) => {
          setEndorsements(res.data);
        });
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

    // if (expert?.slug && expert?.slug !== User.slug) {
    //   const payload = {
    //     show: true,
    //     expert: {
    //       avatar: expert?.imageUrl?.cdnUrl,
    //       expertFullName: `${expert?.profile.firstName} ${expert?.profile.lastName}`,
    //       expertEmail: expert?.email,
    //       expertSlug: expert?.slug,
    //     },
    //   }
    //   dispatch({
    //     type: REVIEW,
    //     payload: payload,
    //   })
    // }
  }, [dispatch, data, expert?.endorsements]);

  useEffect(() => {
    const paystackAvailability = ["NG", "GH", "ZA"];

    if (paystackAvailability.includes(expertCountry[0])) {
      setIsPaystackAvailable(true);
    } else {
      setIsPaystackAvailable(false);
    }
  });

  const openVideoCallModal = () => {
    dispatch({
      type: VIDEOCALL_CHANGE,
      payload: { expert, show: true },
    });
  };

  const showReview = () => {
    if (expert?.slug && expert?.slug !== User.slug) {
      const payload = {
        show: true,
        expert: {
          avatar: expert?.imageUrl?.cdnUrl,
          expertFullName: `${expert?.profile.firstName} ${expert?.profile.lastName}`,
          expertEmail: expert?.email,
          expertSlug: expert?.slug,
        },
      };
      dispatch({
        type: REVIEW,
        payload: payload,
      });
    }
  };

  const audioCallRequest = async () => {
    dispatch({
      type: START_AUDIO_CALL_SESSION,
      payload: {
        remotePeerIdValue: expert?._id,
        remotePeer: expert,
        caller: User,
        peerId: localStorage.getItem("local_user_id"),
      },
    });
  };

  const setShow = () => {
    if (!cookies?.user?.slug) {
      history.push("/login");
    } else {
      dispatch({
        type: PAYMENT_OPTIONS,
        payload: true,
      });
    }
  };

  const renderTextarea = (field) => (
    <div>
      <textarea
        required
        rows="3"
        placeholder="Your message here"
        className="form-control"
        {...field.input}
      />
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
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const emailData = {
      senderName: `${cookies?.user?.firstName} ${cookies?.user?.lastName}`,
      recieverEmail: expert?.email,
      message: e.target[0].value,
      senderPhoto: cookies?.user?.imageUrl?.cdnUrl
        ? cookies.user.imageUrl?.cdnUrl
        : default_url,
      recieverPhoto: expert?.imageUrl?.cdnUrl
        ? expert.imageUrl?.cdnUrl
        : default_url,
      senderDesc: `Online expert in ${cookies?.user?.expertCategories[0]}`,
      recieverName: `${expert?.profile?.firstName} ${expert?.profile?.lastName}`,
      url: `${CLIENT_ROOT_URL}/expert/${cookies?.user?.expertCategories[0]}/${cookies?.user?.slug}`,
      baseUrl: CLIENT_ROOT_URL,
    };
    axios
      .post(`${API_URL}/sendEmailMessageToExpert`, emailData)
      .then((res) => {
        setResponseEmailMsg(
          "<div class='alert alert-success text-center'>" +
            "Your message has been sent successfully" +
            "</div>"
        );
        setTimeout(function () {
          window.$(".alert").text("");
          window.$(".alert").removeClass("alert alert-success text-center");
          window.$("input[name='email").val("");
          window.$("textarea[name='message").val("");
        }, 2000);
      })
      .catch((err) => {
        setResponseEmailMsg(
          "<div class='alert alert-danger text-center'>" +
            "Your message has not been sent successfully" +
            "</div>"
        );
        setTimeout(function () {
          window.$(".alert").text("");
          window.$(".alert").removeClass("alert alert-success text-center");
          window.$("input[name='email").val("");
          window.$("textarea[name='message").val("");
        }, 2000);
      });
  };
  const renderLoading = () => {
    return (
      <img
        loading="lazy"
        height="100"
        width="60"
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
    if (expert === undefined) {
      return (
        <div id="experts-list" className="experts-list section-padding">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <NavLink to="/">Home</NavLink>
                  </li>
                  <li className="breadcrumb-item active">
                    {expert.categor?.replace(/-/g, " ")}
                  </li>
                </ol>
                <div id="center">
                  <div id="pageTitle">
                    <div className="title">
                      {expert.categor?.replace(/-/g, " ")}
                    </div>
                    <div className="alert-danger alert">
                      Alas, No expert found in this category!
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
        <div id="experts-list" className="experts-list section-padding">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <NavLink to="/">Home</NavLink>
                  </li>
                  <li className="breadcrumb-item active">
                    {expert.categor?.replace(/-/g, " ")}
                  </li>
                </ol>
                <div id="center">
                  <div id="pageTitle">
                    <div className="title">
                      {expert.categor?.replace(/-/g, " ")}
                    </div>
                    <div className="alert-danger alert">
                      Uh oh: error occurred
                    </div>
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

  const redirectToLogin = (e) => {
    history.push("/login");
  };
  const goToMessage = () => {
    if (cookies.user) {
      const conversationStarter = {
        recieverSlug: expert.slug,
        senderSlug: cookies.user.slug,
        firstName: cookies.user.firstName,
        lastName: cookies.user.lastName,
        text: `Hi ${expert.profile?.firstName}`,
        history: history,
      };
      dispatch(startConversation(conversationStarter));
    } else {
      history.push("/login");
    }
  };

  const renderPosts = () => {
    const endorsements_render = endorsements.map((endorsement, index) => {
      return (
        <img
          loading="lazy"
          key={`IMG_${index}`}
          className="endorsement-image"
          width="50"
          height="50"
          src={
            endorsement.imageUrl?.cdnUrl
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

    if (expert) {
      return (
        <div id="view-experts" className="view-experts">
          <div className="container">
            <DonationOptions isPaystackAvailable={isPaystackAvailable} />
            <Donation
              stripeAccount={stripeAccount}
              userSlug={userslug}
              isPaystackAvailable={isPaystackAvailable}
            />
            <EthDonation isPaystackAvailable={isPaystackAvailable} />
            <div className="row">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <NavLink to="/">Home</NavLink>
                </li>
                <li className="breadcrumb-item">
                  <NavLink to={`/list/${expert.expertCategories}`}>
                    {expert.expertCategories[0]?.replace(/-/g, " ")}
                  </NavLink>
                </li>
                <li className="breadcrumb-item active">
                  {`${expert.profile?.firstName?.toLocaleLowerCase()}  ${expert.profile?.lastName?.toLocaleLowerCase()}`}
                </li>
              </ol>
            </div>
          </div>
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
                      top: "130px",
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
                // cdnUrl='https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/'
                cdnSuffix="svg"
              />
            </div>
            <div className="container">
              <div className="row">
                <div
                  className="expert-list-inner-wrap"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div className="col-md-12">
                    <div className="expert-detail-wrap">
                      <div className="row">
                        <div className="col-md-3 col-sm-4">
                          <div className="image-con">
                            <div className="expert-image">
                              {expert?.imageUrl?.cdnUrl &&
                              expert?.imageUrl?.cdnUrl !== {} &&
                              expert?.imageUrl?.cdnUrl !== undefined &&
                              expert?.imageUrl?.cdnUrl !== null ? (
                                window.innerWidth < 600 ? (
                                  <img
                                    loading="lazy"
                                    width="200"
                                    height="200"
                                    style={{
                                      height: "200px",
                                      Width: "200px",
                                      borderRadius: "50px",
                                      objectFit: "cover",
                                      backgroundColor: "grey",
                                      borderRadius: "50%",
                                    }}
                                    src={
                                      expert?.imageUrl?.cdnUrl
                                        ? expert?.imageUrl?.cdnUrl
                                        : "/img/profile.png"
                                    }
                                    alt="profile "
                                  />
                                ) : (
                                  <img
                                    loading="lazy"
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
                                      expert?.imageUrl?.cdnUrl
                                        ? expert?.imageUrl?.cdnUrl
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
                                  alt="profile "
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    borderRadius: "50px",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <img
                                  loading="lazy"
                                  className="image_view"
                                  src="/img/profile.png"
                                  alt="profile"
                                  style={{
                                    height: "320px",
                                    width: "260px",
                                    maxWidth: "300px",
                                    maxHeight: "400px",
                                    borderRadius: "50px",
                                    objectFit: "cover",
                                  }}
                                />
                              )}

                              {getOnlineStatus(expert.slug) ? (
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

                          <ContactBtnContainer>
                            earned&nbsp;
                            <span
                              style={{ fontSize: "18px", fontWeight: "bold" }}
                            >{`$${totalFundsMade}`}</span>
                            &nbsp;from whatido
                          </ContactBtnContainer>

                          <ContactBtnContainer>
                            <BiVideo
                              title="Start Video Session"
                              onClick={openVideoCallModal}
                              className="icon right"
                            />
                            {cookies.user ? (
                              <RiMailSendLine
                                title="Send E-Mail"
                                data-toggle="modal"
                                data-target="#myModalEmail"
                                className="icon right"
                              />
                            ) : (
                              <RiMailSendLine
                                title="Send E-Mail"
                                onClick={redirectToLogin}
                                className="icon right"
                              />
                            )}

                            <BiChat
                              title="Messages"
                              onClick={goToMessage}
                              className="icon right"
                            />
                            {/* <AiOutlineFilePdf
                              href={expert?.resumefileCloudinaryRef?.url}
                              title="Download Resume"
                              download
                              className="icon right"
                            /> */}
                            <MdAddIcCall
                              onClick={() =>
                                showChatRoom({
                                  ...expert,
                                  firstName: expert.profile.firstName,
                                  lastName: expert.profile.lastName,
                                })
                              }
                              title="Audio Call"
                              className="icon right"
                            />
                            <FcDonate
                              onClick={setShow}
                              title="Donation"
                              className="icon right"
                            />
                            <FcRating
                              onClick={showReview}
                              title="Review"
                              className="icon right"
                            />
                          </ContactBtnContainer>

                          <ContactBtnContainer>
                            <ContactButton
                              title="contact"
                              onClick={goToMessage}
                            >
                              contact
                            </ContactButton>
                          </ContactBtnContainer>
                        </div>

                        <div className="col-md-9 col-sm-8">
                          <div className="profile-detail">
                            <div className="name">
                              <dl className="dl-horizontal">
                                {expert.profile?.firstName !== "undefined" &&
                                expert.profile?.firstName !== "" &&
                                expert.profile?.firstName !== null ? (
                                  <div className="profile-bor-detail">
                                    <dt>Name</dt>
                                    <dd>
                                      <div className="text-left-detail">
                                        {`${expert.profile?.firstName} ${expert.profile?.lastName}`}
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
                                    <dt>Name</dt>
                                    <dd>
                                      <div className="text-left-detail">
                                        {`${expert.profile?.firstName} ${expert.profile?.lastName}`}
                                      </div>
                                    </dd>
                                  </div>
                                )}
                                {expert.expertCategories !== "undefined" &&
                                expert.expertCategories !== "" &&
                                expert.expertCategories !== null ? (
                                  <div className="profile-bor-detail">
                                    <dt>Area of expertise</dt>
                                    <dd>
                                      {expert.expertCategories[0]?.replace(
                                        /-/g,
                                        " "
                                      )}
                                    </dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail inactive_div">
                                    <dt>Area of expertise</dt>
                                    <dd>
                                      {expert.expertCategories[0]?.replace(
                                        /-/g,
                                        " "
                                      )}
                                    </dd>
                                  </div>
                                )}

                                <div className="profile-bor-detail">
                                  <dt>Years of expertise</dt>
                                  <dd>{expert?.yearsexpertise}</dd>
                                </div>

                                <div className="profile-bor-detail">
                                  <dt>Focus of expertise</dt>
                                  <dd>
                                    {expert?.expertFocusExpertise?.toLocaleLowerCase()}
                                  </dd>
                                </div>

                                {expert.university !== "undefined" &&
                                expert.university !== "" &&
                                expert.university !== null ? (
                                  <div className="profile-bor-detail">
                                    <dt>University</dt>
                                    <dd>
                                      {expert.university?.toLocaleLowerCase()}
                                    </dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail inactive_div">
                                    <dt>University</dt>
                                    <dd>
                                      {expert.university?.toLocaleLowerCase()}
                                    </dd>
                                  </div>
                                )}

                                <div className="profile-bor-detail">
                                  <dt>Rates</dt>
                                  <dd>{expert?.expertRates}</dd>
                                </div>

                                {expert.expertRating !== "undefined" &&
                                expert.expertRating !== "" &&
                                expert.expertRating !== null ? (
                                  <div className="profile-bor-detail">
                                    <dt>Rating</dt>
                                    <dd>
                                      {expert.expertRating &&
                                      expert.expertRating !== null &&
                                      expert.expertRating !== undefined &&
                                      expert.expertRating !== "" ? (
                                        <Rating
                                          size="large"
                                          name="read-only"
                                          value={expert.expertRating}
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
                                    <dt>Rating</dt>
                                    <dd>
                                      {expert.expertRating &&
                                      expert.expertRating !== null &&
                                      expert.expertRating !== undefined &&
                                      expert.expertRating !== "" ? (
                                        <Rating
                                          size="large"
                                          name="read-only"
                                          value={expert.expertRating}
                                          readOnly
                                          precision={0.5}
                                        />
                                      ) : (
                                        "No Ratings Available"
                                      )}
                                    </dd>
                                  </div>
                                )}
                                <Socials expert={expert} />
                                {endorsements_render !== "undefined" &&
                                endorsements_render !== "" &&
                                endorsements_render !== null ? (
                                  <div className="profile-bor-detail expert-endorsements">
                                    <dt>Followers </dt>
                                    <dd>{endorsements_render}</dd>
                                  </div>
                                ) : (
                                  <div className="profile-bor-detail expert-endorsements inactive_div">
                                    <dt>Followers </dt>
                                    <dd>{endorsements_render}</dd>
                                  </div>
                                )}
                                <div className="profile-bor-detail">
                                  <dt>Download Resume</dt>
                                  <dd>
                                    <a
                                      href={
                                        expert?.resumefileCloudinaryRef?.url
                                      }
                                      title="Download"
                                      download
                                      className="fa fa-file-pdf-o"
                                    ></a>
                                  </dd>
                                </div>
                              </dl>
                            </div>

                            <StoriesThumbs
                              userSlug={expert.slug}
                              profile={expert}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Media Display */}
                  <ProfileFeeds profile={expert} />
                  <div className="column-37">
                    <ExpertReviews expertSlug={expert.slug} />
                  </div>

                  <div className="comment">
                    <CommentBox
                      expert={expert.slug}
                      userEmail={expert.email}
                      expertEmail={expert.email}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                <form id="send_email_form" onSubmit={handleFormSubmit}>
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
                              style={{ opacity: 0, height: 0 }}
                            >
                              <div
                                className="col-md-12"
                                style={{ opacity: 0, height: 0 }}
                              >
                                <label>Your Email</label>
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

  if (!data && !error) {
    return <div>{renderLoading()}</div>;
  }

  return <div>{renderPosts()}</div>;
};

ViewExpert = reduxForm({
  form: "email-form",
})(ViewExpert);

export default ViewExpert;
