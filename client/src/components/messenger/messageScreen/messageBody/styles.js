import { CircularProgress, Modal } from "@material-ui/core";
import styled from "styled-components";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsBlockquoteLeft } from "react-icons/bs";
import { RiCheckDoubleLine, RiCheckLine } from "react-icons/ri";
import { animated } from "@react-spring/web";

export const AudioContainer = styled.div`
  .audio_element {
    width: 140px;
    height: 30px;
    display: flex;
    align-items: center;
  }

  .audio_range {
    width: calc(100% - 40px);
    height: 15px;
    display: flex;
    align-items: center;
    position: relative;
  }

  .audioplayer__slider {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    height: 5px;
    width: 100%;
    background: #00000030;
    border-radius: 2.5px;
    position: absolute;
    right: 0;
    z-index: 1;
  }

  .audioplayer__slider:focus {
    outline: none;
  }

  .audioplayer__slider--played {
    height: 5px;
    background: #a9a9a9;
    border-radius: 2.5px;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    position: absolute;
    left: 0;
    z-index: 2;
  }

  .audioplayer__slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #a9a9a9;
    cursor: pointer;
    border-radius: 50%;
    border: none;
    position: relative;
    z-index: 5;
  }
  .audioplayer__slider::-webkit-slider-thumb:active {
    transform: scale(1.25);
  }

  .audioplayer__slider::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #a9a9a9;
    cursor: pointer;
    border-radius: 50%;
    border: none;
  }
  .audioplayer__slider::-moz-range-thumb:active {
    transform: scale(1.25);
  }

  .audio_icons {
    height: 24px;
    width: 24px;
    color: #78716c;
    cursor: pointer;
    flex-shrink: 0;
    margin-right: 1rem;
  }
  .audio_time {
    color: #525252;
    margin: 0 !important;
    font-size: 1.2rem;
    line-height: 1.25rem;
  }

  @media screen and (min-width: 520px) {
    .audio_element {
      width: 200px;
      height: 40px;
    }
  }
`;

export const ImagePreviewModal = styled(Modal)`
  && {
    height: 100%;
    width: 100%;
    position: relative;
    background-color: #000;
    border: none;
    outline: none;

    .close_icon {
      position: absolute;
      background: whitesmoke;
      padding: 0.25rem;
      color: #dc2626;
      cursor: pointer;
      flex-shrink: 0;
      height: 3rem;
      width: 3rem;
      border-radius: 50%;
      top: 0.5rem;
      right: 0.5rem;
    }
  }
`;
export const ImagePreviewModalContainer = styled.div`
  margin: 0 auto;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ImagePreviewModalContent = styled.div`
  max-width: 640px;
  padding: 1rem;
  border-radius: 0.5rem;
  justify-items: center;
`;

export const MessageBodyContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  overflow-x: hidden;
  position: relative;
  height: 100%;
  width: 100%;
  padding: 10px;

  .istyping-container {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    margin-left: 1rem;
  }

  .istyping-text {
    color: #78716c;
    font-size: 1.2rem;
    line-height: 1.25rem;
    margin: 0 0.5rem !important;
  }

  .icon {
    height: 3rem;
    width: 3rem;
    color: #111827;
    cursor: pointer;
    position: fixed;
    bottom: 100px;
    right: 14px;
    background: whitesmoke;
    border-radius: 50%;
    border: 1px solid #e5e7eb;
    padding: 0.5rem;
    display: ${({ isScrollView }) => (isScrollView ? "inline" : "none")};
  }

  ::-webkit-scrollbar {
    width: 0;
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
`;

export const MessageWrapper = styled.div`
  margin: ${({ myMessage }) =>
    myMessage ? "0.25rem 0 0.25rem auto" : "0.25rem auto 0.25rem  0"};
  max-width: 85%;

  @media screen and (min-width: 475px) {
    max-width: 75%;
  }
  @media screen and (min-width: 520px) {
    max-width: 65%;
  }
  @media screen and (min-width: 768px) {
    max-width: 55%;
  }
`;

