# ShapeRepo.com Tutorial App

This example application shows how you can use [https://ShapeRepo.com](https://shaperepo.com) to build an interoperable Solid Application.

The main files of importance are:
 - [getChat.js](src/fetchUtils/getChat.js): A function that fetches a chat from a Solid Pod and returns the messages it contains
 - [isChatValid.js](src/fetchUtils/isChatValid.js): A function that takes in data and uses ShapeRepo to determine if the data matches the chat shape.

## Installation

To install, clone the project and run `npm install`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.