import { SOCKET_CONNECTION } from "./index";
import { STORE_ONLINE_USER, QUOTE_MESSAGE } from "../constants/actions";
import axios from "axios";
import { API_URL } from "../constants/api";
import { sendNotification } from "../subscription";

//socket connection
export const socket = SOCKET_CONNECTION;
//= ===============================
// conversaiton actions
//= ===============================

export function readMessage(id) {
  return axios.put(API_URL + "/message/" + id, {
    read: true,
  });
}

export function uploadS3(file, token) {
  const url = `${API_URL}/message/uploads3`;
  return axios.post(url, file, {
    headers: {
      authorization: token,
      "Content-Type": "multipart/form-data",
    },
  });
}

export function uploadMultiS3(file, token) {
  const url = `${API_URL}/message/uploadMultiS3`;
  return axios.post(url, file, {
    headers: {
      authorization: token,
      "Content-Type": "multipart/form-data",
    },
  });
}

//dispatch any type of action
export function selfDispatch(payload, type) {
  return (dispatch) => dispatch({ type: type, payload: payload });
}

//function that quotes user message
export function quoteMessage(message) {
  return (dispatch) => dispatch({ type: QUOTE_MESSAGE, payload: message });
}

//function to store online users
export function storeOnlineUser(users) {
  return (dispatch) => dispatch({ type: STORE_ONLINE_USER, payload: users });
}
export const checkifConversationExist = (recieverSlug, senderSlug) => {
  const checkIfUserConversationUrl =
    API_URL + "/conversations/find/" + recieverSlug + "/" + senderSlug;

  return axios.get(checkIfUserConversationUrl);
};

export const getRedirectUrl = async (recieverSlug, senderSlug) => {
  try {
    const { data } = await checkifConversationExist(recieverSlug, senderSlug);
    if (data) {
      const archivedArray = data.archived;
      // check if senderSlug is in archived array
      const isArchived = archivedArray.find((item) => item === recieverSlug);

      return `/messages/${isArchived ? "archive" : "ongoing"}/${
        data._id
      }/${senderSlug}`;
    } else {
      return "/messages";
    }
  } catch (error) {
    console.log(error);
  }
};

export const getExpertRedirectUrl = async (cookies) => {
  return `/expert/${cookies?.user?.expertCategories[0]}/${cookies?.user?.slug}`;
};

export const postRestoreConversation = (conversationId, userSlug) => {
  let url = `${API_URL}/conversations/restoreTempDeleted/${conversationId}`;

  return axios.put(url, {
    restored: userSlug,
  });
};

export const postNewConversation = (newConversationData) => {
  const newConversationUrl = API_URL + "/conversations";
  return axios.post(newConversationUrl, newConversationData);
};

export const updateActiveConversation = (
  updateConversationData,
  conversationID
) => {
  const updateConversationUrl = API_URL + "/conversations/" + conversationID;
  return axios.put(updateConversationUrl, updateConversationData);
};
//send email notification
export const sendMaillNotification = async (notificationData, url) => {
  try {
    //send email notification
    axios.post(`${API_URL}/message/${url}`, notificationData);
  } catch (error) {
    console.log(error);
  }
};

