import styled from "styled-components";
import { TiArrowBackOutline } from "react-icons/ti";

export const ScreenHeaderContainer = styled.div`
  display: flex;
  z-index: 1;
  border-bottom: 1px solid #e5e7eb;
  align-items: center;
  padding: 0.5rem;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  width: 100%;

  .options-container {
    position: relative;
  }

  .iconsBtn {
    height: 3rem;
    width: 3rem;
    cursor: pointer;
  }
  .iconBtn {
    padding: 1rem;
    cursor: pointer;
  }
  .right {
    margin-right: 0.5rem;
  }

  .right-icons {
    display: flex;
    align-items: center;
  }

  .icons {
    height: 2.5rem;
    width: 2.5rem;
    cursor: pointer;
    color: var(--primary-color);
    font-weight: 900;
    flex-shrink: 0;
  }
`;

export const OptionContainer = styled.div`
  position: absolute;
  z-index: 1;
  right: 2rem;
  top: rem;
  background-color: #ffffff;
  width: max-content;
  padding: 0.5rem 0rem;
  border-radius: 0.25rem;
  box-shadow: 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  display: grid;
  grid-gap: 0.5rem;
`;

export const OptionalText = styled.p`
  color: ${({ red }) => (red ? "var(--primary-red)" : "#525252")};
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin: 0 !important;

  &:hover {
    background-color: whitesmoke;
  }
`;

export const HeadFlex = styled.div`
  display: flex;
  align-items: center;
`;

export const HeadGrid = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const TimesIcon = styled(TiArrowBackOutline)`
  height: 2.5rem;
  width: 2.5rem;
  cursor: pointer;
  color: var(--primary-color);
  font-weight: 500;
  flex-shrink: 0;
`;

export const ScreenTextLg = styled.h4`
  font-size: 1.6rem;
  font-weight: 400;
  color: #162040;
  cursor: pointer;
  margin: 0 !important;

  @media screen and (min-width: 639px) {
    font-size: 2rem;
    font-weight: 800;
  }
`;

export const ScreenTextMd = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  color: #162040;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media screen and (min-width: 639px) {
    font-size: 1.4rem;
    font-weight: 400;
  }
`;
export const GreenDot = styled.div`
  height: 0.75rem;
  width: 0.75rem;
  background-color: #22c55e;
  border-radius: 999px;
  margin-left: 0.5rem;
`;
export const AmberDot = styled.div`
  height: 0.75rem;
  width: 0.75rem;
  background-color: #f59e0b;
  border-radius: 999px;
  margin-left: 0.5rem;
`;
