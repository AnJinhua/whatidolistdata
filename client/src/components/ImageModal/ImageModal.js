import React, { useState } from "react";
import {
  IMAGE_CHANGE,
  IMAGE_UPDATE_REQUEST,
  IMAGE_UPDATE_FAIL,
} from "../../constants/actions";
import { uploadPhoto, deletePhoto } from "../../actions/user";
import { Modal, Button } from "react-bootstrap";
import Close from "../../assets/close.svg";
import Trash from "../../assets/trash.svg";
import Placeholder from "../../assets/profile-img.png";
import { toast } from "react-toastify";
import Camera from "../../assets/camera.svg";
import { useSelector, useDispatch } from "react-redux";
import "./ImageModal.css";
import { profileUploadS3 } from "../../actions/user";
import { useCookies } from "react-cookie";
import { deleteMediaFile } from "../../actions/media";
const ImageModal = () => {
  const dispatch = useDispatch();
  const [fileInput, setFileInput] = useState();
  const [image, setImage] = useState();
  const [del, setDele] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [{ token }] = useCookies(["user"]);

  const user = useSelector((state) => state.user.profile);
  const { imageLoading } = useSelector((state) => state.user);
  const show = useSelector((state) => state.imageModal.show);

  const handleSave = async () => {
    if (del) {
      const imageData = {
        key: user?.imageUrl?.key,
        user_email: user?.email,
      };
      dispatch({ type: IMAGE_UPDATE_REQUEST });
      dispatch(deletePhoto(imageData));
    } else {
      try {
        const imageDta = new FormData();
        imageDta.append("file", imgFile);
        dispatch({ type: IMAGE_UPDATE_REQUEST });
        try {
          deleteMediaFile("profile", user?.imageUrl?.key);
          const { data } = await profileUploadS3(imageDta, token);

          const imageData = {
            key: data.key,
            location: data.location,
            cdnUrl: data.cdnUrl,
            user_email: user?.email,
          };

          dispatch(uploadPhoto(imageData));
        } catch (error) {
          dispatch({
            type: IMAGE_UPDATE_FAIL,
          });
          console.log(error);
          toast.error("error while updating ", {
            position: "top-center",
            theme: "dark",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (err) {
        dispatch({
          type: IMAGE_UPDATE_FAIL,
        });
        console.log(err);
        toast.error("error while updating", {
          position: "top-center",
          theme: "dark",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const triggerFileUpload = () => {
    fileInput.click();
  };

  const handelDelete = () => {
    setDele(true);
    setImgFile(Placeholder);
    setImage(Placeholder);
  };

  const onChangeImage = (e) => {
    //set delete to false
    setDele(false);

    //set image to be updated
    const file = e.target.files[0];
    setImgFile(file);

    //set preview image
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    try {
      reader.onloadend = async () => {
        setImage(reader.result);
      };
    } catch (e) {
      alert("image upload failed");
      console.log(e);
    }
  };

  const handleClose = () => {
    dispatch({
      type: IMAGE_CHANGE,
      payload: false,
    });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title"
    >
      <Modal.Header>
        <div className="modal-header-row">
          <Modal.Title>Profile photo</Modal.Title>
          <img loading="lazy" src={Close} alt="close" onClick={handleClose} />
        </div>
      </Modal.Header>
      <Modal.Body>
        {" "}
        {image ? (
          <img
            loading="lazy"
            src={image}
            alt=""
            width="200"
            height="200"
            style={{
              height: "100%",
              width: "100%",
              maxWidth: "200px",
              maxHeight: "200px",
              borderRadius: "50%",
              objectFit: "contain",
            }}
          />
        ) : (
          <img
            loading="lazy"
            width="200"
            height="200"
            style={{
              height: "100%",
              width: "100%",
              maxWidth: "200px",
              maxHeight: "200px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src={user?.imageUrl ? user?.imageUrl?.cdnUrl : "/img/profile.png"}
            alt="profile"
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="modal-footer-row">
          <div className="modal-icon-left">
            <div className="modal-option-icon" onClick={triggerFileUpload}>
              <input
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: "none" }}
                ref={(fileInput1) => setFileInput(fileInput1)}
                name="image"
                onChange={onChangeImage}
              />
              <img loading="lazy" src={Camera} alt="change image" />
              <div className="modal-icon-text">Add photo</div>
            </div>
            <div className="modal-option-icon" onClick={handelDelete}>
              <img loading="lazy" src={Trash} alt="delete" />
              <div className="modal-icon-text">Delete</div>
            </div>
          </div>
          <div className="modal-btn-spinner">
            {imageLoading && (
              <img
                loading="lazy"
                width="50"
                className="loader-center"
                src="/img/spinner.svg"
                alt="loader"
              />
            )}
            <Button disabled={imageLoading} onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageModal;
