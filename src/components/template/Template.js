import React, { Component } from 'react';
import './style.css';

class Template extends Component {
  constructor(props) {
      super(props);

      this.state = {
         stateField1: "stateField1 value"
      }
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
      </div>
    );
  }
}

export default Template;