export const MessageContainer = styled(animated.div)`
  position: relative;
  display: flex;
  cursor: grab;

  &:hover {
    .message-options {
      visibility: visible;
    }
  }
`;

export const InnerContainer = styled.div`
  display: flex;
`;
export const InnerDiv = styled.div`
  display: flex;
  flex-direction: column;
  ${({ myMessage, withAvatar }) =>
    myMessage && withAvatar && { "margin-right": "0.5rem" }};
  ${({ myMessage, withAvatar }) =>
    myMessage && !withAvatar && { "margin-right": "3rem" }};
  ${({ myMessage, withAvatar }) =>
    !myMessage && withAvatar && { "margin-left": "0.5rem" }};
  ${({ myMessage, withAvatar }) =>
    !myMessage && !withAvatar && { "margin-left": "3rem" }};
  align-items: ${({ myMessage }) => (myMessage ? "flex-end" : "flex-start")};
`;

export const OptionContainer = styled.div`
  position: absolute;
  z-index: 1;
  ${({ myMessage }) => myMessage && { left: "0.25rem" }};
  ${({ myMessage }) => !myMessage && { right: "0.25rem" }};
  top: 2rem;
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

export const MessageText = styled.div`
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: ${({ myMessage }) => (myMessage ? "#E0F2FE" : "#F1F5F9")};
  position: relative;
  line-height: 2.25rem;
  flex-wrap: wrap;

  p {
    margin: 0 !important;
  }
  .zoomLink {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
  }
`;

export const QuoteTextContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #334155;
  margin-bottom: 0.5rem;

  .quote-media-container {
    display: flex;
    padding: 1rem;
    box-sizing: border-box;
  }

  .quote-img {
    height: 35px;
    width: 35px;
    object-fit: cover;
    margin-right: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }
`;

export const QuoteText = styled.p`
  font-style: italic;
  margin: 0;
`;

export const MediaContainer = styled.div`
  width: 100%;
  min-width: 20rem;
  max-height: 40rem;
  display: grid;
  grid-gap: 1rem;
  overflow: hidden;

  .thumbnail {
    width: 100%;
    height: 100%;
    min-height: 20rem;
    object-fit: cover;
  }

  .thumbnail-continer {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .icon-btn {
    background: white;
    border: 50%;
    padding: 0.8rem;
    position: absolute;
    left: 45%;
    top: 48%;
  }

  .icon-play {
    color: var(--primary-color);
    height: 2.5rem;
    width: 2.5rem;
  }
`;

export const QuoteBackIcon = styled(BsBlockquoteLeft)`
  height: 1.5rem;
  width: 1.5rem;
  color: #334155;
  flex-shrink: 0;
  margin-right: 0.5rem;
`;

export const TimeText = styled.p`
  color: #525252;
  margin: ${({ myMessage }) => (myMessage ? "0 0.25rem 0 auto" : "0")};
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-bottom: 0.25rem;
`;

export const ConversationDate = styled.p`
  font-size: 1.2rem;
  background-color: whitesmoke;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  margin: 0.5rem auto;
`;

export const DotIcon = styled(BsThreeDotsVertical)`
  height: 1.2rem;
  width: 1.6rem;
  margin-left: 0.25rem;
  margin-top: 0.5rem;
  cursor: pointer;
  visibility: hidden;
  flex-shrink: 0;
`;
export const CheckIcon = styled(RiCheckLine)`
  height: 1.25rem;
  bottom: 0;
  left: 0.5rem;
  position: absolute;
  color: #71717a;
  flex-shrink: 0;
`;
export const DoubleCheckIcon = styled(RiCheckDoubleLine)`
  height: 1.25rem;
  bottom: 0;
  left: 0.5rem;
  position: absolute;
  color: #0284c7;
  flex-shrink: 0;
`;

export const SendSpinner = styled(CircularProgress)`
  && {
    bottom: 0.5rem;
    left: 0.5rem;
    position: absolute;
    color: #525252;
    height: 8px !important;
    width: 8px !important;
  }
`;
