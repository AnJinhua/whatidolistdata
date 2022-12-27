import { PreviewImage, PreviewImageContaner } from "./styles";
import { RiCloseCircleLine } from "react-icons/ri";
import { BiAddToQueue } from "react-icons/bi";
import { VscCloseAll } from "react-icons/vsc";
import { memo } from "react";

function Imageprevew({ imageFile, setImageFile, handleImgBtnClick }) {
  const removeFile = (img) => {
    const filteredFile = imageFile.filter(({ cdnUrl }) => cdnUrl !== img);
    setImageFile(filteredFile);
  };

  return (
    <PreviewImageContaner>
      {imageFile.map(({ cdnUrl }, i) => (
        <div className="image_case" key={cdnUrl}>
          <PreviewImage src={cdnUrl} />
          <RiCloseCircleLine
            className="close_icon one_icon"
            onClick={() => removeFile(cdnUrl)}
          />
        </div>
      ))}
      {imageFile.length > 0 && (
        <BiAddToQueue className="add_one_icon" onClick={handleImgBtnClick} />
      )}
      {imageFile.length > 1 && (
        <VscCloseAll
          className="close_icon all_icon"
          onClick={() => setImageFile([])}
        />
      )}
    </PreviewImageContaner>
  );
}

export default memo(Imageprevew);
