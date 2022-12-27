import axios from "axios";
import {
  API_URL,
  CLIENT_ROOT_URL,
  MESSAGE_INCORRECT_USERNAME_PASSWORD,
} from "../constants/api";
import { errorHandler } from "./index";
import {
  AUTH_USER,
  AUTH_ERROR,
  UNAUTH_USER,
  RESET_PASSWORD_REQUEST,
  PROTECTED_TEST,
  EXPERT_SIGNUP_LINK_REQUEST,
  UPDATE_EXPERT_VISIBILITY,
  CURRENT_USER,
  USER_PROFILE_REMOVE,
} from "../constants/actions";

import { Cookies } from "react-cookie";
import { toast } from "react-toastify";

const cookies = new Cookies();

const getNextYear = () => {
  let d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const nextYear = new Date(year + 1, month, day);

  return nextYear;
};
//= ===============================
// Authentication actions
//= ===============================
function setUser(user) {
  return {
    type: CURRENT_USER,
    payload: user,
  };
}

//login using native auth
export function loginUser({ email, password }, browserHistory) {
  const expiringDate = getNextYear();
  return function (dispatch) {
    if (email !== undefined && password !== undefined) {
      return axios
        .post(
          `${API_URL}/auth/login`,
          { email, password },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Access-Control-Allow-Origin": "http://localhost:3000/",
            },
          }
        )
        .then((response) => {
          console.log(response.status);
          if (response.data?.errorMessage) {
            return response.data;
          } else {
            dispatch(setUser(response.data.user));
            cookies.set("token", response.data.token, {
              path: "/",
              secure: false,
              sameSite: "Lax",
              expires: expiringDate,
            });
            console.log(response.data.user);
            cookies.set("user", response.data.user, {
              path: "/",
              secure: false,
              sameSite: "Lax",
              expires: expiringDate,
            });

            dispatch({
              type: UPDATE_EXPERT_VISIBILITY,
              payload: response.data.user.locationVisbility,
            });
            let data = {
              locationLat: "",
              locationLng: "",
              email: email,
            };

            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                data.locationLat = position.coords.latitude;
                data.locationLng = position.coords.longitude;
                axios.put(`${API_URL}/location`, data).then((response) => {
                  return console.log(response.data);
                });
              });
            } else {
              alert("Geolocation is not supported by this browser.");
            }

            axios
              .get(`${API_URL}/getExpert/${email}`)
              .then((res) => {
                var slug = res.data[0].slug;
                var category = res.data[0].expertCategories[0];
                localStorage.setItem("slug", slug);
                localStorage.setItem("category", category);
              })
              .catch((err) => {
                console.error(err);
              });
            dispatch({ type: AUTH_USER });
            browserHistory?.push("/");
            return response;
          }
        })
        .catch((error) => {
          // console.log(error)
          return { errorMessage: MESSAGE_INCORRECT_USERNAME_PASSWORD };
        });
    } else {
      return "empty_parameters";
    }
  };
}

//login using federative  auth
export function loginUserFed(data, browserHistory) {
  const expiringDate = getNextYear();
  return function (dispatch) {
    if (data) {
      dispatch(setUser(data.user));

      cookies.set("token", data.token, {
        path: "/",
        secure: false,
        sameSite: "Lax",
        expires: expiringDate,
      });

      cookies.set("user", data.user, {
        path: "/",
        secure: false,
        sameSite: "Lax",
        expires: expiringDate,
      });
      dispatch({
        type: UPDATE_EXPERT_VISIBILITY,
        payload: data.user.locationVisbility,
      });
      let Locdata = {
        locationLat: "",
        locationLng: "",
        email: data.user.email,
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          Locdata.locationLat = position.coords.latitude;
          Locdata.locationLng = position.coords.longitude;
          axios.put(`${API_URL}/location`, Locdata).then((response) => {
            return;
          });
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }

      dispatch({ type: AUTH_USER });
    }
  };
}

