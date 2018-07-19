import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import Formula from "./Formula";

class Fact extends Component {
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
    var fact = this.props.fact;
    // if(formula === this.state.selectedItem){
    //   isSelected = 'selected'
    // }
    // var type = 'card-header pointer '+group+' '+isSelected;
    return (
      <div className="col col-lg-12">
        <div className="col col-lg-12">
          <div className="card">
            <div className="card-header pointer" onClick={()=>{this.props.onSelectItem(fact)}}>
              Fact
            </div>
            <div className="card-body">
              <Formula formula={fact} selectedItem={this.props.selectedItem} onSelectItem={this.props.onSelectItem} mode={this.props.mode} onVarChange={this.props.onVarChange}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Fact.defaultProps = {
  mode: 'READ-FOL'
};

export default Fact;
