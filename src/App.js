import React from 'react';
import './App.css';
import auth from 'solid-auth-client';
import Chat from './Chat';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputVal: ""
    }
  }

  render() {
    return (
      <div>
        <h1>Log In</h1>
        <form onSubmit={async (e) => {
          e.preventDefault()
          auth.login(this.state.inputVal)
        }}>
          <label for="idpInput">Your IDP:</label>
          <input
            type="text"
            placeholder="Example: https://solid.community"
            onChange={(e) => this.setState({ inputVal: e.target.value })}
          />
          <input type="submit" />
        </form>
      </div>
    )
  }
}


class ChatApp extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loadingAuth: true,
      session: null
    }
    // Check to see if already authenticated
    auth.trackSession(session => {
      console.log(session)
      if (!session)
        this.setState({ loadingAuth: false })
      else
        this.setState({ session: session, loadingAuth: false })
    })
  }

  render() {
    if (this.state.loadingAuth) {
      return <h1>Loading...</h1>
    } else if (!this.state.session) {
      return <Login />
    } else {
      return (
        <div>
          <p>Logged in as {this.state.session.webId}</p>
          <Chat />
        </div>
      )
    }
  }
}

export default ChatApp;
