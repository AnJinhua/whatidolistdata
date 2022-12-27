import MediaImagePreview from "./MediaImagePreview";
import MediaTextPreview from "./MediaTextPreview";
import MediaVideoPreview from "./MediaVideoPreview";
import YoutubePreview from "./YoutubePreview";

function ContentPreview({ viewedMedia }) {
  const renderMediaContent = () => {
    if (
      viewedMedia?.mediaType === "image" ||
      viewedMedia?.mediaType === "imageText"
    ) {
      return <MediaImagePreview viewedMedia={viewedMedia} />;
    } else if (viewedMedia?.mediaType === "text") {
      return <MediaTextPreview text={viewedMedia?.text} />;
    } else if (
      viewedMedia?.mediaType === "video" ||
      viewedMedia?.mediaType === "videoText"
    ) {
      return <MediaVideoPreview viewedMedia={viewedMedia} />;
    } else if (viewedMedia?.mediaType === "youtube") {
      return <YoutubePreview viewedMedia={viewedMedia} />;
    }
    return null;
  };

  return (
    <div className="content-preview-container">{renderMediaContent()}</div>
  );
}

export default ContentPreview;
