import React from 'react'
import auth from 'solid-auth-client';

async function validateChatRdf() {

}

async function getChat(chatUrl) {
  const chatTriples = await (await auth.fetch(chatUrl)).text()
  console.log(chatTriples)
}

async function sendMessage() {

}

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chatUrl: "https://jackson.solid.community/public/demochat/index.ttl",
      chat: null
    }
  }

  render() {
    return (
      <div>
        <h1>Chat</h1>
        <form onSubmit={async (e) => {
          e.preventDefault()
          await getChat(this.state.chatUrl)
        }}>
          <label htmlFor="chaturl">Chat Url:</label>
          <input
            type="text"
            value={this.state.chatUrl}
            onChange={(e) => this.setState({ chatUrl: e.target.value })}
          />
          <input type="submit" />
        </form>
      </div>
    )
  }
}

// class ChatContent extends React.Component {
//   render() {

//   }
// }

export default Chat


