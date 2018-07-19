import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import Formula from "./Formula";

class Rule extends Component {
  constructor(props) {
      super(props);
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
    var rule = this.props.rule;
    // if(formula === this.state.selectedItem){
    //   isSelected = 'selected'
    // }
    // var type = 'card-header pointer '+group+' '+isSelected;
    return (
      <div className="col col-lg-12">
        <div className="col col-lg-12">
          <div className="card">
            <div className="card-header pointer" onClick={()=>{this.props.onSelectItem(rule.lhs)}}>
            LHS
            </div>
            <div className="card-body">
              <Formula formula={rule.lhs} selectedItem={this.props.selectedItem} onSelectItem={this.props.onSelectItem} mode={this.props.mode} onVarChange={this.props.onVarChange}/>
            </div>
          </div>
        </div>
      <div className="col col-lg-12 text-center">
        <br />
        <h2>
          <i class="fa fa-arrow-right"></i>
        </h2>
        <p>Implies</p>
      </div>
      <div className="col col-lg-12">
        <div className="card">
          <div className="card-header pointer" onClick={()=>{this.props.onSelectItem(rule.rhs)}}>
            RHS
          </div>
          <div className="card-body">
            <Formula formula={rule.rhs} selectedItem={this.props.selectedItem} onSelectItem={this.props.onSelectItem} mode={this.props.mode} onVarChange={this.props.onVarChange}/>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

Rule.defaultProps = {
  mode: 'READ-FOL'
};

global.ruleToString = function(rule, type = 'display'){
  var lhs = global.formulaToString(rule.lhs, type);
  var rhs = global.formulaToString(rule.rhs, type);
  return (lhs + '  -->  '+rhs);
}

export default Rule;
