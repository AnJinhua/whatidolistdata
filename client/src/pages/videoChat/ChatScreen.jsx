import React from "react";
import {
  Grid,
  IconButton,
  List,
  TextField,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import ChatItem from "./ChatItem";

const ChatScreen = ({ setChatProps, chatState, sendMessage, scrollDiv, identity }) => {
  const { text, messages } = chatState;
  return (
    <div style={{ width: "400px", padding: "20px" }}>
      <Grid container direction="column" style={styles.mainGrid}>
        <Grid item style={styles.gridItemChatList} ref={scrollDiv}>
          <List dense={true}>
            {messages &&
              messages.map((message) => (
                <ChatItem
                  key={message.index}
                  message={message}
                  identity={identity}
                />
              ))}
          </List>
        </Grid>
        <Grid item style={styles.gridItemMessage}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item style={styles.textFieldContainer}>
              <TextField
                required
                style={styles.textField}
                placeholder="Enter message"
                variant="outlined"
                multiline
                rows={2}
                value={text}
                onChange={(event) =>
                  setChatProps({ text: event.target.value, messages: messages })
                }
              />
            </Grid>
            <Grid item>
              <IconButton style={styles.sendButton} onClick={sendMessage}>
                <Send style={styles.sendIcon} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

const styles = {
  textField: { width: "80%", borderWidth: 0, borderColor: "transparent" },
  textFieldContainer: { flex: 1, marginRight: 12 },
  gridItem: { paddingTop: 12, paddingBottom: 12 },
  gridItemChatList: { overflow: "auto", height: "85vh" },
  gridItemMessage: { marginTop: 12, marginBottom: 12 },
  sendButton: { backgroundColor: "black" },
  sendIcon: { color: "white" },
  mainGrid: { borderWidth: 1 },
};

export default ChatScreen;