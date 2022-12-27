import { memo } from "react";
import StoriesThumbnail from "./StoriesThumbnail";
import { ThumbnailContainer } from "./styles";

import { useCookies } from "react-cookie";
import useSWR from "swr";
import { API_URL } from "../../constants/api";
import { useSelector } from "react-redux";

function StoriesThumbs({ userSlug, profile }) {
  const sendingStory = useSelector((state) => state.stories.sendingStories);
  const [{ user }] = useCookies(["user"]);
  const url = `${API_URL}/stories/${userSlug}`;
  const { data: userStories } = useSWR(url);

  return (
    <ThumbnailContainer>
      {sendingStory?.map((story, i) => (
        <StoriesThumbnail
          key={story.storyId}
          index={i}
          story={story}
          userSlug={userSlug}
          sending
        />
      ))}
      {userStories
        ?.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
        .map((story, i) => (
          <StoriesThumbnail
            key={story._id}
            index={i}
            story={story}
            userSlug={userSlug}
          />
        ))}
    </ThumbnailContainer>
  );
}

export default memo(StoriesThumbs);
