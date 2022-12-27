let lineHistory = [];
//for active chat users
let users = [];

//check if there is a user id already in the users array before adding a user
const addUser = (userSlug, socketId) => {
  !users.some((user) => user.userSlug === userSlug) &&
    users.push({ userSlug, socketId });
};

//get a user by id
const getUser = (userSlug) => {
  return users.find((user) => user.userSlug === userSlug);
};

//remove a user from users array
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("[SOCKET]:[USER]:[CONNECTED]");

    //take userId and socketId from client
    socket.on("addUser", (userSlug) => {
      addUser(userSlug, socket.id);
      io.emit("getUsers", users);
    });

    //send and get message
    socket.on("sendMessage", ({ data, recieverSlug }) => {
      const user = getUser(recieverSlug);
      if (user) {
        return io.to(user.socketId).emit("getMessage", { data });
      }
    });
    socket.on("istyping", ({ data, recieverSlug }) => {
      const user = getUser(recieverSlug);
      if (user) {
        return io.to(user.socketId).emit("onTyping", { data });
      }
    });
    //send and get read messages
    socket.on("readMessage", ({ data, recieverSlug }) => {
      const user = getUser(recieverSlug);
      if (user) {
        return io.to(user.socketId).emit("getReadMessage", { data });
      }
    });

    //update conversation
    socket.on("updateConversation", ({ data, recieverSlug }) => {
      const user = getUser(recieverSlug);
      if (user) {
        return io.to(user.socketId).emit("getUpdateConversation", { data });
      }
    });
    //delete message
    socket.on("deleteMessage", ({ data, recieverSlug }) => {
      const user = getUser(recieverSlug);
      if (user) {
        return io.to(user.socketId).emit("getDeletedMessage", { data });
      }
    });

    //on user disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });

    // first send the history to the new client
    Object.keys(lineHistory).forEach((i) => {
      console.log("[DRAW]:[LINE]");
      socket.emit("draw_line", { line: lineHistory[i] });
    });

    // add handler for message type "draw_line".
    socket.on("draw_line", (data) => {
      console.log("[SERVER]:[DRAW]:[LINE]");
      // add received line to history
      lineHistory.push(data.line);
      // send line to all clients
      io.emit("draw_line", { line: data.line });
    });
    socket.on("canvas-data", (data) => {
      console.log(Object.keys(data));
      socket.broadcast.emit("canvas-data", {
        id: data["roomId"],
        imageData: data["base64Image"],
      });
    });

    socket.on("canvas-cleared", (data) => {
      socket.broadcast.emit("canvas-cleared", {
        id: data["roomId"],
        cleared: true,
      });
    });
    socket.on("calling", (data) => {
      socket.broadcast.emit("calling", {
        expert_id: data.expertId,
        roomId: data.roomId,
      });
    });
    // On conversation entry, join broadcast channel
    socket.on("enter conversation", (conversation) => {
      socket.join(conversation);
      console.log(`[JOINED]:[${conversation}]`);
    });

    socket.on("leave conversation", (conversation) => {
      socket.leave(conversation);
      console.log(`[LEFT]:[${conversation}]`);
    });

    socket.on("new message", (conversation) => {
      console.log(`[NEW_MESSAGE]:[${JSON.stringify(conversation)}]`);
      io.sockets.in(conversation).emit("refresh messages", conversation);
    });

    socket.on("disconnect", () => {
      console.log("[SOCKET]:[USER]:[DISCONNECTED]");
    });

    /* expert session socket functions */

    // On conversation entry, join broadcast channel
    socket.on("expert enter session", (sessionOwnerUsername) => {
      socket.join(sessionOwnerUsername);
      console.log(`[SERVER_SIDE]:[JOINED]:${sessionOwnerUsername}`);
    });

    socket.on("expert leave session", (sessionOwnerUsername) => {
      socket.leave(sessionOwnerUsername);
      console.log(`[SERVER_SIDE]:[LEFT]:${sessionOwnerUsername}`);
    });

    socket.on("expert new message", (sessionOwnerUsername) => {
      console.log(
        `[SERVER_SIDE]:[EXPERT_NEW_MESSAGE]:${JSON.stringify(
          sessionOwnerUsername
        )}`
      );
      io.sockets
        .in(sessionOwnerUsername)
        .emit("refresh expert session messages", sessionOwnerUsername);
    });

    /* event fires when any user leave the session page */
    socket.on("expert user disconnected", (sessionOwnerUsername) => {
      lineHistory = [];
      console.log(
        `[SERVER_SIDE]:[EXPERT_USER]:[DISCONNECTED]:${sessionOwnerUsername}`
      );
      io.sockets
        .in(sessionOwnerUsername)
        .emit("expert user disconnected", sessionOwnerUsername);
    });

    /* event fires when any user leave the session page */
    socket.on("audio call to expert", (data) => {
      console.log(
        `[SERVER_SIDE]:[AUDIO_CALL]:[TO_EXPERT]:${data.userAudioCallSokcetname}`
      );
      io.sockets
        .to(data.expertAudioCallSokcetname)
        .emit("audio call to expert", data);
    });

    socket.on("disconnect incoming audio call to user", (data) => {
      console.log(
        `[DISCONNECT]:[INCOMING]:[AUDIO_CALL]:[TO_USER]:${data.userAudioCallSokcetname}`
      );
      io.sockets
        .to(data.userAudioCallSokcetname)
        .emit("disconnect incoming audio call to user", data);
    });

    // create expert audio call session
    socket.on("expert audio call session", (username) => {
      socket.join(username);
      console.log(`[EXPERT]:[AUDIO]:[CALL]:[SESSION]:[JOINED]:${username}`);
    });

    // will be fired when some expert starts a session
    socket.on("admin new expert session starting", () => {
      socket.emit("Update Expert Session List");
    });
    socket.on("TESTing", (data) => {
      console.log("[SOCKET]:[TEST]:", data);
    });

    
  });
};
