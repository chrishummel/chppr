import React from "react";
import RaisedButton from 'material-ui/lib/raised-button';
import Popover from 'material-ui/lib/popover/popover';

export default class AuthPanel extends React.Component {
  handleAuth() {
    if(this.props.yummy){
      console.log("logout pressed");
      this.props.authToggle('logout');
    } else {
      console.log("login pressed");
      this.props.authToggle('login');
    }
  }
  authStatus() {
    return this.props.yummy ? "Logout" : "Login";
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
      <div float="right">
        {this.props.yummy ? 
          <div class="user">
            <img src={this.props.yummy.photo} />
            <p>Logged in as:<br/>{this.props.yummy.username}</p>
          </div>
          
         : null}
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
            <a href="/auth/facebook">Login with Facebook</a>
          </div>
        </Popover>
      </div>
    );
  }
}
        // <button onClick={this.handleClick.bind(this)}>
          // {this.authStatus()}
        // </button>
