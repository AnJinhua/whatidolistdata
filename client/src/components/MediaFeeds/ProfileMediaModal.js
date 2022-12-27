import { CgCloseR } from "react-icons/cg";
import { ViewMediaModal } from "./styles";
import ContentPreview from "./PreviewElements/ContentPreview";
import ContentCaption from "./PreviewElements/ContentCaption";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { API_URL } from "../../constants/api";
import useSWR from "swr";

function ProfileMediaModal() {
  const [openMediaModal, setOpenMediaModal] = useState(false);
  const match = useLocation();
  const history = useHistory();
  const { pathname, state } = match;
  const path = pathname.split("/");
  const onMedia = state?.media || path[path.length - 2] === "media";
  const mediaId = state?.mediaId ? state?.mediaId : path[path.length - 1];

  const mediaApiUrl = `${API_URL}/media/fetch/${mediaId}`;
  const { data: mediaPost } = useSWR(mediaApiUrl);

  useEffect(() => {
    if (onMedia) {
      setOpenMediaModal(true);
    } else {
      setOpenMediaModal(false);
    }
  }, [onMedia]);

  const handleClose = () => {
    history.goBack();
    setOpenMediaModal(false);
  };

  return (
    <ViewMediaModal
      open={openMediaModal}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className="modal-body">
        <div className="media-content">
          <ContentPreview viewedMedia={mediaPost} />
          <ContentCaption viewedMedia={mediaPost} handleClose={handleClose} />
        </div>

        <CgCloseR className="close-icon-btn" onClick={handleClose} />
      </div>
    </ViewMediaModal>
  );
}

export default ProfileMediaModal;
