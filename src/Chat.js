import React from 'react'
// import auth from 'solid-auth-client';
import shex from 'shex';

async function getChat(chatUrl) {
  const shexc = "http://localhost:3000/shapes?id=https%3A%2F%2Fshaperepo.com%2Fschemas%2Fchat";
  const data = chatUrl; // For example https://jackson.solid.community/public/demochat/index.ttl
  const node = chatUrl;
  // const shexc = "http://shex.io/examples/Issue.shex";
  // const data = "http://shex.io/examples/Issue1.ttl";
  // const node = "http://shex.io/examples/Issue1";

  shex.Loader.load([shexc], [], [data], []).then(function (loaded) {
    try {
      const db = shex.Util.makeN3DB(loaded.data);
      const validator = shex.Validator.construct(loaded.schema, { results: "api" });
      const result = validator.validate(db, [{node: node, shape: shex.Validator.start}]);
      console.log(result);
    } catch(err) {
      console.log(err)
    }
  });
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


