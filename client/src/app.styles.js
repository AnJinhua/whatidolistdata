import styled from "styled-components";

export const PageGrid = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
  position: relative;

  @media not all and (min-resolution: 0.001dpcm) {
    @supports (-webkit-appearance: none) {
      min-height: -webkit-fill-available !important;
    }
  }
`;
