import StoriesThumbs from "./StoriesThumbs";
import { useCookies } from "react-cookie";
import { ProfileThumbnailContainer } from "./styles";
import AddStoriesBtn from "./AddStoriesBtn";
import AddStoriesModal from "./AddStoriesModal";

function ProfileStories({ profile }) {
  const [{ user }] = useCookies(["user"]);

  return (
    <ProfileThumbnailContainer>
      <AddStoriesModal />
      <AddStoriesBtn />
      <StoriesThumbs userSlug={user?.slug} profile={profile} />
    </ProfileThumbnailContainer>
  );
}

export default ProfileStories;
