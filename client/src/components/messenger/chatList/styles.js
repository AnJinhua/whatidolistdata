import styled from "styled-components";

export const ChatListContainer = styled.div`
  display: grid;
  grid-gap: 25px;
`;
export const ArchiveListContainer = styled.div`
  min-height: 35vh;
`;

export const ArchiveBottomText = styled.p`
  font-size: 16px;
  font-weight: bold;
  font-style: italic;
  margin: 0 auto;
  text-align: center;
`;

export const NoArchiveContiner = styled.div`
  display: grid;
  grid-gap: 15px;
`;

export const NoImage = styled.img`
  width: 20vh;
  height: 20vh;
  object-fit: cover;
  margin: 0 auto;
`;

export const NoArchiveText = styled.p`
  font-size: 14px;
  margin: 0 auto;
  text-align: center;
`;
