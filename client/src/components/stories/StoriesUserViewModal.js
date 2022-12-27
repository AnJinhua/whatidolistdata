import { StoryUserModal } from "./styles";
import { GrClose } from "react-icons/gr";
import { IconButton } from "@material-ui/core";
import StoryViewer from "./StoryViewer";
import StoriesViewerThumbnail from "./StoriesViewerThumbnail";

function StoriesUserViewModal({ openModal, setOpenModal, views, story }) {
  //remove null values from views array
  const viewsArray = views?.filter((view) => view !== null);
  return (
    <StoryUserModal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className="user-modal-container">
        <div className="view-top-container">
          <StoriesViewerThumbnail story={story} setOpenModal={setOpenModal} />
          <p className="text-md">views</p>
          <IconButton className="iconBtn" onClick={() => setOpenModal(false)}>
            <GrClose className="con" />
          </IconButton>
        </div>

        <div className="story-viewers-container">
          {viewsArray?.map((view) => (
            <StoryViewer userSlug={view} key={view} />
          ))}
        </div>
      </div>
    </StoryUserModal>
  );
}

export default StoriesUserViewModal;
