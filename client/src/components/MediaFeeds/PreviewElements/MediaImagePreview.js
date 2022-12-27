import React from "react";

function MediaImagePreview({ viewedMedia }) {
  return (
    <div className="text-container">
      <img
        src={viewedMedia?.thumbnail[0]?.cdnUrl}
        loading="eagar"
        alt=""
        className="media"
      />
    </div>
  );
}

export default MediaImagePreview;
