import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class Predicate extends Component {
  constructor(props) {
      super(props);

      this.state = {
         predicate: props.predicate,
         mode: props.mode,
         readOnly: props.readOnly
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
    var content;
    var details;
    var p = this.state.predicate;

    if(this.state.mode == 'READ'){
      this.setState();
      var argViews = []
      p.arguments.forEach((arg) => {
        argViews.push(
          <li class="list-group-item">{arg}</li>
        )
      })
      content = (
        <div className=" card">
          <div className=" predicate-text card-header">
            {p.text}
          </div>
          <div className=" predicate-arguments card-body">
            <ul class="list-group">
              {argViews}
            </ul>
          </div>
        </div>
      )
    }

    if(this.state.mode == 'READ-FOL'){
      var sent = p.text.replace(/\s/g, '_');
      var args = "";
      p.arguments.forEach((arg) => {
        args += ", " + arg
      })
      args = args.substring(2)
      var raw = sent + "("+args+")";
      content = (
        <span class="predicate-read-fol">{raw}</span>
      )
    }

    if(this.state.mode == 'EDIT-FOL-VAR'){
      var sent = p.text.replace(/\s/g, '_');
      var args = [];
      p.arguments.forEach((arg) => {
        args.push(
          <span><input type="text" name={arg} placeholder={arg} onChange={(e)=>{this.props.onVarChange(e,this.props.predicate)}}/>, </span>
        )
      });
      var raw = sent + "("+args+")";
      content = (
        <div>
          <span class="predicate-read-fol">{sent}(</span>
          {args}
          <span>)</span>
        </div>
      )
    }

    if(this.state.mode == 'READ-FOL-VAR'){
      var sent = p.text.replace(/\s/g, '_');
      var args = '';
      p.arguments.forEach((arg) => {
        var argVar;
        if(p.variables[arg]){
          argVar = p.variables[arg]
        }
        else{
          argVar = arg
        }
        args += ", " + argVar
      });
      args = args.substring(2)
      var raw = sent + "("+args+")";
      content = (
        <span class="predicate-read-fol">{raw}</span>
      )
    }

    return (
      <div className="predicate pointer">
        {content}
        {details}
      </div>
    );
  }
}

Predicate.defaultProps = {
  mode: 'READ-FOL',
  readOnly: true
};

global.predicateToString = function(p){
  var sent = p.text.replace(/\s/g, '_');
  var args = '';
  if(p.arguments){
    var arr = p.arguments;
    arr.forEach((arg) => {
      var argVar;
      if(p.variables && p.variables[arg]){
        argVar = p.variables[arg]
      }
      else if(p.parameters && p.parameters[arg]){
        argVar = p.parameters[arg]
      }
      else{
        argVar = arg
      }
      args += ", " + argVar
    });
    args = args.substring(2)
  }
  var raw = sent + "("+args+")";
  return raw;
}


export default Predicate;
