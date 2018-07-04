import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';

class Login extends Component {
  constructor(props) {
      super(props);

      this.state = {
         username: "",
         password: "",
         loginFailed: false
      }
   }

   handleChange(e){
     global.handleInputChange(this,e);
   }

  componentWillMount() {
      console.log('Component WILL MOUNT!')
   }
   componentDidMount() {
      console.log('Component DID MOUNT!')
   }
   componentWillReceiveProps(newProps) {
      console.log('Component WILL RECIEVE PROPS!')
   }
   shouldComponentUpdate(newProps, newState) {
      return true;
   }
   componentWillUpdate(nextProps, nextState) {
      console.log('Component WILL UPDATE!');
   }
   componentDidUpdate(prevProps, prevState) {
      console.log('Component DID UPDATE!')
   }
   componentWillUnmount() {
      console.log('Component WILL UNMOUNT!')
   }
   login(){
     console.log('login this',this);
     $.ajax({
         url: global.apiUrl+'get-token',
         type: 'post',
         dataType: 'json',
         contentType: 'application/json',
         success: function (data) {
           // alert('logged in');
           if(data.jwt){
             localStorage.setItem('token', data.jwt);
             this.props.history.push('/');
           }
           else{
             this.setState({
               loginFailed: true
             });
           }
         },
         data: JSON.stringify({
            "username": this.state.username,
            "password": this.state.password
          })
     });
   }
  render() {
    return (
      <div className="container">
      <div className="flex-container">
      <div className="flex-item text-center">
        <h1>Login</h1>
        <form>
            <input
                className="form-item form-control"
                placeholder="Username"
                name="username"
                type="text"
                onChange={this.handleChange.bind(this)}
            />
            <input
                className="form-item form-control"
                placeholder="Password"
                name="password"
                type="password"
                onChange={this.handleChange.bind(this)}
            />
            <input
                className="form-submit"
                value="Login"
                type="button"
                onClick={this.login.bind(this)}
            />
        </form>
      </div>
      </div>
      </div>
    );
  }
}

export default Login;
