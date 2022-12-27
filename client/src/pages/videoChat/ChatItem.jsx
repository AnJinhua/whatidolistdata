import React from "react";
import { ListItem } from "@material-ui/core";


const styles = {
  listItem: (isOwnMessage) => ({
    flexDirection: "column",
    alignItems: isOwnMessage ? "flex-end" : "flex-start",
  }),
  container: (isOwnMessage) => ({
    maxWidth: "65%",
    borderRadius: 5,
    padding: 10,
    color: "black",
    fontSize: 20,
    backgroundColor: "white",
  }),
  author: { fontSize: 12, color: "gray" },
  timestamp: { fontSize: 8, color: "grey", textAlign: "right", paddingTop: 4 },
};



class ChatItem extends React.Component {
  render() {
    const { message, identity } = this.props;
    const isOwnMessage = message.author === identity;

    return (
      <ListItem style={styles.listItem(isOwnMessage)}>
        <div style={styles.author}>{message.author}</div>
        <div style={styles.container(isOwnMessage)}>
          {message.body}
          <div style={styles.timestamp}>
            {new Date(message.timestamp.toISOString()).toLocaleString()}
          </div>
        </div>
      </ListItem>
    );
  }
}



export default ChatItem;
