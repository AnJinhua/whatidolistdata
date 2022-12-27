import styled, { keyframes } from "styled-components";

export const ListContainer = styled.div`
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  cursor: pointer;
`;
export const NoArchiveIconContiner = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(2, 1fr);
`;
export const ListFlexBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 25px 25px 25px;
`;

export const FlexBorder = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #e5e7eb;
  padding: 5px 8px;
  border-radius: 4px;

  p {
    margin: 0 !important;
    font-size: 12px;
  }
  .icon {
    cursor: pointer;
    color: #000;
    font-size: 14px;
    margin-right: 10px;
  }
  &:hover {
    background-color: #e5e7eb;
  }
`;

export const ListFlexTop = styled.div`
  padding: 25px 25px 10px 25px;
  display: flex;
`;
export const ListTopGrid = styled.div`
  display: grid;
`;
export const ListTopInnerGrid = styled.div`
  display: grid;
  grid-gap: 6px;
`;

export const Textflex = styled.div`
  display: flex;
  align-items: center;
`;
export const HeadFlex = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const TextLgDark = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: #050c26;
  margin: 0;
`;
export const TextMdDark = styled.p`
  font-size: 16px;
  color: #050c26;
  margin-right: 10px;
`;
export const TextSmGray = styled.p`
  font-size: 12px;
  color: #7b91b1;
`;
export const TextRed = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background-color: #dc2626;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  margin-right: 0.5rem;
`;
export const TextMdGray = styled.p`
  font-size: 14px;
  color: #7b91b1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const lds_ellipsis1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
 `;

const lds_ellipsis2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
 `;
const lds_ellipsis3 = keyframes`
   0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
 `;
export const ElipsDot = styled.div`
  position: relative;
  width: 80px;
  display: flex;
  align-items: center;

  div {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #6b7280;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  div:nth-child(1) {
    left: 8px;
    animation: ${lds_ellipsis1} 0.6s infinite;
  }

  div:nth-child(2) {
    left: 8px;
    animation: ${lds_ellipsis2} 0.6s infinite;
  }

  div:nth-child(3) {
    left: 32px;
    animation: ${lds_ellipsis2} 0.6s infinite;
  }

  div:nth-child(4) {
    left: 56px;
    animation: ${lds_ellipsis3} 0.6s infinite;
  }
`;
