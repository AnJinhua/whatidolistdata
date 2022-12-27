import styled from "styled-components";

export const LgContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 0 auto;
  padding: 20px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

export const ZoomContainer = styled.div`
  display: grid;
  padding-top: 25px;
`;

export const ZoomBottomButton = styled.button`
  font-size: 18px;
  margin: 5rem auto;
  padding: 10px;
  height: 50px;
  text-align: center;
  cursor: pointer;
  color: white;
  background-color: #0000ff;
  border: none;
  border-radius: 1rem;
  box-sizing: border-box;
`;

export const ZoomBottomText = styled.p`
  font-size: 16px;
  font-weight: bold;
  font-style: italic;
  margin-top: 2rem;
  text-align: center;
`;

export const ZoomImageContainer = styled.div`
  display: grid;
  grid-gap: 15px;
`;

export const Image = styled.img`
  width: 50vh;
  object-fit: cover;
  margin: 0 auto;
`;

export const ZoomImageText = styled.p`
  font-size: 20px;
  margin: 0 auto;
  text-align: center;
`;
