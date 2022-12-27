import { CgCloseR } from "react-icons/cg";
import { IconButton } from "@material-ui/core";

function ImagePreview({ file, removeFile, home }) {
  const fileUrl = window.URL.createObjectURL(file);

  return (
    <div className="image-preview-container">
      <img
        loading="lazy"
        className={!home ? "image-preview" : "home-preview"}
        src={fileUrl}
        alt=""
      />
      <IconButton onClick={removeFile} className="icon-btn">
        <CgCloseR className="image-preview-icon" />
      </IconButton>
    </div>
  );
}

export default ImagePreview;
