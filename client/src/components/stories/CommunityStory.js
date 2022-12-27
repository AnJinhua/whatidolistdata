import {
  CommunityThumbnailContainer,
  StoryBottomText,
  NoStoryContainer,
} from "./styles";
import { useLocation } from "react-router-dom";
import CommunityThumbnailCard from "./CommunityThumbnailCard";
import NoArchive from "../messenger/chatList/NoArchive";
import LoadingBar from "../messenger/chatList/LoadingBar";
import { API_URL } from "../../constants/api";
import useSWR from "swr";

function CommunityStory() {
  const match = useLocation();
  const community = match.pathname.split("/")[2];
  const url = `${API_URL}/stories/community/${community}`;
  const { data: communityStories, error } = useSWR(url);

  if (!communityStories && !error) {
    return <LoadingBar />;
  }

  return communityStories.length === 0 ? (
    <NoStoryContainer>
      <NoArchive
        src="https://donnysliststory.sfo3.cdn.digitaloceanspaces.com/story/1654110513082__b4cd5b1d-a4ce-4c26-bde7-27ae13ea2f13__undraw_into_the_night_vumi.png"
        bottomLine="there are no stories posted"
      />
      <StoryBottomText>
        stories expire after 48 hours. post stories from your profile page.
      </StoryBottomText>
    </NoStoryContainer>
  ) : (
    <CommunityThumbnailContainer>
      {communityStories
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
        .map((story) => (
          <CommunityThumbnailCard story={story} key={story._id} />
        ))}
    </CommunityThumbnailContainer>
  );
}

export default CommunityStory;
