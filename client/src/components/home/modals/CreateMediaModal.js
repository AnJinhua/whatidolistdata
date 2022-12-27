import MediaUpload from "../../MediaFeeds/MediaUpload";
import { CreateModalContainer } from "./styles";

function CreateMediaModal({ openMediaModal, setOpenMediaModal }) {
  const handleClose = () => {
    setOpenMediaModal(false);
  };

  return (
    <CreateModalContainer
      open={openMediaModal}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <MediaUpload home />
    </CreateModalContainer>
  );
}

export default CreateMediaModal;
