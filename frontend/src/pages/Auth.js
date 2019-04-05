import React, { Component } from "react";

import "./Auth.css";
import AuthContext from "../context/auth-context";

class AuthPage extends Component {
  state = {
    isLogin: true
  };
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passEl = React.createRef();
  }

  static contextType = AuthContext;

  switchModeHandler = () => {
    this.setState(prevState => {
      return {
        isLogin: !prevState.isLogin
      };
    });
  };

  loginHandler = event => {
    event.preventDefault();
    const { isLogin } = this.state;
    const email = this.emailEl.current.value;
    const password = this.passEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let body = {
      query: `
      query Login($email: String!, $password: String!){
        login(email: $email, password: $password) {
          token
          tokenExpiration
          userId
        }
      }
      `,
      variables: {
        email,
        password
      }
    };

    if (!isLogin) {
      body = {
        query: `
        mutation CreateUser($email: String!, $password: String!){
          createUser(userInput: {email: $email, password: $password}) {
            _id
            email
          }
        }
        `,
        variables: {
          email,
          password
        }
      };
    }

    fetch("http://localhost:3001/graphql", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }

        return res.json();
      })
      .then(data => {
        if (isLogin && data.data.login && data.data.login.token) {
          this.context.login(data.data.login);
        }

        if (!isLogin && data.data.createUser) {
          this.setState({
            isLogin: true
          });
        }

        console.log(data);
      })
      .catch(err => console.log("err", err));
  };

  render() {
    const { isLogin } = this.state;
    return (
      <form className="auth-form" onSubmit={this.loginHandler}>
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passEl} />
        </div>

        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {isLogin ? "SignUp" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
