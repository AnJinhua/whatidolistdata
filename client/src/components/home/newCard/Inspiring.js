import useSWR from "swr";
import { API_URL } from "../../../constants/api";
import VideoCard from "./VideoCard";
import { ContentContainer } from "./styles";

function Inspiring() {
  const mediaUrl = `${API_URL}/feed/inspiring?page=0`;
  const { data: VideoContents } = useSWR(mediaUrl);

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
      )}
    </ContentContainer>
  );
}

export default Inspiring;
