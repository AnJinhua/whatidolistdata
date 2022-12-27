import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from "../../constants/api";
import { useCookies } from "react-cookie";
import Displaylist from "./displaylist";
import { setPage } from "../../actions/setPage";
import useSWR from "swr";

const ExpertListingPage = (props) => {
  const [myFavorite, setMyFavorite] = useState([]);
  const [selectedExpertSlug, setSelectedExpertSlug] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [cookies, setCookie] = useCookies(["user"]);
  const currentUser = cookies.user;
  const { onlineUsers } = useSelector((state) => state.messenger);
  let category = props.match.params.category;
  const expertsUrl = `${API_URL}/getExpertsListing/${category}`;
  const topRatedUrl = `${API_URL}/getExpertsListing/topRated/${category}`;
  const { data: experts } = useSWR(expertsUrl);
  const { data: topRatedData } = useSWR(topRatedUrl);

  useEffect(() => {
    setPage("0");

    const currentUser = cookies?.user;

    if (currentUser) {
      console.log("current fired");
      const myFavorite = currentUser?.myFavorite;
      axios
        .post(`${API_URL}/getMyExpertsListing/`, {
          slug: myFavorite,
          category: category,
        })
        .then((res) => {
          setMyFavorite(res.data);
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          setError(err);
        });
    } else {
      setLoading(false);
    }
  }, [cookies.user]);

  const renderloading = () => {
    return (
      <img
        loading="lazy"
        height="100"
        width="60"
        className="loader-center"
        src="/img/Pulse-sm.svg"
        alt="loader"
      />
    );
  };

  const renderError = () => {
    if (experts === undefined) {
      return (
        <div className="alert-danger alert">
          Alas, No expert found in this category!
        </div>
      );
    } else {
      return <div className="alert-danger alert">Uh oh: {error.message}</div>;
    }
  };

  const addEndorsements = (slug) => {
    if (currentUser) {
      const fromSlug = currentUser.slug;
      const myFavorite = currentUser.myFavorite;
      myFavorite.push(slug);

      setCookie("user", currentUser, { path: "/" });
      const data = { toSlug: slug, fromSlug: fromSlug };
      axios
        .post(`${API_URL}/addEndorsements/`, data)
        .then((res) => {
          history.push("/expert/" + props.match.params.category + "/" + slug);
        })
        .catch((err) => {
          history.push("/expert/" + props.match.params.category + "/" + slug);
        });
    } else {
      props.history.push("/login");
    }
  };

  const getStars = (rating) => {
    var size = Math.max(0, Math.min(5, rating)) * 16;
    return Object.assign({ width: size });
  };

  const getOnlineStatus = (onlineStatus) => {
    const found = onlineUsers.some((item) => item.userSlug === onlineStatus);
    return found;
  };

  const selectVideoSessionMinutes = (item, e) => {
    setSelectedExpertSlug(item.slug);
    window.$(".notification-modal").trigger("click");
  };

  const redirectToLogin = (e) => {
    e.preventDefault();
    history.push("/login");
    setCookie(
      "requiredLogin_for_session",
      "Please login to start video session",
      { path: "/", secure: false, sameSite: "Lax" }
    );
  };

  if (error) {
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
                  {props.match.params.category}
                </li>
              </ol>
              <div id="center">
                <div id="pageTitle">
                  <div className="title">{props.match.params.category}</div>
                  {renderError()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="experts-list" className="experts-list min-height-full-page">
      <div className="expertise-tab-wrap">
        <div className="expertise-inner">
          <div className="container">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <NavLink to="/">Home</NavLink>
              </li>
              <li className="breadcrumb-item active">
                {props.match.params.category}
              </li>
            </ol>
            <div id="pageTitle">
              <div className="title">{props.match.params.category}</div>
              <div className="small">
                Select any one of the experts below to view their profile
              </div>
            </div>
            <br></br>
            <ul className="nav nav-tabs" role="tablist">
              <li role="presentation" className="active">
                <a
                  href="#home"
                  aria-controls="home"
                  role="tab"
                  data-toggle="tab"
                >
                  Latest
                </a>
              </li>
              <li role="presentation">
                <a
                  href="#profile"
                  aria-controls="profile"
                  role="tab"
                  data-toggle="tab"
                >
                  Top Rated
                </a>
              </li>
              <li role="presentation">
                <a
                  href="#my_favorite"
                  aria-controls="settings"
                  role="tab"
                  data-toggle="tab"
                >
                  My Favorites
                </a>
              </li>
            </ul>
            {loading ? (
              renderloading()
            ) : (
              <Displaylist
                posts={experts}
                currentUser={currentUser}
                topRated={topRatedData}
                getOnlineStatus={getOnlineStatus}
                myFavorite={myFavorite}
                addEndorsements={addEndorsements}
                getStars={getStars}
                selectedExpertSlug={selectedExpertSlug}
                redirectToLogin={redirectToLogin}
                selectVideoSessionMinutes={selectVideoSessionMinutes}
                props={props}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertListingPage;
