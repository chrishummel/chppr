import React from "react";
import RaisedButton from 'material-ui/lib/raised-button';

export default class AuthPanel extends React.Component {
  handleAuth() {
    console.log("login pressed");
    this.props.authToggle();
  }
  authStatus() {
    return this.props.auth ? "Logout" : "Login with FB";
  }
  render() {
    console.log("AuthPanel props:", this.props);
    const styles = {
      button: {
        margin: 12,
      }
    };
    return (
        <RaisedButton onClick={this.handleAuth.bind(this)} label={this.authStatus()} default={true} style={styles.button} />
    );
  }
}
        // <button onClick={this.handleClick.bind(this)}>
          // {this.authStatus()}
        // </button>
