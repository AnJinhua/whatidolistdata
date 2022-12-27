import ZoomImage from "./ZoomImage";
import { ZoomContainer, ZoomBottomText, ZoomBottomButton } from "./styles";
import { useLocation } from "react-router-dom";

function ZoomMeeting() {
  const match = useLocation();
  const path = match.pathname.split("/");
  const newPath = path.slice(2).join("/");

  const openZoom = () => {
    window.open(`https://${newPath}`, "_blank");
  };

  return (
    <ZoomContainer>
      <ZoomImage
        src="/img/join-meeting.svg"
        bottomLine="zoom meeting started"
      />
      {path[2] === "us05web.zoom.us" ? (
        <ZoomBottomButton onClick={openZoom}>join meeting</ZoomBottomButton>
      ) : (
        <ZoomBottomText>invalid meeting url</ZoomBottomText>
      )}
    </ZoomContainer>
  );
}

export default ZoomMeeting;
