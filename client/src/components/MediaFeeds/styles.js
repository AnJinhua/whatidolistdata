import styled from "styled-components";
import { Modal, CircularProgress } from "@material-ui/core";

export const MediaFeedsContainer = styled.div`
  display: grid;
  grid-gap: 2rem;
  padding: 1rem;
`;
export const VideoEditorCotainer = styled.div`
  width: 100%;
  margin: 1rem 0;
  position: relative;
  height: ${({ home }) => (home ? "10rem" : "20rem")};

  .image-capture-icon {
    height: 2rem;
    width: 2rem;
    color: #ffffff;
    flex-shrink: 0;
    cursor: pointer;
  }

  .capture-icon-btn {
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
  }

  .duration-text {
    font-size: 1.4rem;
    font-weight: 400;
    color: #fff;
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
  }

  .video {
    width: 100%;
    cursor: pointer;
    border-radius: 1em;
    object-fit: cover;
    height: 100%;
  }
`;

export const ViewMediaModal = styled(Modal)`
  width: 100vw;
  min-height: 100vh;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  @media not all and (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) {
      min-height: -webkit-fill-available !important;
    }
  }

  .modal-body {
    height: 100%;
    width: 100%;
    background: white;
    border-radius: 0.5rem;
  }

  .media-content {
    width: 100%;
    height: 100%;
  }

  .content-preview-container {
    width: 100%;
    height: 40%;
    background: #212120;
    overflow: hidden;
  }

  .content-caption-continer {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 60%;
    overflow: hidden;
  }

  .media {
    width: 100%;
    object-fit: contain;
    height: 100%;
  }

  .text-container {
    height: 100%;
    width: 100%;
    background: #262626;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .media-text {
    font-size: 3rem;
    font-weight: 400;
    margin: 0 !important;
    color: #ffffff;
    text-align: center;
    padding: 1rem;
    margin: 0 auto;
    word-break: break-word;
    background: #262626;
  }

  .close-icon-btn {
    position: absolute;
    height: 3rem;
    width: 3rem;
    color: #dc2626;
    flex-shrink: 0;
    cursor: pointer;
    right: 1rem;
    top: 1rem;
    z-index: 1;
  }

  @media screen and (min-width: 639px) {
    .modal-body {
      height: 85%;
      width: 80vw;
    }
  }
  @media screen and (min-width: 767px) {
    .media-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 1rem;
    }

    .content-preview-container {
      height: 100%;
    }
    .content-caption-continer {
      height: 100%;
    }

    .close-icon-btn {
      display: none;
    }
  }
  /* @media screen and (min-width: 1023px) {
  } */
`;
export const SendingMediaSpinner = styled(CircularProgress)`
  && {
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: white;
    height: 1rem !important;
    width: 1rem !important;
  }
`;

export const ProfileFeedsContainer = styled.div`
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
  margin: 1rem 0;

  .feed-card {
    width: 100%;
    height: 20rem;
    background: #262626;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media screen and (min-width: 639px) {
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    grid-gap: 1.5rem;

    .feed-card {
      height: 25rem;
    }
  }
  @media screen and (min-width: 767px) {
    grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));

    .feed-card {
      height: 30rem;
    }

    .feed-card-text {
      font-size: 3rem;
      color: #ffffff;
      font-weight: 400;
      text-align: center;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-width: 90%;
    }
  }
  @media screen and (min-width: 1023px) {
    grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
    grid-gap: 1rem;

    .feed-card-text {
      font-size: 3rem;
      color: #ffffff;
      font-weight: 400;
      text-align: center;
      display: -webkit-box;
      -webkit-line-clamp: 6;
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-width: 90%;
    }

    .feed-card {
      height: 30rem;
    }
  }

  .feed_card_image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .feed-card-text {
    font-size: 3rem;
    color: #ffffff;
    font-weight: 400;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 90%;
  }
`;

export const MediaUploadContainer = styled.div`
  background: #ffffff;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-width: 68rem;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;

  .thumbnail-container {
    height: 6rem;
    width: 10rem;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .warning {
    padding: 0.8em;
    color: #da7f00;
    background-color: #ffecd1;
    border-radius: 0.3em;
    border: 0.1em solid #f0ad4e;
    margin: 1em;
    justify-content: center;
    text-align: center;
  }

  .youtube-area {
    width: 100%;
    height: 5rem;
    border-radius: 0.25rem;
    border: 1px solid #e5e7eb;
    padding: 1rem;
    resize: none;

    &:focus {
      outline: none;
    }
  }

  .drop-zone-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    border: 1px dashed #78716c;
    flex-direction: column;
    border-radius: 1rem;
    position: relative;
    cursor: pointer;
  }

  .drop-input {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 999px;
    opacity: 0;
    cursor: pointer;
  }

  .image-preview {
    width: 100%;
    height: 20rem;
    border-radius: 0.25rem;
    object-fit: cover;
  }
  .home-preview {
    width: 100%;
    height: 10rem;
    border-radius: 0.25rem;
    object-fit: cover;
  }
  .image-preview-container {
    position: relative;
    width: 100%;
    margin: 1px 0;
  }
  .icon-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }

  .image-preview-icon {
    height: 2rem;
    width: 2rem;
    color: #dc2626;
    flex-shrink: 0;
    cursor: pointer;
  }

  .flex-center {
    display: flex;
    align-items: center;
  }

  .top-upload-container {
    padding: 1rem;
  }
  .bottom-upload-container {
    justify-content: space-between;
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 0.5rem;
  }

  .btn-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    margin-top: 1rem;
    margin-bottom: 10px;
  }

  .btn {
    width: 100%;
    height: 3.5rem;
    border-radius: 0.25rem;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    cursor: pointer;
    font-size: 1.4rem;
    font-weight: 600;
    color: #78716c;
    transition: all 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #e5e7eb;
    }

    &:focus {
      outline: none;
    }
  }
  .upload-btn {
    padding: 1rem;
    margin: 0 !important;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .upload-btn-text {
    font-size: 1.4rem;
    margin: 0 !important;
    font-weight: 600;
  }
  .icon {
    margin-right: 0.5rem;
    height: 2rem;
    width: 2rem;
    flex-shrink: 0;
  }
  .drop-zone-icon {
    height: 4rem;
    width: 4rem;
    flex-shrink: 0;
    color: #78716c;
  }

  .image {
    color: #ea580c;
  }

  .video {
    color: #16a34a;
  }
  .youtube {
    color: #dc2626;
  }
`;

