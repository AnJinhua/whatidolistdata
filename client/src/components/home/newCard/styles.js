import styled from "styled-components";

export const SidebarContainer = styled.div`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 2.5rem;
  border-right: 2px solid rgb(243 244 246 / var(--tw-border-opacity));
  --tw-border-opacity: 1;
  padding: 0.75rem;
  margin-left: -0.5rem;

  @media (min-width: 768px) {
    display: flex;
    width: 275px;
    border: 0px;
    margin-left: 3rem;
  }

  @media (min-width: 1280px) {
    width: 400px;
    border: 0px;
    margin-left: -1rem;
  }

  .home-container {
    @media (min-width: 768px) {
      // border-bottom: 2px solid rgb(229 231 235 / var(--tw-border-opacity));
      --tw-border-opacity: 1;
      padding-bottom: 1rem;
    }
  }

  .home {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    cursor: pointer;
    font-weight: 600;
    --tw-text-opacity: 1;
    color: #34383d;
    border-radius: 0.5rem;
    transition: all 0.5s ease-in-out;

    &:hover {
      --tw-bg-opacity: 10;
      background-color: rgb(241 241 242);
    }

    @media (min-width: 768px) {
      justify-content: flex-start;
    }
  }

  .home-focused {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0.75rem;
    cursor: pointer;
    font-weight: 600;
    --tw-text-opacity: 1;
    color: #34383d;
    transition: all 0.5s ease-in-out;
    border-bottom: 3px solid rgb(229 231 235 / var(--tw-border-opacity));

    @media (min-width: 768px) {
      justify-content: flex-start;
    }
  }

  .icon {
    height: 2.5rem;
    width: 2.5rem;
  }

  .you {
    color: var(--primary-color);
    margin-right: 0.5rem;
  }

  .explore {
    color: var(--dark-gray);
    margin-right: 0.5rem;
  }

  .inspiring {
    color: var(--primary-yellow);
    height: 3rem;
    width: 3rem;
  }

  .upload {
    display: block;
    color: var(--dark-gray);
    margin-right: 0.5rem;

    @media (min-width: 768px) {
      display: none;
    }
  }

  .home-text {
    display: none;
    text-transform: capitalize;
    font-size: 1.6rem;
    line-height: 1.75rem;

    @media (min-width: 768px) {
      display: block;
    }
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  scroll-snap-type: y mandatory;
  @media (min-width: 768px) {
    margin: 0;
    gap: 2.5rem;
  }
`;

export const ContentCard = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid rgb(229 231 235);
  --tw-bg-opacity: 1;
  scroll-snap-align: start;

  @media (min-width: 640px) {
    padding-bottom: 3rem;
    margin: 0 5rem;
  }

  .text-container {
    height: 375px;
    width: 100vw;
    cursor: pointer;

    @media (min-width: 768px) {
      height: 400px;
    }
    @media (min-width: 576px) {
      border-radius: 1rem;
      width: 470px;
    }

    @media (min-width: 1024px) {
      height: 530px;
    }
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

  .user-container {
    display: flex;
    align-items: center;
    padding: 1rem 0;
    cursor: pointer;
    font-weight: 600;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
    margin-top: -2rem;

    @media (min-width: 768px) {
      margin-top: 0rem;
    }
  }

  .img-container {
    height: 2rem;
    width: 2rem;

    @media (min-width: 768px) {
      height: 4rem;
      width: 4rem;
    }
  }

  .img {
    border-radius: 9999px;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 3rem;
    margin-left: 5rem;

    @media (min-width: 768px) {
      margin-top: 2rem;
      margin-left: 3rem;
    }
  }

  .user-name {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    font-weight: 700;
    --tw-text-opacity: 1;
    color: rgb(22 24 35 / var(--tw-text-opacity));

    @media (min-width: 768px) {
      font-size: 1.5rem;
      line-height: 1.75rem;
    }
  }

  .user-expertise {
    display: block;
    text-transform: capitalize;
    font-weight: 500;
    font-size: 1.3rem;
    line-height: 1rem;
    --tw-text-opacity: 1;
    color: rgb(107 114 128 / var(--tw-text-opacity));
  }

  .play-button-container {
    left: 0;
    right: 0;
    bottom: 3rem;
    top: 0;
    position: absolute;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .video-display-container {
    display: flex;
    flex-direction: column;

    @media (min-width: 576px) {
      flex-direction: row;
    }

    @media (min-width: 1024px) {
      margin-left: 7rem;
    }
  }

  .video-container {
    width: 100vw;
    height: auto;
    max-height: 530px !important;
    @media (min-width: 576px) {
      border-radius: 1.5rem;
      width: 470px;
    }
  }

  .video-display {
    position: relative;
    top: 0px;
    left: 0px;
    /* z-index: -1; */
    width: 100%;
    height: 100%;
    max-height: 530px;
    background-color: black;
  }

  .controls {
    position: absolute;
    width: 85%;
    display: flex;
    justify-content: space-between;
    bottom: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;

    @media (min-width: 576px) {
      bottom: 1rem;
      padding: 0.75rem;
    }
  }

  .play-button {
    --tw-text-opacity: 1;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 2.5rem;
    line-height: 2.5rem;
    margin: 1rem;
  }

  .muteButton,
  .UnmuteButton {
    position: relative;
    left: 91%;
    top: -33px;
    font-size: 1.25em;
    color: white;
  }

  .playIcon {
    color: white;
    font-size: 5em;
  }

  .pausePlayIconCont {
    position: relative;
  }

  .video-sidebar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    @media (min-width: 576px) {
      width: max-content;
      flex-direction: column;
      margin-left: 0 0 0 2rem;
    }
  }

  .side-icon-container {
    display: flex;
    align-items: center;
    justify-items: center;
    .sidebar-count {
      font-weight: 600;
      border: none;
      color: #000;
      margin: 0 1rem;
    }

    @media (min-width: 576px) {
      flex-direction: column;

      .sidebar-count {
        margin: 0.5rem 0 1rem 0;
      }
    }
  }

  .sidebar-icons {
    font-size: 2.5rem;
    border: none;
    border-radius: 50%;
    color: #000;
  }

  .inspired {
    color: var(--primary-yellow);
    height: 3rem;
    width: 3rem;
  }

  .speaker-desktop {
    display: none;

    @media (min-width: 576px) {
      display: block;
    }
  }

  .speaker-mobile {
    display: block;

    @media (min-width: 576px) {
      display: none;
    }
  }
`;

export const UploaderContainer = styled.div`
  margin-top: auto;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

export const SidebarFooterContainer = styled.div`
  margin-top: auto;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;
