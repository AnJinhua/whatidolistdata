import { useSelector } from "react-redux";
import { useEffect } from "react";
import { socket } from "../socketEvents";
import { setOnlinePeer, peer } from "../peerEvents";

export const useAudioCallSetup = () => {
  const user = useSelector((state) => state.user.profile);
  const socketId = useSelector((state) => state.audioRoom.socketId);

  useEffect(() => {
    if (user._id && typeof peer === "undefined" && socketId) {
      socket.emit("user-ready", { userId: user._id, socketId });

      const peerFromStorage = fetchPeerFromLocalStorage();
      if (peerFromStorage) {
        console.log("found peer in local storage, assigning", peerFromStorage);
        peer = peerFromStorage;
      } else {
        console.log("couldn't find peer in local storage, creating new");
        setOnlinePeer(user, user._id);
      }
    } else {
      console.warn(
        "user not authenticated yet in useAudioCallSetup or is already setup"
      );
    }
  }, [user, socketId]);
};

function fetchPeerFromLocalStorage() {
  const peer = localStorage.getItem("peer");
  if (peer) {
    return JSON.parse(peer);
  }
  return undefined;
}
