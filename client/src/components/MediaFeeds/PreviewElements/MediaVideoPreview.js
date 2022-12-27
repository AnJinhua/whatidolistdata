import React from "react";

function MediaVideoPreview({ viewedMedia }) {
  return (
    <video
      src={viewedMedia?.file[0]?.cdnUrl}
      controls
      type="video/mp4"
      loading="eagar"
      autoPlay
      autoload="metadata"
      poster={viewedMedia?.thumbnail[0]?.cdnUrl}
      className="media"
    />
  );
}

export default MediaVideoPreview;
