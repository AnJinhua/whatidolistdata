import EmojiPicker from "emoji-picker-react";
import { memo } from "react";

function EmojiPickerBox({ emojiOpen, setNewMessage, inputRef }) {
  const handleEmojiPicker = (e, emojiObject) => {
    setNewMessage((oldMessage) => oldMessage + emojiObject.emoji);
    inputRef.current?.focus();
  };

  return (
    <div
      className={`ChatWindow--emojiArea ${!emojiOpen ? "noBorder" : "border"}`}
      style={{ height: emojiOpen ? "250px" : "0px" }}
    >
      <EmojiPicker
        preload
        onEmojiClick={handleEmojiPicker}
        disableSkinTonePicker
      />
    </div>
  );
}

export default memo(EmojiPickerBox);
