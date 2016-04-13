import React from "react";
import RaisedButton from 'material-ui/lib/raised-button';
import Popover from 'material-ui/lib/popover/popover';

export default class AuthPanel extends React.Component {
  handleAuth() {
    console.log("login pressed");
    this.props.authToggle();
  }
  authStatus() {
    return this.props.auth ? "Logout" : "Login";
  }
  fbAuth(event){
    this.props.getFBToken();
  }
  render() {
    console.log("AuthPanel props:", this.props);
    const styles = {
      button: {
        margin: 12,
      },
      popover: {
        padding: 20,
      },
    };
    return (
      <div>
        <RaisedButton 
          onClick={this.handleAuth.bind(this)} 
          label={this.authStatus()} 
          default={true} 
          style={styles.button} 
        />
        <Popover
          open={this.props.auth}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          
        >
          <div style={styles.popover}>
            <RaisedButton 
              primary={true} 
              onClick={this.fbAuth.bind(this)}
              label="Login with Facebook"/>
          </div>
        </Popover>
      </div>
    );
  }
}
        // <button onClick={this.handleClick.bind(this)}>
          // {this.authStatus()}
        // </button>
