import { Thumbnail, SendingStorySpinner } from "./styles";
import StoriesUserViewModal from "./StoriesUserViewModal";
import { useState } from "react";
import ViewsElement from "./storiesElements/ViewsElement";
import { useHistory } from "react-router-dom";

function StoriesThumbnail({ story, index, sending }) {
  const [openModal, setOpenModal] = useState(false);
  const history = useHistory();

  const handleThumbnailClick = () => {
    history.push(`/profile/story/${story.userSlug}?index=${index}`);
  };

  const renderThumbnal = () => {
    if (
      story?.storyType === "image" ||
      story?.storyType === "imageText" ||
      story.storyType === "video" ||
      story.storyType === "videoText"
    ) {
      return (
        <img
          loading="lazy"
          onClick={handleThumbnailClick}
          src={story?.thumbnail?.cdnUrl}
          alt=""
        />
      );
    } else if (story?.storyType === "text") {
      return (
        <p className="text-thumbnail" onClick={handleThumbnailClick}>
          {" "}
          {story?.text}{" "}
        </p>
      );
    }
    return null;
  };
  return (
    <Thumbnail>
      <div className="story-thumbnail">{renderThumbnal()}</div>
      {sending ? (
        <SendingStorySpinner />
      ) : (
        <ViewsElement setOpenModal={setOpenModal} story={story} />
      )}

      {/* thumbnail modal goes here */}
      <StoriesUserViewModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        views={story?.views}
        story={story}
      />
    </Thumbnail>
  );
}

export default StoriesThumbnail;
