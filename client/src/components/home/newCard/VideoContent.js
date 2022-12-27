import useSWR from "swr";
import { API_URL } from "../../../constants/api";
import VideoCard from "./VideoCard";
import { ContentContainer } from "./styles";
import { useSelector } from "react-redux";
import { useState } from "react";
import { element } from "prop-types";

const VideoContent = () => {
  const user = useSelector((state) => state.user.profile);
  const [currentPlaying, setCurrentPlaying] = useState(null);

  const mediaUrl = user?.slug
    ? `${API_URL}/feed/for-you/${user?.slug}?page=0`
    : `${API_URL}/feed/for-you?page=0`;
  const { data: VideoContents } = useSWR(mediaUrl);
  console.log(VideoContents);
  return (
    <ContentContainer>
      {/* <div className="scroll-view-container"> */}

      {VideoContents?.map(
        ({
          _id,
          file,
          mediaId,
          userSlug,
          thumbnail,
          inspired,
          shares,
          mediaType,
          text,
        }) => {
          if (mediaId && file) {
            return (
              <VideoCard
                key={mediaId}
                videoUrl={file[0]?.cdnUrl}
                thumbnail={thumbnail[0]?.cdnUrl}
                userSlug={userSlug}
                inspired={inspired}
                id={_id}
                shares={shares}
                mediaType={mediaType}
                text={text}
              />
            );
          }
        }
      )}
    </ContentContainer>
  );
};

export default VideoContent;
