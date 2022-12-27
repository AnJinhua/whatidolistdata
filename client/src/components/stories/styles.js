import styled from "styled-components";
import { Modal, CircularProgress } from "@material-ui/core";

export const BlueBtn = styled.div`
  padding: 0.5rem 1rem;
  margin: 0 !important;
  background-color: #337ab7;
  border-radius: 0.5rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  p {
    font-size: 1.2rem;
    margin: 0 !important;
    font-weight: 400;
    color: #ffffff;
  }
`;

export const SendingStorySpinner = styled(CircularProgress)`
  && {
    margin-top: 0.5rem;
    color: #780206; /* fallback for old browsers */
    color: -webkit-linear-gradient(
      to right,
      #061161,
      #780206
    ); /* Chrome 10-25, Safari 5.1-6 */
    color: linear-gradient(to right, #061161, #780206);
    height: 8px !important;
    width: 8px !important;
  }
`;

export const VideoEditorCotainer = styled.div`
  .noUi-connect {
    background: var(--primary-color);
  }

  .icon-options-container {
    border-radius: 0.25rem;
    border: 1px solid #e5e7eb;
    padding: 0.5rem;
    box-sizing: border-box;
    width: 100%;
    margin: 1rem 0;
    display: flex;
    align-items: center;
  }

  .playback-icon-container {
    margin: 0 1rem 0 2.5rem;
    width: 100%;
  }

  .icon-option-btn {
    height: max-content;
    cursor: pointer;
    padding: 0.55rem;
  }

  .option-icon {
    height: 1.6rem;
    width: 1.6rem;
    color: #78716c;
    flex-shrink: 0;
  }

  .video-preview-container {
    width: 100%;
    margin: 1rem 0;
    position: relative;
  }

  .trimmer-timeline {
    margin: 1rem 0;
    padding: 0.5rem 2rem;
  }

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
`;

