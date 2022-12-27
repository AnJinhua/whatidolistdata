import { NavLink } from "react-router-dom";
import { LgContainer } from "../components/zoom/styles";
import ZoomMeeting from "../components/zoom/ZoomMeeting";

function ZoomPage() {
  return (
    <LgContainer>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <NavLink to="/">home</NavLink>
        </li>
        <li className="breadcrumb-item">zoom meeting</li>
      </ol>
      <ZoomMeeting />
    </LgContainer>
  );
}

export default ZoomPage;
