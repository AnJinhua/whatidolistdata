import axios from "axios";
import { API_URL } from "../constants/api";

export const putArchiveConversation = (conversationId, userSlug) => {
  return axios.put(`${API_URL}/conversations/archive/${conversationId}`, {
    archived: userSlug,
  });
};

export const deleteBadConversation = (conversationId) => {
  return axios.delete(`${API_URL}/conversations/${conversationId}`);
};
//function that restores archived conversation
export const putRestoreConversation = (conversationId, userSlug) => {
  return axios.put(`${API_URL}/conversations/restore/${conversationId}`, {
    archived: userSlug,
  });
};
//function that temporaryly delete conversation
export const putDeleteConversation = (conversationId, userSlug) => {
  return axios.put(`${API_URL}/conversations/delete/${conversationId}`, {
    deleted: userSlug,
  });
};

export const putBlockConversation = (conversationId, userSlug) => {
  return axios.put(`${API_URL}/conversations/block/${conversationId}`, {
    blocked: userSlug,
  });
};
export const putUnBlockConversation = (conversationId, userSlug) => {
  return axios.put(`${API_URL}/conversations/unblock/${conversationId}`, {
    blocked: userSlug,
  });
};
