import axios from "axios";
import { API_URL } from "../constants/api";

export const createTransaction = (data, token) => {
  return axios.post(`${API_URL}/transactions/create`, data, {
    "Content-Type": "multipart/form-data",
    headers: { Authorization: token },
  });
};
