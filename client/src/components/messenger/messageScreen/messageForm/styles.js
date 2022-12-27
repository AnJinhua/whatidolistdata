import styled, { keyframes } from "styled-components";
import { RiCloseLine } from "react-icons/ri";
import { BsBlockquoteLeft } from "react-icons/bs";

export const MessageFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  border-top: 1px solid #e5e7eb;

  .block-message {
    font-size: 16px;
    font-weight: 500;
    color: #9b9b9b;
    margin: 0 auto;
    text-align: center;
    width: 100%;
  }
  .unblock {
    color: var(--primary-color);
    cursor: pointer;
  }

  .ChatWindow--emojiArea {
    overflow-y: hidden;
    transition: all ease 0.3s;
  }

  .border {
    margin-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 0 0 5px 5px;
  }
  .noBorder {
    border-bottom: none;
  }

  aside.emoji-picker-react {
    width: auto;
    background-color: none;
  }
  .emoji-picker-react .emoji-group:before {
    background: #fff;
    z-index: 9999;
  }
`;
export const PreviewImageContaner = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  grid-auto-rows: 10rem;
  margin: 0.25rem 0;
  position: relative;

  .image_case {
    position: relative;
  }
  .close_icon {
    position: absolute;
    background: whitesmoke;
    padding: 0.25rem;
    color: #dc2626;
    cursor: pointer;
    flex-shrink: 0;
  }
  .one_icon {
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    top: -0.5rem;
    right: -0.5rem;
  }
  .all_icon {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 8px;
    top: -0.75rem;
    right: -1rem;
  }
  .add_one_icon {
    width: 100%;
    height: 100%;
    border-radius: 0.25rem;
    padding: 2.5rem;
    color: #78716c;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    background: whitesmoke;
  }
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 0.25rem;
  object-fit: cover;
`;

export const SendBtn = styled.div`
  padding: 0.5rem 1.5rem;
  margin: 0 !important;
  background-color: ${({ grayed }) =>
    grayed ? "var(--blue-shade)" : "var(--primary-color)"};
  border-radius: 1.5rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  p {
    font-size: 1.6rem;
    margin: 0 !important;
    font-weight: 600;
    color: #ffffff;
  }
`;
export const SendContainer = styled.form`
  display: flex;
  align-items: center;

  .none {
    display: none;
  }
  .right {
    margin-right: 0.5rem;
  }
  .left {
    margin-left: 0.75rem;
  }
  .img_input_box {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .icon {
    height: 2.6rem;
    width: 2.6rem;
    color: var(--primary-color);
    cursor: pointer;
    flex-shrink: 0;
  }

  .iconBtn {
    height: max-content;
    cursor: pointer;
    padding: 0.75rem;
  }
  .right-container {
    display: flex;
    align-items: center;
    flex: 1;
  }
`;
const recordAnimation = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
 `;

export const RecordContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin-left: 0.5rem;

  .recordIcon {
    height: 2.5rem;
    width: 2.5rem;
    cursor: pointer;
    flex-shrink: 0;
  }

  .redIcon {
    color: #f20519;
    margin-right: 0.5rem;
  }
  .greenIcon {
    color: #41bf49;
    margin-left: 0.5rem;
  }

  .record_div {
    display: flex;
    align-items: center;
  }

  .record__redcircle {
    opacity: 0;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: #f21d2f;
    animation: ${recordAnimation} 500ms infinite alternate;
  }

  .record__duration {
    font-size: 15px;
    font-weight: 500;
    color: #737373;
    margin-left: 0.25rem;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 40px;
  padding: 10px;
  box-sizing: border-box;
  resize: none;
  outline: none;
  font-size: 14px;
  font-family: "Roboto", sans-serif;
  color: #4a4a4a;
  border: none;
  outline: none;

  &:focus {
    border: none;
    outline: none;
  }
`;

export const QuoteContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background: #e0f2fe;
  border-radius: 8px;
  padding: 0.5rem;
  margin: 0.5rem 2rem 1rem 0;
`;

export const QuoteTextContainer = styled.div`
  display: flex;
`;

export const QuoteText = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-style: italic;
  margin: 0;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  overflow: hidden;
`;
export const QuoteTime = styled.p`
  color: #525252;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-bottom: 0.25rem;
`;

export const CloseIcon = styled(RiCloseLine)`
  height: 2rem;
  width: 2rem;
  color: #334155;
  flex-shrink: 0;
  cursor: pointer;
  margin-left: 0.5rem;
`;

export const QuoteBackIcon = styled(BsBlockquoteLeft)`
  height: 1.5rem;
  width: 1.5rem;
  color: #334155;
  flex-shrink: 0;
  margin-right: 0.5rem;
`;
