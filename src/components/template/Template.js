import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';

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
      <div className="">
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
      </div>
    );
  }
}

export default Template;
