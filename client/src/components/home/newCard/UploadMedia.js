import MediaUpload from "../../MediaFeeds/MediaUpload";
import { UploaderContainer } from "./styles";

function UploadMedia() {
  return (
    <UploaderContainer>
      <MediaUpload home />
    </UploaderContainer>
  );
}

export default UploadMedia;
