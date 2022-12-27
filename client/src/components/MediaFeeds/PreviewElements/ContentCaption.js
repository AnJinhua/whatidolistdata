import CaptionHeader from "./captions/CaptionHeader";
import CaptionBody from "./captions/CaptionBody";
import CaptionFooter from "./captions/CaptionFooter";
import { useState } from "react";

function ContentCaption({ viewedMedia, handleClose }) {
  const [sendingMediaComment, setSendingMediaComment] = useState([]);
  return (
    <div className="content-caption-continer">
      <CaptionHeader viewedMedia={viewedMedia} handleClose={handleClose} />
      <CaptionBody
        viewedMedia={viewedMedia}
        sendingMediaComment={sendingMediaComment}
      />
      <CaptionFooter
        viewedMedia={viewedMedia}
        setSendingMediaComment={setSendingMediaComment}
      />
    </div>
  );
}

export default ContentCaption;
