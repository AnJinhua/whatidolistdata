import { NavLink } from "react-router-dom";
import { LgContainer } from "../components/messenger/gen.styles";
import CommunityStory from "../components/stories/CommunityStory";

function CommunityStories() {
  return (
    <LgContainer>
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <NavLink to="/">home</NavLink>
        </li>
        <li className="breadcrumb-item">community stories</li>
      </ol>
      <CommunityStory />
    </LgContainer>
  );
}

export default CommunityStories;
