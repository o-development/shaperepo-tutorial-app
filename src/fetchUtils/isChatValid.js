import { Store, Parser } from "n3";
import shex from 'shex';

/**
 * Takes in a turtle representation and returns true if it is a chat
 * @param {string} chatTtl: The turtle representation of the chat 
 * @param {string} dataUrl: The url of the file the data was at
 * @param {string} nodeUrl: The url of the 
 * @return {boolean} true if the given data matches a chat
 */
export default async function isChatValid(chatTtl, dataUrl, nodeUrl) {
  // The url you can fetch the shape at
  const shexcUrl = "http://localhost:3000/shapes?id=https%3A%2F%2Fshaperepo.com%2Fschemas%2Fchat";
  // The url of the shape within the Shex Schema that should be validated
  const shapeUrl = "https://shaperepo.com/schemas/chat#ChatShape"

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

  // Check if the data fits
  return await shex.Loader.load([shexcUrl], [], [], []).then(function (loaded) {
    const db = shex.Util.makeN3DB(store);
    const validator = shex.Validator.construct(loaded.schema, { results: "api" });
    const result = validator.validate(db, [{node: nodeUrl, shape: shapeUrl}]);
    return result[0].status === "conformant"
  });
}