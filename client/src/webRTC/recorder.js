import axios from "axios";
import { localStream, remoteStreams } from "./peerEvents";
import { Cookies } from "react-cookie";
import { RecordRTCPromisesHandler } from "recordrtc";
import { API_URL } from "../constants/api";
import store from "../store";

const cookies = new Cookies().getAll();

let recorder;

export const startRecording = () => {
  const streams = [localStream, ...Object.values(remoteStreams)];
  console.log("combine streams", streams);
  recorder = new RecordRTCPromisesHandler(streams, {
    type: "audio",
    mimeType: "audio/webm",
  });

  recorder.startRecording();
  console.log("successfully started redcording");
};

export const stopRecording = async () => {
  const roomId = store.getState().audioRoom.room._id;

  await recorder.stopRecording();
  let blob = await recorder.getBlob();

  console.log(`stop recording type ${blob.type} ${blob.size}`, blob);
  var file = new File([blob], `${roomId}.webm`);
  console.log("convert blob to file", file);
  uploadRecording(file, roomId);
};

export const uploadRecording = async (file, roomId) => {
  //todo implement this
  const data = new FormData();
  data.append("file", file);
  data.append("roomId", roomId);
  console.log("uploading recording roomid", roomId);
  const url = `${API_URL}/room/uploadRecording`;
  const response = await axios.post(url, data, {
    headers: {
      Authorization: cookies.token,
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("finished uploading recording", response.data);
};
