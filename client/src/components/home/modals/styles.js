import styled from "styled-components";
import { Modal } from "@material-ui/core";

export const ShareModalContainer = styled(Modal)`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .share-container {
    background: #ffffff;
    width: 100%;
    height: 70vh;
    border-radius: 0.5rem;
    outline: none;
    display: grid;
    grid-template-rows: auto 1fr auto;
  }

  .share-header {
    padding: 0.5rem 2rem;
    border-bottom: 2px solid #e0e0e0;
    display: flex;
    align-items: center;
  }

  .share-text {
    font-size: 2rem;
    margin: 0;
    font-weight: 400;
  }
  .header-text {
    flex: 1;
    text-align: center;
  }

  .share-footer {
    border-top: 2px solid #e0e0e0;
    padding: 0.5rem 2rem 2rem 2rem;
    display: grid;
    grid-gap: 2rem;
  }

  .share-btn {
    width: 100%;
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;

    p {
      font-size: 1.6rem;
      margin: 0;
      font-weight: 400;
      text-align: center;
    }
  }

  .active-bg {
    background: var(--primary-color);
  }
  .unActive-bg {
    background: var(--blue-lite);
  }

  .share-area {
    outline: none;
    border: none;
    width: 100%;
    height: 30px;
  }

  @media screen and (min-width: 639px) {
    .share-container {
      width: 60vw;
    }
  }
  @media screen and (min-width: 767px) {
    .share-container {
      width: 40vw;
    }
  }
`;

export const CreateModalContainer = styled(Modal)`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .create-container {
    max-width: 640px;
  }
`;

export const FindUserContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-rows: auto 1fr;
  padding: 0.5rem 0;
  overflow: hidden;

  .user-list-container {
    height: 100%;
    overflow-y: scroll;
    display: grid;
    grid-gap: 1rem;
    padding: 0.5rem 2rem;
    align-items: start;
  }

  .user-search-container {
    border-bottom: 2px solid #e0e0e0;
    display: flex;
    align-items: center;
    padding: 1rem 2rem;
  }

  .search-tag-container {
    display: flex;
    align-items: center;
    flex: 1;
    flex-wrap: wrap;
    margin-left: 1rem;
  }

  .user-tag {
    color: var(--primary-color);
    display: flex;
    align-items: center;
    margin: 0.5rem;
    background: var(--blue-lite);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    max-width: 14rem;
    cursor: pointer;

    p {
      flex: 1;
      margin: 0;
      text-align: center;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .tag-icon {
    height: 1.5rem;
    width: 1.5rem;
    color: var(--primary-color);
    margin-left: 0.5rem;
  }

  .share-search-input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 1.6rem;
    margin-left: 0.5rem;
    min-width: 15rem;
  }

  .user-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .user-flex {
    display: flex;
    align-items: center;
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

  .user-name {
    cursor: pointer;
  }

  .select {
    color: var(--primary-color);
    height: 1.5rem;
    width: 1.5rem;
  }

  .avatar-img {
    border-radius: 50%;
    cursor: pointer;
    background: #262626;
    margin-right: 1rem;
    flex-shrink: 0;
    object-fit: cover;
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
  }
`;

export const UserHeaderContainer = styled.div`
  display: flex;
  align-items: center;

  .text-lg {
    font-size: 1.4rem;
    margin: 0 !important;
    font-weight: 400;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.75rem;
  }

  .text-sm {
    font-size: 1rem;
    line-height: 1.25rem;
    margin: 0 !important;
    font-weight: 400;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .user-name {
    cursor: pointer;
  }

  .avatar-img {
    border-radius: 50%;
    cursor: pointer;
    background: #262626;
    margin-right: 1rem;
    flex-shrink: 0;
    object-fit: cover;
    height: 3rem;
    width: 3rem;
    border-radius: 50%;
  }
`;
