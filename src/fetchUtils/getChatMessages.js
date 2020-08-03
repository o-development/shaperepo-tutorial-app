import isValidChat from "./isChatValid";
import { dataset as Dataset } from "@rdfjs/dataset";
import ParserN3 from "@rdfjs/parser-n3";
import { Readable } from "stream";
import auth from "solid-auth-client";
import cf from "clownface";
import { namedNode } from "@rdfjs/data-model";

/**
 * Gets a chat, validates it, then returns the messages from the chat
 * @param {string} chatUrl The url of the chat in a solid pod
 * @returns { Array } An array of messages following this format: {
 *   nodeName: string
     author: string
     content: string
 * }[]
 */

export default async function getChatMessages(chatUrl) {
  // The url of the file containing the chat
  const dataUrl = chatUrl;
  // The url of the node within the file that is the chat
  const nodeUrl = chatUrl;

  // Fetch the chat using solid-auth-client
  const chatTtl = await (await auth.fetch(dataUrl)).text()

  // Validate that the fetched data is a chat
  if (!await isValidChat(chatTtl, dataUrl, nodeUrl)) {
    alert(`Document at ${dataUrl} is not a valid chat`)
    return null
  }
  // If the data is a chat:

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

  // Use clownface to extract desired data
  const FLOW_MESSAGE = namedNode("http://www.w3.org/2005/01/wf/flow#message");
  const CONTENT = namedNode("http://rdfs.org/sioc/ns#content");
  const MAKER = namedNode("http://xmlns.com/foaf/0.1/maker");
  const chatNode = cf({ dataset }).namedNode(nodeUrl);
  const messages = chatNode.out(FLOW_MESSAGE).map((messageNode) => {
    return {
      nodeName: messageNode.value,
      author: messageNode.out(MAKER).value,
      content: messageNode.out(CONTENT).value
    }
  })
  return messages
}