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
    var p = this.state.predicate
    if(this.state.mode == 'READ'){
      var argViews = []
      p.arguments.forEach((arg) => {
        argViews.push(
          <li class="list-group-item">arg</li>
        )
      })
      content = (
        <div className="col col-lg-12">
          <div className="col-lg-12 predicate-text">
            {p.text}
          </div>
          <div className="col col-lg-12 predicate-arguments">
            <ul class="list-group">
              {argViews}
            </ul>
          </div>
        </div>
      )
    }
    if(this.state.mode == 'READ-EXPERT'){
      var sent = p.text.replace(' ', '_');
      var args = "";
      p.arguments.forEach((arg) => {
        args += ", " + arg
      })
      args = args.substring(2)
      var raw = sent + "("+args+")";
      content = (
        <span>{raw}</span>
      )
    }
    if(this.state.mode == 'READ'){
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
    if(this.state.mode == 'EDIT'){
      var argViews = []
      p.arguments.forEach((arg,i) => {
        argViews.push(
          <li class="list-group-item">
            <input
                className="form-item form-control"
                name="argument"
                index={i}
                type="text"
                value={arg}
                onChange={this.props.handleChange.bind(this)}
            />
          </li>
        )
      })
      content = (
        <div className="col col-lg-12">
          <div className="col-lg-12 predicate-text">
            <input
                className="form-item form-control"
                name="text"
                type="text"
                value={p.text}
                onChange={this.props.handleChange.bind(this)}
            />
          </div>
          <div className="col col-lg-12 predicate-arguments">
            <ul class="list-group">
              {argViews}
            </ul>
          </div>
        </div>
      )
    }
    return (
      <div className="predicate">
        {content}
      </div>
    );
  }
}

export default Predicate;
