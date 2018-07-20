import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

class Register extends Component {
  constructor(props) {
      super(props);

      this.state = {
         name: ''
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
   confirm(){
     if(this.state.passwordRetype != this.state.password){
       alert('Password does not match with password re-type.')
     }
     else{
       var opts = {
         url: global.apiUrl + 'register',
         type: 'post',
         success: (data) => {
           this.props.history.push('/knowledge-group/'+data._id);
         },
         data: JSON.stringify({
           "username": this.state.username,
          	"email":this.state.email,
            "password":this.state.password
         })
       }
       global.simpleAjax(opts);
     }
   }
  render() {
    return (
      <div className="col offset-lg-3 col-lg-6">
        <h1>Register</h1>
        <div class="form-group ">
          <label class="control-label " for="username">
           Username
          </label>
          <input
              className="form-control"
              name="username"
              type="text"
              onChange={this.handleChange.bind(this)}
          />
         </div>
         <div class="form-group ">
           <label class="control-label " for="email">
            Email
           </label>
           <input
               className="form-control"
               name="email"
               type="text"
               onChange={this.handleChange.bind(this)}
           />
          </div>
          <div class="form-group ">
            <label class="control-label " for="name">
             Password
            </label>
            <input
                className="form-control"
                name="password"
                type="password"
                onChange={this.handleChange.bind(this)}
            />
           </div>
           <div class="form-group ">
             <label class="control-label " for="name">
              Re-type password
             </label>
             <input
                 className="form-control"
                 name="passwordRetype"
                 type="password"
                 onChange={this.handleChange.bind(this)}
             />
            </div>
          <div className="col col-lg-12 text-center">
            <button class="btn btn-primary" onClick={this.confirm.bind(this)}>Register</button>
          </div>


        <div className="col col-lg-12">
        </div>
      </div>

    );
  }
}

export default withRouter(Register);
