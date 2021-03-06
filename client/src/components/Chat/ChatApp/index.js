import React from "react";
import io from "socket.io-client";
//import config from '../config';

import Messages from "../Messages";
import OnlineUsers from "../OnlineUsers";
import ChatInput from "../ChatInput";

require("./ChatApp.css");

class ChatApp extends React.Component {
  socket = {};
  constructor(props) {

    console.log("Constructor");

    super(props);
    this.state = {
      messages: [],
      onlineUsers: []
    };
    this.sendHandler = this.sendHandler.bind(this);
    this.clearHandler = this.clearHandler.bind(this);
    this.username = props.username;

  }

  componentDidMount() {
    console.log("componentDidMount");

    
    // Connect to the server
    let socket_url = window.location.href.split(window.location.pathname)[0];
    this.socket = io(socket_url, {
      query: `username=${this.username}`
    }).connect();

    // Listen for messages from the server
    this.socket.on("server:message", message => {
      this.addMessage(message);
    });

    // Listen to broadcast messages
    this.socket.on("connected clients", onlineUsers => {
      console.log("connected clients : " + onlineUsers);
      this.addOnlineUsers(onlineUsers);
    });
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");

    // Disconnect socket.
    this.socket.disconnect(true);
  }

  sendHandler(message) {
    const messageObject = {
      username: this.props.username,
      message
    };

    // Emit the message to the server
    this.socket.emit("client:message", messageObject);

    messageObject.fromMe = true;
    this.addMessage(messageObject);
  }

  clearHandler() {
    // Remove all messages
    const messages = this.state.messages;
    messages.length = 0;
    this.setState({ messages: messages });
  }

  addMessage(message) {
    // Append the message to the component state
    const messages = this.state.messages;
    messages.push(message);
    this.setState({ messages: messages });
  }

  addOnlineUsers(onlineUsers) {
    this.setState({ onlineUsers: onlineUsers });
  }

  render() {
    return (
      <div className="card text-center">
        <div className="card-header">Chat</div>

        <div className="card-body chat-card-body">
          <div className="row h-100">
            <div className="col-4 users-online-col h-100">
              <div className="card text-center h-100">
                <div className="card-body users-online-card-body h-100">
                  <OnlineUsers onlineUsers={this.state.onlineUsers} />
                </div>
              </div>
            </div>
            <div className="col-8 h-100">
              <div className="card h-100">
                <Messages messages={this.state.messages} />
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <ChatInput onSend={this.sendHandler} onClear={this.clearHandler} />
        </div>
      </div>
    );
  }
}
ChatApp.defaultProps = {
  username: "Anonymous"
};

export default ChatApp;
