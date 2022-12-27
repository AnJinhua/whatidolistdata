import { useState } from "react";
import { useDispatch } from "react-redux";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { BsThreeDots } from "react-icons/bs";
import { IconButton } from "@material-ui/core";
import { useCookies } from "react-cookie";
import { StoryViewerCard } from "./styles";
import { deleteNewStory } from "../../actions/stories";
import { DELETE_STORY } from "../../constants/actions";
import { mutate } from "swr";
import { API_URL } from "../../constants/api";

const StoriesViewerThumbnail = ({ story, setOpenModal }) => {
  const [options, setOptions] = useState(false);
  const dispatch = useDispatch();
  const [{ user }] = useCookies();
  const [{ token }] = useCookies(["token"]);

  const myStories = user?.slug === story?.userSlug;
  const storiesUrl = `${API_URL}/stories/${user?.slug}`;

  const handleDeleteStories = async () => {
    const deletedStoryData = await deleteNewStory(story?._id, token);
    setOpenModal(false);
    // dispatch({ type: DELETE_STORY, payload: deletedStoryData.data });
    mutate(storiesUrl, (story) => {
      const newStory = [...story, deletedStoryData];
      return newStory;
    });
  };

  const handleClickAway = () => {
    if (options === true) {
      setOptions(false);
    }
  };

  const handleClick = () => {
    setOptions((prev) => !prev);
  };

  const renderThumbnail = () => {
    if (story?.storyType === "image" || story?.storyType === "imageText") {
      return <img loading="lazy" src={story?.thumbnail?.cdnUrl} alt="" />;
    } else if (story?.storyType === "text") {
      return <p className="text-thumbnail"> {story?.text} </p>;
    } else if (
      story?.storyType === "video" ||
      story?.storyType === "videoText"
    ) {
      return <img loading="lazy" src={story?.thumbnail?.cdnUrl} alt="" />;
    }
    return null;
  };

  return (
    <StoryViewerCard>
      <div className="viewer-thumbnail">{renderThumbnail()}</div>

      {myStories && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <div className="options">
            <IconButton className="icon-btn">
              <BsThreeDots
                onClick={handleClick}
                className="stories-option-icon"
              />
            </IconButton>
            {options && (
              <div className="option-container">
                <p className="option-text" onClick={handleDeleteStories}>
                  delete
                </p>
              </div>
            )}
          </div>
        </ClickAwayListener>
      )}
    </StoryViewerCard>
  );
};

export default StoriesViewerThumbnail;
