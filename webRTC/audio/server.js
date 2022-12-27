const express = require("express");
const app = express();
const { ExpressPeerServer } = require("peer");

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// peerjs server
const peerServer = ExpressPeerServer(listener, {
  debug: true,
  path: "/myapp",
  //turn on when behind proxy
  // proxied: true,
});

app.use("/", peerServer);
