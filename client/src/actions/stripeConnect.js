import axios from "axios";
import { API_URL } from "../constants/api";

export const createConnectAcct = (data, token) => {
  return axios.post(`${API_URL}/stripe-connect/account/create`, data, {
    "Content-Type": "multipart/form-data",
    headers: { Authorization: token },
  });
};

export const updateConnectAcct = (data, token) => {
  return axios.post(
    `${API_URL}/stripe-connect/account/update/${data.slug}`,
    data,
    {
      "Content-Type": "multipart/form-data",
      headers: { Authorization: token },
    }
  );
};

export const deleteConnectAcct = (slug, token) => {
  return axios.delete(`${API_URL}/stripe-connect/account/${slug}`, {
    headers: { Authorization: token },
  });
};

export const createPayout = (data, token) => {
  return axios.post(
    `${API_URL}/stripe-connect/account/payout/create/${data?.userSlug}`,
    data,
    {
      "Content-Type": "multipart/form-data",
      headers: { Authorization: token },
    }
  );
};
