import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { API_URL } from "../../constants/api";
import useSWR, { mutate } from "swr";

const CommunityThumbnailCard = ({ story }) => {
  const storyUserUrl = `${API_URL}/getExpertDetail/${story?.userSlug}`;
  const storyUrl = `${API_URL}/stories/story/${story?._id}`;
  const { data: storyUserRequest } = useSWR(storyUserUrl);
  const storyUser = storyUserRequest?.data;
  const history = useHistory();

  // console.log("story", story);

  const viewStory = () => {
    history.push({
      pathname: `/community-stories/${story?.community}/${story?._id}`,
    });

    mutate(storyUrl, story);
  };

  const handleThumbnailClick = () => {
    viewStory();
  };

  const renderStoryType = () => {
    if (
      story.storyType === "image" ||
      story.storyType === "imageText" ||
      story.storyType === "video" ||
      story.storyType === "videoText"
    ) {
      return (
        <img
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "1rem",
          }}
          src={story?.thumbnail?.cdnUrl}
          alt="profile"
        />
      );
    } else if (story.storyType === "text") {
      return <p className="story-card-text">{story.text}</p>;
    }
  };
  return (
    <div className="thumbnail-card" onClick={handleThumbnailClick}>
      {renderStoryType()}
      <img
        loading="lazy"
        className="story_card_avatar"
        src={
          storyUser?.imageUrl ? storyUser?.imageUrl?.cdnUrl : "/img/profile.png"
        }
        alt="profile"
      />
    </div>
  );
};

export default CommunityThumbnailCard;
