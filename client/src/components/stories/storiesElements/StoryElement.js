import { WithSeeMore } from "react-insta-stories";
import { StoryCase, StoryImg, StoryText } from "../styles";
function StoryElement({ story, action, storie }) {
  return (
    <WithSeeMore story={story} action={action}>
      <StoryCase>
        <div className="story-case-container">
          {storie.storyType === "imageText" && (
            <StoryImg loading="lazy" src={storie?.thumbnail?.cdnUrl} alt="" />
          )}
          {storie.storyType === "image" && (
            <StoryImg loading="lazy" src={storie?.thumbnail?.cdnUrl} alt="" />
          )}

          {storie.storyType === "text" && <StoryText>{storie?.text}</StoryText>}
        </div>
      </StoryCase>
    </WithSeeMore>
  );
}

export default StoryElement;
