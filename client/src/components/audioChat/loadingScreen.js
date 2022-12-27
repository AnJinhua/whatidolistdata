import { Box, Text } from "@mui/material";
import { useSelector } from "react-redux";

export function EstablishingAudioConnection() {
  const isConnecting = useSelector((state) => state.audioRoom.connecting);
  console.log("isConnecting state: ", isConnecting);

  return (
    <Box
      id="audio-chatroom-establishing-audio-connection"
      sx={{
        display: `${isConnecting ? "flex" : "none"}`,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0, 0.8)",
        zIndex: "4",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            marginBottom: "1em",
            color: "#fff",
            fontSize: "1.3em",
            fontWeight: "600",
          }}
        >
          Initializing Connection
        </Box>
        <div className="dot-flashing" />
      </Box>
    </Box>
  );
}