export const MediaTextArea = styled.textarea`
  width: 100%;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 2rem;
  padding: 10px;
  box-sizing: border-box;
  resize: none;
  outline: none;
  font-size: 14px;
  font-family: "Roboto", sans-serif;
  color: #4a4a4a;
  overflow: hidden;
  background-color: #ebe9e1;
`;

export const MediaDisplayContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-gap: 6rem;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  place-items: center;
  padding: 1rem 3.1rem;
`;

export const ImageCardDesign = styled.div`
  cursor: zoom-in;
  .image-border {
    border-radius: 15px;
  }
`;

export const ModalContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 85vh;
  width: 75vw;
  margin-bottom: 5rem;

  @media only screen and (max-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 55vh;
    width: 100%;
    margin-bottom: 5rem;
  }

  @media only screen and (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 60vh;
    width: 100%;
    margin-bottom: 5rem;
  }

  @media only screen and (max-width: 425) {
    display: flex;
    flex-direction: column;
    height: 60vh;
    width: 100%;
    margin-bottom: 5rem;
  }
`;

export const ModalLeftContainer = styled.div`
  .modal-img {
    height: 85vh;
    width: 100%;
    object-fit: fill;
  }

  .modal-video {
    height: 85vh;
    width: 100%;
    margin-bottom: 3rem;
    object-fit: fill;
  }

  @media only screen and (max-width: 768px) {
    height: 100%;
    width: 100%;
    object-fit: fill;
  }

  @media only screen and (max-width: 600px) {
    .modal-left {
      height: 50vh;
      width: 100%;
      margin-top: 5rem;
    }
  }
`;

export const MediaVideo = styled.video`
  height: 85vh;
  width: 100%;
  object-fit: fill;
`;

export const ModalRightContainer = styled.div`
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  padding: 1rem;
  /* margin: 1rem 0; */
  line-height: 1.7;
  font-family: -apple-system, "Arial", "sana-serif";

  .profile-caption {
    display: flex;
    margin: 0.5rem 0 !important;
    /* align-items: center; */
  }

  .modal-text-p {
    display: flex;
    font-size: normal;
    margin: 0rem !important;
    /* align-items: center; */
    /* padding: 10px; */
  }

  .modal-text-caption {
    font-style: normal;
  }

  .modal-comments {
    display: flex;
  }

  .modal-text-comments {
    display: flex;
    flex-direction: column;
    padding: 1rem 0;
    height: 70vh;
    overflow-y: scroll;

    line-height: 2;
    border-top: 1px solid #ededed;
    border-bottom: 1px solid #ededed;

    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .modal-text-comments::-webkit-scrollbar {
    display: none;
  }

  .modal-react-section {
    display: flex;
    flex-direction: column;
    padding: 0 5px;
    font-size: small;
  }

  .modal-react-btns {
    display: flex;
    justify-content: space-between;
    padding-bottom: 1rem;
    align-items: center;
  }

  .modal-text-emoji {
    display: flex;
    justify-content: space-between;
    padding-bottom: 1rem;
    align-items: center;
  }

  .modal-text-likes {
    display: flex;
    justify-content: space-evenly;
    margin-top: 5px;
    align-items: center;
  }

  .modal-text-like {
    margin-right: 10px;
  }

  .modal-text-input {
    height: 40px;
    width: 100%;
    display: flex;
    border: none;
    padding: 10px;
    box-sizing: border-box;
    resize: none;
    outline: none;
    border: none;
    font-size: 15px;
    color: gray;
    font-family: "Roboto", sans-serif;
    overflow: hidden;
  }

  .modal-text-post {
    display: flex;
    border: none;
  }

  .modal-text-post > button {
    border: none;
    background: none;
    font-weight: bold;
    color: #becdf7;
  }

  .mediaIcon {
    height: 2.6rem;
    width: 2.6rem;
    color: #78716c;
    cursor: pointer;
    flex-shrink: 0;
  }

  .mediaIconBtn {
    height: max-content;
    cursor: pointer;
    padding: 0.75rem;
  }

  @media only screen and (max-width: 425px) {
    height: 50vh;
    width: 100%;
  }

  /* @media only screen and (max-width: 768px) {
    border-style: ridge;
    border-top: none;

    .modal-text-comments {
      height: 10vh;
      width: 100%;
    }
  } */
`;
