import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

class Template extends Component {
  constructor(props) {
      super(props);

      this.state = {
         stateField1: "stateField1 value"
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
  render() {
    return (
      <div className="col col-lg-12">
        <h1>Template</h1>
        <p>{this.state.stateField1}</p>
        <p>{this.props.propsField1}</p>
        <input
            className="form-control"
            placeholder="Username"
            name="username"
            type="text"
            onChange={this.handleChange.bind(this)}
        />

        <div className="col col-lg-12">
        </div>
      </div>

    );
  }
}

export default Template;
