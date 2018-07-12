import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import Formula from "./Formula";

class CreateRule extends Component {
  constructor(props) {
      super(props);

      this.state = {
         rule: {
           lhs:{
             and:[
               {
                 text: 'goes to',
                 arguments: [
                   'home', 'school'
                 ]
               },
               {
                 text: 'back to',
                 arguments: [
                   'home', 'school'
                 ]
               },
               {
                 or:[
                   {
                     not: {
                       text: 'goes to',
                       arguments: [
                         'home', 'school'
                       ]
                     }
                   }

                 ]
               }

             ]
           },
           rhs:{

           }
         }
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
   onSelectItem(item){
     console.log('onSelectItem item', item);
   }
  render() {
    var rule = this.state.rule;
    return (
      <div className="col col-lg-12">
        <h1>Create edit rule</h1>
        <div className="col col-lg-12">
          <Formula formula={rule.lhs} onSelectItem={this.onSelectItem.bind(this)}/>
          <div className="col col-lg-12">
          Implies
          </div>
          <Formula formula={rule.rhs} />
        </div>
      </div>

    );
  }
}

export default CreateRule;
