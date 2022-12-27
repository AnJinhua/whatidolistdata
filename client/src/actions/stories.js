//  add delete story functionality
import axios from "axios";
import { API_URL } from "../constants/api";

//dispatch any type of action
export function selfDispatch(payload, type) {
  return (dispatch) => dispatch({ type: type, payload: payload });
}

export const postNewStory = (data, token) => {
  const url = `${API_URL}/stories/create`;
  return axios.post(url, data, {
    headers: {
      authorization: token,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const sendStoryReplyEmail = (data, token) => {
  const url = `${API_URL}/stories/notification/email`;
  axios.post(url, data, {
    headers: {
      authorization: token,
    },
  });
};

export const uploadS3 = (data, token) => {
  const url = `${API_URL}/stories/s3upload`;
  return axios.post(url, data, {
    headers: {
      authorization: token,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const viewUserStoryRequest = (id, userSlug) => {
  return axios.put(`${API_URL}/stories/view/${id}`, {
    view: userSlug,
  });
};

export const deleteNewStory = (id, token) => {
  return axios.delete(`${API_URL}/stories/${id}`, {
    headers: { Authorization: token },
  });
};
