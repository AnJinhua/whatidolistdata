import axios from "axios";
import { getData } from "./index";
import { API_URL, MEDIA_PROCESSING_URL } from "../constants/api";
import {
  MESSENGER_ERROR,
  ADD_MANY_MEDIA,
  ADD_MANY_MEDIA_COMMENTS,
} from "../constants/actions";

//get user stories
export function getUserMedia(userSlug) {
  const url = `/media/all/${userSlug}`;
  return (dispatch) =>
    getData(ADD_MANY_MEDIA, MESSENGER_ERROR, false, url, dispatch);
}

export const postNewMedia = (data, token) => {
  return axios.post(`${API_URL}/media/create`, data, {
    "Content-Type": "multipart/form-data",
    headers: { Authorization: token },
  });
};

export const deleteNewMedia = (id, token) => {
  return axios.delete(`${API_URL}/media/${id}`, {
    headers: { Authorization: token },
  });
};

export const postNewMediaComment = (data, token) => {
  return axios.post(`${API_URL}/media/comment/create`, data, {
    headers: { Authorization: token },
  });
};

export const deleteMediaComment = (id, token) => {
  return axios.delete(`${API_URL}/media/comment/${id}`, {
    headers: { Authorization: token },
  });
};

export const deleteMediaFile = (path, key) => {
  return axios.delete(`${API_URL}/media/file/${path}/${key}`);
};

export const noMediaFileFetch = () => {
  const url = `${API_URL}/media/get-no-file`;
  return axios.get(url);
};

export const downloadCloudinaryMedia = (url) => {
  return axios.get(url, { responseType: "blob" });
};

export const pathMedia = (id, token) => {
  return axios.put(`${API_URL}/media/edit/${id}`, {
    headers: { Authorization: token },
  });
};

export const postMediaImage = (data, token) => {
  const url = `${API_URL}/media/uploadImage`;
  return axios.post(
    url,
    {
      image: data.imageUrl.secure_url,
      userSlug: data.userSlug,
      location: "media",
    },
    { headers: { Authorization: token } }
  );
};
export const uploadS3 = (data, token) => {
  const url = `${API_URL}/media/uploadS3`;
  return axios.post(url, data, {
    "Content-Type": "multipart/form-data",
    headers: { Authorization: token },
  });
};

export const getMediaProcessed = (data, urlPoint) => {
  const mediaUrl = `${MEDIA_PROCESSING_URL}/${urlPoint}`;
  return fetch(mediaUrl, {
    method: "POST",
    body: data,
  });
};