export const AddStrories = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: center;
  margin-right: 2rem;

  .AddBulb {
    width: 7rem;
    height: 7rem;
    border-radius: 50%;
    cursor: pointer;
    background: #780206; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      #061161,
      #780206
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      #061161,
      #780206
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  .small-text {
    font-size: 1.4rem;
    margin: 0 !important;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
  }
`;

export const ThumbnailContainer = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 100%;
`;

export const ProfileThumbnailContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const NoStoryContainer = styled.div`
  display: grid;
  padding-top: 25px;
`;

export const CommunityThumbnailContainer = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  margin: 0.25rem 0;

  .thumbnail-card {
    width: 100%;
    height: 30rem;
    border-radius: 1rem;
    background: #262626;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .story_card_image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .story-card-text {
    font-size: 2.4rem;
    color: #ffffff;
    font-weight: 400;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 90%;
  }
  .story_card_avatar {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    height: 5rem;
    width: 5rem;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #780206; /* fallback for old browsers */
    border: 2px solid -webkit-linear-gradient(to right, #061161, #780206); /* Chrome 10-25, Safari 5.1-6 */
    border: 2px solid linear-gradient(to right, #061161, #780206); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
`;

export const Thumbnail = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-right: 1.5rem;

  .story-thumbnail {
    height: 7rem;
    width: 7rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    overflow: hidden !important;
    align-items: center;
    justify-content: center;
    background: #262626;
    border: 2px solid #780206; /* fallback for old browsers */
    border: 2px solid -webkit-linear-gradient(to right, #061161, #780206); /* Chrome 10-25, Safari 5.1-6 */
    border: 2px solid linear-gradient(to right, #061161, #780206); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  .text-thumbnail {
    font-size: 0.8rem;
    margin: 0 !important;
    font-weight: 200;
    color: #ffffff;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 90%;
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .small-text {
    font-size: 1rem;
    margin: 0 !important;
    font-weight: 400;
  }

  .icon {
    margin-right: 0.5rem;
    height: 2rem;
    width: 2rem;
    color: #78716c;
    flex-shrink: 0;
  }

  .flex-center {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    cursor: pointer;
  }
`;

export const StoryBottomText = styled.p`
  font-size: 16px;
  font-weight: bold;
  font-style: italic;
  margin-top: 2rem;
  text-align: center;
`;

export const ViewStoriesModal = styled(Modal)`
  display: flex;
  height: 100vh;
  width: 100vw;
  position: relative;

  .point {
    cursor: pointer;
  }

  .close-icon-btn {
    height: 3rem;
    width: 3rem;
    color: #dc2626;
    flex-shrink: 0;
    cursor: pointer;
  }
  .avatar-img {
    margin-right: 0.5rem;
    height: 3.5rem;
    width: 3.5rem;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #780206; /* fallback for old browsers */
    border: 2px solid -webkit-linear-gradient(to right, #061161, #780206); /* Chrome 10-25, Safari 5.1-6 */
    border: 2px solid linear-gradient(to right, #061161, #780206); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

    @media screen and (min-width: 639px) {
      height: 4rem;
      width: 4rem;
    }
    @media screen and (min-width: 767px) {
      height: 5rem;
      width: 5rem;
    }
  }
  .text-md {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 !important;
    color: #ffffff;
  }

  .text-sm {
    font-size: 1rem;
    font-weight: 200;
    margin: 0 !important;
    color: #ffffff;
  }
  .avatar-flex {
    display: flex;
  }
  .modal-flex-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    position: absolute;
    top: 0;
    padding: 1rem;
  }
  .modal-wrap-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: #262626;
  }
  .stories-wrap-container {
    height: 90vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media screen and (min-width: 1024px) {
    .stories-wrap-container {
      height: 90vh;
      width: 80%;
    }
  }
`;

export const StoryViewerCard = styled.div`
  display: flex;
  align-items: center;

  &:hover {
    .options {
      display: flex;
      position: relative;
    }
  }

  .viewer-thumbnail {
    height: 4.5rem;
    width: 4.5rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    overflow: hidden !important;
    align-items: center;
    justify-content: center;
    background: #262626;
    border: 2px solid #780206; /* fallback for old browsers */
    border: 2px solid -webkit-linear-gradient(to right, #061161, #780206); /* Chrome 10-25, Safari 5.1-6 */
    border: 2px solid linear-gradient(to right, #061161, #780206); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  .text-thumbnail {
    font-size: 0.8rem;
    margin: 0 !important;
    font-weight: 200;
    color: #ffffff;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 90%;
  }

  .stories-option-icon {
    height: 2rem;
    width: 2rem;
    cursor: pointer;
    flex-shrink: 0;
  }

  .options {
    display: none;
  }

  .option-container {
    position: absolute;
    right: 0.6rem;
    top: 3.8rem;
    background-color: #ffffff;
    width: max-content;
    padding: 0.5rem 0rem;
    border-radius: 0.25rem;
    box-shadow: 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    display: grid;
    grid-gap: 0.5rem;
  }

  .option-text {
    color: #525252;
    font-size: 1.4rem;
    line-height: 1.25rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    margin: 0 !important;
    text-align: center;

    &:hover {
      background-color: whitesmoke;
    }
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

export const StoryCase = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #262626;

  .story-case-container {
    width: 100%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
`;

export const StoryImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;

export const StoryVideo = styled.video`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;

export const StoryText = styled.p`
  font-size: 2.8rem;
  font-weight: 400;
  margin: 0 !important;
  color: #ffffff;
  text-align: center;
  padding: 1rem;
  margin: 0 auto;
  word-break: break-word;

  @media screen and (min-width: 520px) {
    font-size: 3rem;
    font-weight: 400;
  }

  @media screen and (min-width: 639px) {
    font-size: 3.4rem;
    font-weight: 500;
  }
  @media screen and (min-width: 767px) {
    font-size: 3.8rem;
    font-weight: 600;
    max-width: 80%;
  }
`;

export const StoryExpanded = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #262626;
  opacity: 0.8;
  position: relative;

  .story-expanded-container {
    padding: 2rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    @media screen and (min-width: 767px) {
      width: 80%;
    }
  }

  .reply-story-container {
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .reply-flex-container {
    display: flex;
    align-items: center;
  }
  .input-container {
    padding: 0.5rem 1rem;
    margin: 0 !important;
    background-color: #ffffff;
    border-radius: 5px;
    box-sizing: border-box;
  }
  .close-story-text {
    font-size: 1.4rem;
    margin: 0.5rem 0 0 0 !important;
    font-weight: 400;
    color: #ffffff;
    cursor: pointer;
  }

  .reply-story-input {
    width: 250px;
    height: 40px;
    border: 1px solid #e5e7eb;
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
    resize: none;
    outline: none;
    font-size: 14px;
    font-family: "Roboto", sans-serif;
    color: #4a4a4a;
    margin: 0 !important;
  }
  .xs-story-text {
    font-size: 1.2rem;
    margin: 0 !important;
    font-weight: 300;
    color: #ffffff;
    cursor: pointer;
  }

  .icon {
    height: 2.6rem;
    width: 2.6rem;
    color: #78716c;
    cursor: pointer;
    flex-shrink: 0;
  }

  .iconBtn {
    height: max-content;
    cursor: pointer;
    padding: 0.75rem;
    background: #ffffff;
  }

  .left {
    margin-left: 0.75rem;
  }
`;

export const SeeMoreCase = styled.div`
  display: flex;
  flex-direction: column;

  .story-text-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.4rem;
    background: #262626;
    opacity: 0.8;
  }

  .small-story-text {
    font-size: 1.4rem;
    margin: 0 !important;
    font-weight: 600;
    color: #ffffff;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 80%;
    margin-right: 0.5rem !important;
  }
  .xs-story-text {
    font-size: 1.2rem;
    margin: 0 !important;
    font-weight: 300;
    color: #ffffff;
    cursor: pointer;
  }

  .col {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .icon {
    height: 2.6rem;
    width: 2.6rem;
    color: #78716c;
    cursor: pointer;
    flex-shrink: 0;
  }

  .iconBtn {
    height: max-content;
    cursor: pointer;
    padding: 0.75rem;
    background: #ffffff;
  }

  .left {
    margin-left: 0.75rem;
  }
`;

export const StoryViewerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .flex {
    display: flex;
    align-items: center;
  }

  .viewer-image-container {
    height: 4rem;
    width: 4rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    background: #262626;
    margin-right: 1rem;
    flex-shrink: 0;
    border: 2px solid #780206; /* fallback for old browsers */
    border: 2px solid -webkit-linear-gradient(to right, #061161, #780206); /* Chrome 10-25, Safari 5.1-6 */
    border: 2px solid linear-gradient(to right, #061161, #780206); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  .viewer-image {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .text-lg {
    font-size: 1.6rem;
    margin: 0 !important;
    font-weight: 400;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .text-sm {
    font-size: 1.2rem;
    margin: 0 !important;
    font-weight: 300;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .view-btn {
    padding: 0.5rem 1rem;
    margin: 0 !important;
    background-color: #337ab7;
    border-radius: 0.5rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .view-btn-text {
    font-size: 1.2rem;
    margin: 0 !important;
    font-weight: 400;
    color: #ffffff;
  }
`;

export const StoryUserModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;

  .user-modal-container {
    display: grid;
    grid-template-rows: auto 1fr;
    background: #ffffff;
    height: 80vh;
    width: 80vw;
    border: none;
    outline: none;

    @media screen and (min-width: 639px) {
      height: 60vh;
      width: 60vw;
      border-radius: 1rem;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    @media screen and (min-width: 767px) {
      height: 60vh;
      width: 40vw;
    }
    @media screen and (min-width: 1023px) {
      height: 60vh;
      width: 30vw;
    }
  }

  .view-top-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    position: relative;
  }

  .story-viewers-container {
    display: grid;
    padding: 1rem;
    grid-gap: 1rem;
    overflow-y: scroll;
    align-items: start;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fill, minmax(4.5rem, 1fr));

    ::-webkit-scrollbar {
      width: 0.7vw;
    }

    ::-webkit-scrollbar-track {
      border-radius: 10px;
      background-color: #ffffff !important;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #d4d4d8;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: #d1d5db;
    }
  }

  .iconBtn {
    height: max-content;
    cursor: pointer;
    padding: 1rem;
    // position: absolute;
    right: 1rem;
  }

  .icon {
    height: 14px;
    width: 14px;
    cursor: pointer;
    color: #385075;
    font-weight: 500;
    flex-shrink: 0;
  }

  .text-md {
    font-size: 2rem;
    margin: 0 !important;
    font-weight: 600;
  }
`;

export const StoriesModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100vw;
  min-height: 100vh;
  min-height: -webkit-fill-available;

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

  .modal-container {
    display: grid;
    padding: 1rem;
    background: #ffffff;
    height: 85vh;
    /* min-height: -webkit-fill-available; */
    width: 100vw;
    border: none;
    outline: none;
    grid-template-rows: auto 1fr auto;

    @media screen and (min-width: 767px) {
      width: 60vw;
    }
    @media screen and (min-width: 1023px) {
      width: 40vw;
    }
  }

  .preview-editor {
    height: 100%;
    overflow-y: scroll;
  }

  .flex-container {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
  }

  .add-icon-btn {
    height: max-content;
    cursor: pointer;
    padding: 0.75rem;
  }

  .flex-between {
    justify-content: space-between;
  }

  .text-area {
    width: 100%;
    border: none;
    border-bottom: 2px solid #e5e7eb;
    padding: 1rem;

    &:focus {
      outline: none;
    }
  }
  .image-preview {
    width: 100%;
    height: 38rem;
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

  .btn-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    margin-top: auto;
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

  .text-lg {
    font-size: 2.5rem;
    margin: 0 !important;
    font-weight: 600;
  }

  .text-md {
    font-size: 1.5rem;
    margin: 0 !important;
    font-weight: 400;
  }

  .text-sm {
    font-size: 1.2rem;
    margin: 0 !important;
    font-weight: 200;
  }

  .icon {
    height: 28px;
    width: 28px;
    color: #78716c;
    flex-shrink: 0;
  }
`;

export const StoryPageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: black;
  z-index: 999;
  min-height: -webkit-fill-available;
  overflow: hidden;
`;

export const StoryPage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .close-icon-btn {
    height: 2.5rem;
    width: 2.5rem;
    color: #fff;
    cursor: pointer;
  }

  .iconBtn {
    padding: 1rem;
    cursor: pointer;
  }
  .right {
    margin-right: 0.5rem;
  }

  .wrap-container {
    max-width: 475px;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    // display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
  }

  .story-flex-container {
    position: absolute;
    z-index: 999;
    width: 100%;
    top: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: whitesmoke;
  }

  .pointer {
    cursor: pointer;
  }

  .controls-flex-container {
    position: relative;
    right: 1rem;
    justify-content: space-evenly;
  }

  .text-md {
    font-size: 1.3rem;
    margin: 0 !important;
    font-weight: 600;
    text-transform: capitalize;
  }

  .text-sm {
    display: flex;
    font-size: 1rem;
    margin: 0 !important;
    font-weight: 200;
  }

  .icon-btn {
    height: 2.5rem;
    width: 2.5rem;
    color: #fff;
    cursor: pointer;
  }

  .avatar-container {
    position: relative;
    cursor: pointer;
    display: flex;
    left: 1rem;
    justify-content: center;
    align-items: center;
  }

  .avatar-img {
    margin-right: 0.5rem;
    height: 3.5rem;
    width: 3.5rem;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #780206; /* fallback for old browsers */
    border: 2px solid -webkit-linear-gradient(to right, #061161, #780206); /* Chrome 10-25, Safari 5.1-6 */
    border: 2px solid linear-gradient(to right, #061161, #780206); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
`;

export const OptionContainer = styled.div`
  position: absolute;
  z-index: 1;
  top: 2rem;
  right: 1rem;
  top: 3rem;
  background-color: #ffffff;
  width: max-content;
  padding: 0.5rem 0rem;
  border-radius: 0.25rem;
  box-shadow: 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  display: grid;
  grid-gap: 0.5rem;
`;

export const OptionalText = styled.p`
  color: #525252;
  font-size: 1.2rem;
  line-height: 1.25rem;
  padding: 0.25rem 1rem;
  cursor: pointer;
  margin: 0 !important;

  &:hover {
    background-color: whitesmoke;
  }
`;
