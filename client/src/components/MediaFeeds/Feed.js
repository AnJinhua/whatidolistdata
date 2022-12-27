import { SendingMediaSpinner } from "./styles";
import { useHistory, useLocation } from "react-router-dom";

function Feed({ media, sending }) {
  const history = useHistory();
  const match = useLocation();

  const { pathname } = match;

  const viewMedia = async () => {
    history.push(`${pathname}/media/${media._id}`);
  };

  // gets youtube video id
  function getId(url) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  }

  const videoId = getId(media?.youtubeLink);

  const renderMediaType = () => {
    if (
      media?.mediaType === "image" ||
      media?.mediaType === "imageText" ||
      media?.mediaType === "video" ||
      media?.mediaType === "videoText"
    ) {
      return (
        <>
          {media?.thumbnail.map((file, i) => (
            <img
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              src={file.cdnUrl}
              alt="media"
              key={i}
            />
          ))}
        </>
      );
    } else if (media?.mediaType === "text") {
      return <p className="feed-card-text">{media?.text}</p>;
    } else if (media?.mediaType === "youtube") {
      return (
        <img
          loading="lazy"
          src={`//img.youtube.com/vi/${videoId}/0.jpg`}
          alt="youtube embed"
        />
      );
    }
    return null;
  };

  return (
    <div className="feed-card" onClick={viewMedia}>
      {renderMediaType()}
      {sending && <SendingMediaSpinner />}
    </div>
  );
}

export default Feed;

