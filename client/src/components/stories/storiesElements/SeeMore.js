import { SeeMoreCase } from "../styles";
import { IoIosArrowUp } from "react-icons/io";

const SeeMore = ({ toggleMore, story, cookies, profile }) => {
  return (
    <SeeMoreCase onClick={toggleMore}>
      {story.storyType === ("imageText" || "videoText") && (
        <div className="story-text-container">
          <p className="small-story-text">{story?.text}</p>
          <p className="xs-story-text">see more</p>
        </div>
      )}

      {cookies?.user?.slug !== profile?.slug && (
        <div className="engage-story-container">
          <div className="col">
            <IoIosArrowUp className="icon" />

            <p className="xs-story-text">reply</p>
          </div>
        </div>
      )}
    </SeeMoreCase>
  );
};

export default SeeMore;
