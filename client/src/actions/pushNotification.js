import axios from "axios";
import { API_URL } from "../constants/api";

export const subscribe = (data) => {
  axios.post(`${API_URL}/push-notification/subscribe`, data);
};

export const notify = (data) => {
  axios.post(`${API_URL}/push-notification/notify`, data);
};

export const notifyAllSubscribers = (data) => {
  axios.post(`${API_URL}/push-notification/notifyAllSubscribers`, data);
};
