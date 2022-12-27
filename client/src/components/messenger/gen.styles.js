import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  max-width: 1024px;
  margin: auto;
  width: 100%;
  padding: 20px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

export const LgContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto 0 auto;
  width: 100%;
  padding: 20px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

export const MessageScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  background: whitesmoke;
  z-index: 999;
  min-height: -webkit-fill-available;
`;

export const MdContainer = styled.div`
  max-width: 800px;
  margin: 0 auto 0 auto;
  width: 100%;
  height: 100%;
  border: 2px solid #e5e7eb;
  border-radius: 5px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  position: relative;
  background: #fff;
`;

export const MessageGrid = styled.div`
  display: grid;
  grid-gap: 35px;
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

const fade = keyframes`
     from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
 `;

export const FadingDots = styled.div`
  width: 1.2em;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;

  div {
    width: 0.3em;
    height: 0.3em;
    border-radius: 50%;
    background-color: var(--blue-shade);
    animation: ${fade} 0.8s ease-in-out alternate infinite;
  }

  .dots div:nth-of-type(1) {
    animation-delay: -0.4s;
  }

  .dots div:nth-of-type(2) {
    animation-delay: -0.2s;
  }
`;
