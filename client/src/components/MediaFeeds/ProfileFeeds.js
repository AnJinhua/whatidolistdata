import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserMedia } from "../../actions/media";
import Feed from "./Feed";
import ProfileMediaModal from "./ProfileMediaModal";
import { ProfileFeedsContainer } from "./styles";
import useSWR from "swr";
import { API_URL } from "../../constants/api";

function ProfileFeeds({ profile }) {
  const dispatch = useDispatch();
  const [viewedMedia, setViewedMedia] = useState(null);
  const sendingMedia = useSelector((state) => state.media.sendingMedia);
  const userSlug = profile?.slug;
  const url = `${API_URL}/media/all/${userSlug}`;
  const { data: userMedia } = useSWR(url);

  const filteredMediaMethodChain = userMedia
    ? userMedia
        .filter((story) => story.userSlug === userSlug)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    : [];

  const memorisedMedia = useMemo(
    () => filteredMediaMethodChain,
    [filteredMediaMethodChain]
  );

  useEffect(() => {
    dispatch(getUserMedia(userSlug));
  }, [userSlug, dispatch]);

  return (
    <ProfileFeedsContainer>
      {sendingMedia?.map((media) => (
        <Feed
          media={media}
          key={media.mediaId}
          setViewedMedia={setViewedMedia}
          sending
        />
      ))}
      {memorisedMedia?.map((media) => (
        <Feed media={media} key={media._id} setViewedMedia={setViewedMedia} />
      ))}
    </ProfileFeedsContainer>
  );
}

export default ProfileFeeds;
