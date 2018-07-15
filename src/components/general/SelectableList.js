import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

class SelectableList extends Component {
  constructor(props) {
      super(props);

      this.state = {}
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
    var itemViews = [];
    console.log('SelectableList his.props.items',this.props.items);
    this.props.items.forEach((item)=>{
      itemViews.push(
        <li class="list-group-item pointer" onClick={() => {this.props.onSelectItem(item)}}>
          {this.props.getItemView(item)}
        </li>
      )
    });
    return (
      <div className="col col-lg-12">
        <ul class="list-group">
          {itemViews}
        </ul>
      </div>

    );
  }
}

export default SelectableList;
