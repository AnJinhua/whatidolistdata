import styled from "styled-components";

export const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto 0 auto;
  width: 100%;
  height: 100%;
  max-height: 90vh;
  overflow: hidden;
  padding: 10px 0px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  display: flex;
  @media (min-width: 576px) {
    padding: 10px 20px;
  }
`;

export const NavigationContainer = styled.div`
  height: 100%;
  flex: 0.4;
  border: 1px solid rgba(41, 45, 50, 0.4);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 1rem;
  overflow-y: scroll;

  .category-search {
    display: flex;
    padding: 1rem 2rem;
    background: #f3f3f3;
    border-radius: 5px;
    align-items: center;
  }

  .category-input {
    color: #bdbdbd;
    background: transparent;
    border: none;
    outline: none;
    width: 100%;

    ::placeholder {
      color: #bdbdbd;
    }
  }
  .category-search-icon {
    color: #bdbdbd;
    width: 19.06px;
    height: 19.06px;
    margin-right: 1rem;
  }
  .info-container {
    padding: 1rem 0;
  }
  .info-header {
    font-size: 16px;
    font-weight: 500;
    line-height: 12px;

    color: #292d32;
  }
  .info-body {
    font-size: 14px;
    line-height: 16px;
    color: rgba(41, 45, 50, 0.6);
  }
`;

export const ContentContainer = styled.div`
  height: 100%;
  flex: 1;
  background: #d9d9d9;
  width: 100%;
  margin-left: 2rem;
  overflow-y: scroll;

  .scroll-view-container {
    height: 100%;
    max-width: 48rem;
    width: 100%;
    margin: 0 auto;
  }
`;

export const ContentCard = styled.div`
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 5px;
  margin: 1rem 0;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    border-bottom: 2px solid #e5e7eb;
  }
  .profile-container {
    display: flex;
  }
  .profile-image {
    height: 4rem;
    width: 4rem;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #780206; /* fallback for old browsers */
    border: 2px solid -webkit-linear-gradient(to right, #061161, #780206); /* Chrome 10-25, Safari 5.1-6 */
    border: 2px solid linear-gradient(to right, #061161, #780206); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
  .text-container {
    margin: 0 1rem;
    width: 100%;
  }
  .big-text {
    font-size: 1.4rem;
    margin: 0 !important;
    font-weight: 400;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .small-text {
    font-size: 1.2rem;
    margin: 0 !important;
    font-weight: 400;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .card-content {
    background: #d9d9d9;
  }

  .content-view {
    height: 100%;
    max-height: 40rem;
    width: 100%;
    object-fit: contain;
  }
  .option-icon {
    height: 2rem;
    width: 2rem;
  }
  .icon-btn {
    padding: 0.75rem;
  }

  .content-footer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 1rem 2rem;
    border-top: 2px solid #e5e7eb;
  }
`;

export const CategoryContainer = styled.div`
  width: 100%;
  border-bottom: 1px solid #b8b8b8;

  .category-flex {
    display: flex;
    align-items: center;
  }
  .category-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 1.5rem 0;
    cursor: pointer;
  }
  .display-icon {
    color: #292d32;
    width: 10px;
    height: 40px;
    margin-right: 1rem;
  }
  .display-text {
    color: #292d32;
    font-size: 1.5rem;
    font-weight: 500;
    margin: 0;
  }
  .follow-container {
    background: #292d32;
    color: #ffffff;
    padding: 0.5rem 2rem;
    border-radius: 0.5rem;
  }
  .follow {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
  }
  .clear {
    .in-icon {
    }
  }
`;

export const HideCategoryContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  .sub-category-container {
    border: 1px solid #292d32;
    color: #292d32;
    padding: 0.5rem 2rem;
    border-radius: 0.5rem;
    margin: 0.5rem;

    p {
      margin: 0;
    }
  }
`;
