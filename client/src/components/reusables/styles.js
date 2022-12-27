import styled from "styled-components";

export const ReUsedImageContainer = styled.div`
  height: ${({ height }) => (height ? height : "4rem")};
  width: ${({ width }) => (width ? width : "4rem")};
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  background: #262626;
  flex-shrink: 0;
  border: 2px solid #780206; /* fallback for old browsers */
  border: 2px solid -webkit-linear-gradient(to right, #061161, #780206); /* Chrome 10-25, Safari 5.1-6 */
  border: 2px solid linear-gradient(to right, #061161, #780206); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  .image {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

export const ReusedBigText = styled.p`
  font-size: 1.6rem;
  margin: 0 !important;
  font-weight: 400;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ReUsableSmallText = styled.p`
  font-size: 1.2rem;
  margin: 0 !important;
  font-weight: 300;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ReUsableBlueButton = styled.div`
  padding: 0.5rem 1rem;
  margin: 0 !important;
  background-color: var(--primary-color);
  border-radius: 0.5rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  p {
    font-size: 1.4rem;
    margin: 0 !important;
    font-weight: 600;
    color: #ffffff;
  }
`;

export const ContactButton = styled.button`
  padding: 0.5rem 2rem;
  background-color: var(--primary-color);
  border-radius: 0.5rem;
  font-size: 1.8rem;
  margin: 1rem auto !important;
  font-weight: 600;
  color: #ffffff;
  border: none;
  outline: none;
`;

export const ContactBtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .right {
    margin-right: 0.5rem;
  }
  .icon {
    height: 3rem;
    width: 3rem;
    cursor: pointer;
    color: var(--primary-color);
    font-weight: 900;
    flex-shrink: 0;
  }
`;
