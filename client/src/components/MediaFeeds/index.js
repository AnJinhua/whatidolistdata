import { MediaFeedsContainer } from "./styles";
import { memo } from "react";
import MediaUpload from "./MediaUpload";
import ProfileFeeds from "./ProfileFeeds";

function MediaFeeds({ profile }) {
  return (
    <MediaFeedsContainer>
      <MediaUpload />
      <ProfileFeeds profile={profile} />
    </MediaFeedsContainer>
  );
}

export default memo(MediaFeeds);
