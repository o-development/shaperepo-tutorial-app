import React from 'react'
import auth from 'solid-auth-client';
import shex from 'shex';
import cf from "clownface";
import { namedNode } from "@rdfjs/data-model";
import { dataset as Dataset } from "@rdfjs/dataset";
import { Store, Parser } from "n3";
import ParserN3 from "@rdfjs/parser-n3"
import { Readable } from "stream"

async function getChat(chatUrl) {
  const shexcUrl = "http://localhost:3000/shapes?id=https%3A%2F%2Fshaperepo.com%2Fschemas%2Fchat";
  const shapeUrl = "https://shaperepo.com/schemas/chat#ChatShape"
  const dataUrl = chatUrl;
  const nodeUrl = chatUrl;

  const chatTtl = await (await auth.fetch(dataUrl)).text()

  // Create N3 Store
  const store = await new Promise((resolve, reject) => {
    const store = Store()
    new Parser({documentIRI: dataUrl, blankNodePrefix: "", format: "text/turtle"})
      .parse(chatTtl, function (error, triple, prefixes) {
        if (prefixes) {
          store.addPrefixes(prefixes);
        }
        if (error) {
          reject("error parsing");
        } else if (triple) {
          store.addTriple(triple)
        } else {
          resolve(store);
        }
      });
  })

  // Create RDFJS dataset
  const dataset = await new Promise((resolve, reject) => {
    const dataset = Dataset();

    const parserN3 = new ParserN3({ baseIRI: dataUrl })
    const input = new Readable({
      read: () => {
        input.push(chatTtl)
        input.push(null)
      }
    })
    const output = parserN3.import(input)
    output.on('data', quad => {
      dataset.add(quad)
    })
    output.on('prefix', (prefix, ns) => {
      // console.log(`prefix: ${prefix} ${ns.value}`)
    })
    output.on('end', () => {
      resolve(dataset)
    })
  })

  // Check if the data fits
  await shex.Loader.load([shexcUrl], [], [dataUrl], []).then(function (loaded) {
    const db = shex.Util.makeN3DB(store);
    const validator = shex.Validator.construct(loaded.schema, { results: "api" });
    const result = validator.validate(db, [{node: nodeUrl, shape: shapeUrl}]);
    if (result[0].status !== "conformant") {
      alert(`The resource at ${chatUrl} is not a chat.`);
    }
  });

  return dataset
}

class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chatUrl: "https://jackson.solid.community/public/demochat/index.ttl#this",
      chat: null
    }
  }

  render() {
    return (
      <div>
        <h1>Chat</h1>
        <form onSubmit={async (e) => {
          e.preventDefault()
          const chat = await getChat(this.state.chatUrl)
          if (chat) {
            this.setState({ chat })
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
        {this.state.chat ?
          <ChatContent
            chat={this.state.chat}
            chatId={this.state.chatUrl}
          /> : ""
        }
        
      </div>
    )
  }
}

class ChatContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: ""
    }
  }

  render() {
    const { chat, chatId } = this.props;
    const FLOW_MESSAGE = namedNode("http://www.w3.org/2005/01/wf/flow#message");
    const CONTENT = namedNode("http://rdfs.org/sioc/ns#content");
    const MAKER = namedNode("http://xmlns.com/foaf/0.1/maker");
    const chatNode = cf({ dataset: chat }).namedNode(chatId);
    const messages = chatNode.out(FLOW_MESSAGE).map((messageNode) => {
      return {
        nodeName: messageNode.value,
        author: messageNode.out(MAKER).value,
        content: messageNode.out(CONTENT).value
      }
    })
    return (
      <div>
        {messages.map((message) => (
          <p key={message.nodeName}>
            <strong>{message.author}</strong>: {message.content}
          </p>
        ))}
        <form onSubmit={async (e) => {
          e.preventDefault()
          const chat = await getChat(this.state.chatUrl)
          if (chat) {
            this.setState({ chat })
          }
        }}>
          <input
            type="text"
            value={this.state.chatMessage}
            onChange={(e) => this.setState({ chatMessage: e.target.value })}
          />
          <input type="submit" value="Send Message" />
        </form>
      </div>
    )
  }
}

export default Chat


