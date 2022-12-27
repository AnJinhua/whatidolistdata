import axios from "axios";
import { XMPPApi } from "../constants/api";

const httpClient = axios.create({
  baseURL: XMPPApi,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => ({ error })
);

export default httpClient;
