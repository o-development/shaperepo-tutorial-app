import React from 'react'
import getChatMessages from "./fetchUtils/getChatMessages";

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chatUrl: "https://jackson.solid.community/public/demochat/index.ttl#this",
      messages: null
    }
  }

  render() {
    return (
      <div>
        <h1>Chat</h1>
        <form onSubmit={async (e) => {
          e.preventDefault()
          const messages = await getChatMessages(this.state.chatUrl)
          if (messages) {
            this.setState({ messages })
          }
        }}>
          <label htmlFor="chaturl">Chat Url:</label>
          <input
            type="text"
            value={this.state.chatUrl}
            onChange={(e) => this.setState({ chatUrl: e.target.value })}
          />
          <input type="submit" />
        </form>
        {this.state.messages ?
          <ChatContent
            messages={this.state.messages}
          /> : ""
        }
        
      </div>
    )
  }
}

function ChatContent ({ messages }) {
  return (
    <div>
      {messages.map((message) => (
        <p key={message.nodeName}>
          <strong>{message.author}</strong>: {message.content}
        </p>
      ))}
    </div>
  )
}

export default Chat