//start conversation
export const startConversation =
  ({ recieverSlug, senderSlug, lastName, firstName, text, history }) =>
  async (dispatch) => {
    //if user is requesting to send message to himself take him to messages page else send message
    if (recieverSlug !== senderSlug) {
      try {
        const res = await checkifConversationExist(recieverSlug, senderSlug);

        if (!res.data) {
          try {
            const newConv = await postNewConversation({
              senderSlug,
              recieverSlug,
            });

            if (newConv.data) {
              socket.emit("updateConversation", {
                data: newConv.data,
                recieverSlug: recieverSlug,
              });

              try {
                const message = {
                  conversationId: newConv.data._id,
                  sender: senderSlug,
                  reciever: recieverSlug,
                  text: text,
                  withAvatar: true,
                  read: false,
                  quote: null,
                  senderName: {
                    firstName: firstName,
                    lastName: lastName,
                  },
                };

                axios.post(API_URL + "/message", message).then(async (res) => {
                  let pushNotificationData = {
                    title: `${res.data.senderName.firstName} started a conversation`,
                    description: res.data.text,
                    userSlug: res.data.reciever,
                    action: "view message",
                    senderSlug: `${res.data.sender}`,
                    endUrl: await getRedirectUrl(
                      res.data.reciever,
                      res.data.sender
                    ),
                    redirectUrl: null,
                  };

                  sendNotification(pushNotificationData);
                  socket.emit("sendMessage", {
                    data: res.data,
                    recieverSlug: recieverSlug,
                  });
                  history.push({
                    pathname:
                      "/messages/ongoing/" +
                      newConv.data._id +
                      "/" +
                      recieverSlug,
                  });
                });
              } catch (error) {
                console.log({ errOnNewMessage: error });
              }
            }
          } catch (error) {
            console.log({ errOnNewConv: error });
          }
        } else {
          if (res.data._id) {
            const archivedArray = res.data.archived;
            // check if senderSlug is in archived array
            const isArchived = archivedArray.find(
              (item) => item === senderSlug
            );

            history.push({
              pathname: `/messages/${isArchived ? "archive" : "ongoing"}/${
                res.data._id
              }/${recieverSlug}`,
            });
          }
        }
      } catch (error) {
        console.log({ errOnFindConv: error });
      }
    }
  };

export const sendDirectMessage = (messageData) => {
  let url = `${API_URL}/message`;

  return axios.post(url, messageData);
};

export const sendMessageToUser =
  ({
    recieverSlug,
    senderSlug,
    lastName,
    firstName,
    text,
    link,
    quote,
    emailNotificationData,
    share,
  }) =>
  async (dispatch) => {
    try {
      let activeConversation = await checkifConversationExist(
        recieverSlug,
        senderSlug
      );

      if (!activeConversation.data) {
        //start conversation data
        try {
          const newConversationData = {
            senderSlug,
            recieverSlug,
          };
          const newConv = await postNewConversation(newConversationData);

          socket.emit("updateConversation", {
            data: newConv.data,
            recieverSlug: recieverSlug,
          });

          const message = {
            conversationId: newConv.data._id,
            sender: senderSlug,
            reciever: recieverSlug,
            text: text,
            zoomLink: link,
            withAvatar: true,
            read: false,
            quote: quote,
            share: share,
            senderName: {
              firstName: firstName,
              lastName: lastName,
            },
          };

          const newMessage = await sendDirectMessage(message);
          socket.emit("sendMessage", {
            data: newMessage.data,
            recieverSlug: recieverSlug,
          });

          emailNotificationData.text = newMessage.data.share
            ? "shared a post"
            : newMessage.data.text;

          sendMaillNotification(
            emailNotificationData,
            emailNotificationData.endPointUrl
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        const deleted = activeConversation?.data?.deleted?.find(
          (d) => d === senderSlug
        );
        const deletedEnd = activeConversation?.data?.deleted?.find(
          (d) => d === recieverSlug
        );

        const lastConversationMessage = {
          lastReciever: recieverSlug,
        };

        try {
          if (deleted) {
            postRestoreConversation(activeConversation.data._id, senderSlug);
          } else if (deletedEnd) {
            postRestoreConversation(activeConversation.data._id, recieverSlug);
          }

          updateActiveConversation(
            lastConversationMessage,
            activeConversation.data._id
          );

          const message = {
            conversationId: activeConversation.data._id,
            sender: senderSlug,
            reciever: recieverSlug,
            text: text,
            withAvatar: true,
            zoomLink: link,
            read: false,
            quote: quote,
            share: share,
            senderName: {
              firstName: firstName,
              lastName: lastName,
            },
          };

          const newMessage = await sendDirectMessage(message);

          socket.emit("sendMessage", {
            data: newMessage.data,
            recieverSlug: recieverSlug,
          });

          emailNotificationData.text = newMessage.data.text;

          sendMaillNotification(
            emailNotificationData,
            emailNotificationData.endPointUrl
          );
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
