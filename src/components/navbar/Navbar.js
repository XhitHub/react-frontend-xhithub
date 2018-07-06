import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

class Navbar extends Component {
  constructor(props) {
      super(props);

      this.state = {
         username: "u3",
         password: "p3",
         stateField1: "stateField1 value",
         user: undefined,
         modalIsOpen: false
      }

      this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
   }

   handleChange(e){
     global.handleInputChange(this,e);
   }

  componentWillMount() {
      console.log('Component WILL MOUNT!')
   }
   componentDidMount() {
      console.log('Component DID MOUNT!')
      // $("#myModal").modal('show');
      if(localStorage.getItem('token')){
        global.simpleAjax('users/current-user','get',(data) => {
          this.setState({
            user: data
          });
        });
      }
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

   openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

   login(){
     console.log('login this',this);
     $.ajax({
         url: global.apiUrl+'get-token',
         type: 'post',
         dataType: 'json',
         contentType: 'application/json',
         success: (data) => {
           // alert('logged in');
           if(data.jwt){
             localStorage.setItem('token', data.jwt);
             this.props.history.push('/knowledge-groups');
             // $("#myModal").modal('hide');
             // $("#myModal").hide();
             $("#btnCloseModal").click();
             this.setState({
               loginFailed: false
             });
             $.ajax({
                 url: global.apiUrl+'users/current-user',
                 type: 'GET',
                 dataType: 'json',
                 contentType: 'application/json',
                 success: (data) => {
                   this.setState({
                     user: data
                   })
                 },
                 error: (err) => {
                   console.log('err', err);
                 },
                 headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')}
             });
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
   logout(){
     localStorage.removeItem('token');
     window.location.href = global.appUrl;
   }
  render() {
    var buttons;
    var account;
    if(this.state.user){
      buttons = (
        <ul className="navbar-nav mr-auto">
           <li className="nav-item">
              <a className="nav-link">
                 <Link to={'/'}>
                 Home</Link>
              </a>
           </li>
           <li className="nav-item">
              <a className="nav-link">
                 <Link to={'/knowledge-groups'}>Knowledge groups</Link>
              </a>
           </li>
           <li className="nav-item">
              <a className="nav-link disabled" href="#">Disabled</a>
           </li>
        </ul>
      )
      account = (
        <div className="nav-item dropdown account-dropdown">
           <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
           {this.state.user.username}
           </a>
           <div className="dropdown-menu" aria-labelledby="navbarDropdown">
               <a className="nav-link">
                  <Link to={'/profile'}>Profile</Link>
               </a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item pointer" onClick={this.logout.bind(this)}>Logout</a>
           </div>
        </div>
      )
    }
    else{
      buttons = (
        <div className="right-flex">
         <a className="nav-link pointer" data-toggle="modal" data-target="#myModal">Login</a>

         </div>
      )
    }
    return (
      <div className="">
         <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">KB-Shared</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
               {buttons}
            </div>
            <div className="collapse navbar-collapse flex-end-container" id="div-account">
               {account}
            </div>
         </nav>



         <div id="myModal" className="modal fade" role="dialog" ref="myModal">
            <div className="modal-dialog">
               <div className="modal-content">
                  <div className="modal-header">
                     <button id="btnCloseModal" type="button" className="close" data-dismiss="modal">&times;</button>
                     <h4 className="modal-title">Login</h4>
                  </div>
                  <div className="modal-body">
                      <div className="flex-container">
                      <div className="flex-item text-center">
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
               </div>
            </div>


            <Modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              contentLabel="Login"
            >

              <h2>Login</h2>
              <button onClick={this.closeModal}>close</button>
              <div className="flex-container">
              <div className="flex-item text-center">
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
              </div></div>
            </Modal>
         </div>
      </div>
    );
  }
}

export default withRouter(Navbar);
