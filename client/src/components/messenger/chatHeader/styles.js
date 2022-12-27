import styled from "styled-components";

export const HeadGridContainer = styled.div`
  display: grid;
  grid-gap: 18px;
  padding: 0px;
`;
export const HeadSelectContainer = styled.div`
  display: grid;
  grid-gap: 3rem;
  grid-template-columns: 1fr 1fr 1fr;
  width: max-content;
  place-items: center;
`;
export const LgText = styled.div`
  font-size: 32px;
  color: #162040;
`;

export const SelectText = styled.p`
  font-size: 16px;
  padding-bottom: 6px;
  cursor: pointer;
  margin: 0 !important;
  color: ${({ selected }) => (selected ? "#050c26" : "#717584")};
  border-bottom: ${({ selected }) => (selected ? "2px solid #050c26" : "none")};

  :hover {
    border-bottom: 2px solid #e5e7eb;
  }
`;