export function facebookLoginUser(response) {
  return function (dispatch) {
    return axios
      .post(`${API_URL}/auth/login-facebook-user`, { response })
      .then((response) => {
        cookies.set("token", response.data.token, {
          path: "/",
          secure: false,
          sameSite: "Lax",
        });
        cookies.set("user", response.data.user, {
          path: "/",
          secure: false,
          sameSite: "Lax",
        });
        window.location.href = `${CLIENT_ROOT_URL}/profile`;
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

//finsih signing up protected route
export function finshSignUp(
  { email, firstName, lastName, password, expertise },
  token
) {
  const expiringDate = getNextYear();
  return function (dispatch) {
    return axios
      .post(
        `${API_URL}/auth/finish-signup`,
        {
          email,
          firstName,
          lastName,
          password,
          expertise,
        },
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then(
        (response) => {
          if (response.data.success === true) {
            cookies.set("token", response.data.token, {
              path: "/",
              secure: false,
              sameSite: "Lax",
              expires: expiringDate,
            });
            cookies.set("user", response.data.user, {
              path: "/",
              secure: false,
              sameSite: "Lax",
              expires: expiringDate,
            });

            dispatch({
              type: UPDATE_EXPERT_VISIBILITY,
              payload: response.data.user.locationVisbility,
            });
            let data = {
              locationLat: "",
              locationLng: "",
              email: email,
            };

            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                data.locationLat = position.coords.latitude;
                data.locationLng = position.coords.longitude;
                axios.put(`${API_URL}/location`, data).then((response) => {
                  return console.log(response.data);
                });
              });
            } else {
              alert("Geolocation is not supported by this browser.");
            }
          }

          return response;
        },
        (err) => {
          console.log(err);
        }
      )
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

export function registerUser({
  email,
  firstName,
  lastName,
  password,
  expertise,
}) {
  // const expiringDate = getNextYear()

  return function (dispatch) {
    return axios
      .post(`${API_URL}/auth/register`, {
        email,
        firstName,
        lastName,
        password,
        expertise,
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

export function logoutUser(error) {
  return function (dispatch) {
    const userId = cookies.get("user");
    var user_id = userId?._id;
    axios.post(`${API_URL}/auth/logout/${user_id}`);
    dispatch({ type: UNAUTH_USER, payload: error || "" });
    dispatch({ type: USER_PROFILE_REMOVE });
    localStorage.clear();

    cookies.remove("token", { path: "/" });
    cookies.remove("user", { path: "/" });
    cookies.remove("token", { path: "/" });
    cookies.remove("session", { path: "/" });
    cookies.remove("session.sig", { path: "/" });
    window.location.href = `${CLIENT_ROOT_URL}/login`;
  };
}
export const customLogoutUser = (browserHistory) => {
  return async (dispatch) => {
    const userId = cookies.get("user");
    var user_id = userId?._id;
    await axios.post(`${API_URL}/auth/logout/${user_id}`).catch((err) => {
      console.log(err);
    });
    axios
      .get(`${API_URL}/auth/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          dispatch({ type: UNAUTH_USER, payload: "" });
          dispatch({ type: USER_PROFILE_REMOVE });
          localStorage.clear();
          cookies.remove("token", { path: "/" });
          cookies.remove("user", { path: "/" });
          cookies.remove("DonnieslistCookies", { path: "/" });
          // history.push('/')
          window.location.href = `${CLIENT_ROOT_URL}/`;
        }
      });
  };
};

export const deleteState = (browserHistory, _id) => {
  const token = cookies.get("token");
  return async (dispatch) => {
    try {
      await axios.get(`${API_URL}/auth/logout`, {
        withCredentials: true,
      });

      const { data } = await axios.delete(`${API_URL}/userExpert/${_id}`, {
        headers: {
          authorization: token,
        },
      });
      console.log(data);
      if (!data.success) {
        toast.error(data.error, {
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
      if (data.success) {
        console.log("delete fired");
        localStorage.clear();
        cookies.remove("token", { path: "/" });
        cookies.remove("user", { path: "/" });
        cookies.remove("DonnieslistCookies", { path: "/" });
        dispatch({ type: UNAUTH_USER, payload: "" });
        dispatch({ type: USER_PROFILE_REMOVE });
        browserHistory.push("/");
        toast.success("account successfully deleted", {
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
    } catch (error) {
      toast.error(error, {
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
};

export function resetPassword(token, { password }) {
  return function (dispatch) {
    axios
      .post(`${API_URL}/auth/reset-password/${token}`, { password })
      .then((response) => {
        dispatch({
          type: RESET_PASSWORD_REQUEST,
          payload: { message: response.data.message },
        });
        // Redirect to login page on successful password reset
        window.location.href = "/login";
      })
      .catch((error) => {
        console.log(error.response);
        dispatch({
          type: RESET_PASSWORD_REQUEST,
          payload: { error: error.response.data.error },
        });
      });
  };
}

export function protectedTest() {
  return function (dispatch) {
    axios
      .get(`${API_URL}/protected`, {
        headers: { Authorization: cookies.get("token") },
      })
      .then((response) => {
        dispatch({
          type: PROTECTED_TEST,
          payload: response.data.content,
        });
      })
      .catch((error) => {
        errorHandler(dispatch, error.response, AUTH_ERROR);
      });
  };
}

//= ===============================
// signupExpertSendSignupLink actions
//= ===============================
export function signupExpertSendSignupLink({ email }) {
  return function (dispatch) {
    var expertEmail = "ermohit400@yahoo.com";
    if (email !== undefined) {
      return axios
        .post(`${API_URL}/auth/signupExpertSendSignupLink`, {
          email,
          expertEmail,
        })
        .then((response) => {
          dispatch({
            type: EXPERT_SIGNUP_LINK_REQUEST,
            payload: response.data,
          });
          return response.data;
        })
        .catch((error) => {
          errorHandler(dispatch, error.response, AUTH_ERROR);
        });
    }
  };
}
