import { RiDragDropLine } from "react-icons/ri";

function DropZone({ handleDefaultVideofile, handleNewImageUpload }) {
  const onFileChange = async (e) => {
    let file = e.target.files[0];
    if (file?.["type"].split("/")[0] === "video") {
      handleDefaultVideofile(e);
    }
    if (file?.["type"].split("/")[0] === "image") {
      handleNewImageUpload(e);
    }
  };
  return (
    <div className="drop-zone-container">
      <RiDragDropLine className="drop-zone-icon" />
      <p className="upload-btn-text">drag or select what you do</p>
      <input
        type="file"
        className="drop-input"
        accept="video/* image/*"
        onChange={(e) => onFileChange(e)}
      />
    </div>
  );
}

export default DropZone;
