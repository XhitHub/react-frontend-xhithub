import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

import Predicate from './Predicate';

class PredicateSearch extends Component {
  constructor(props) {
      super(props);

      this.state = {
         stateField1: "stateField1 value",
         keywords: '',
         searchResults: []
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
   search(e){
     var str = this.state.keywords;
     var arr = str.split(' ');
     var opts = {
       url: global.apiUrl + 'knowledge/search-predicate',
       type: 'post',
       success: (data) => {
         var res = [];
         data.forEach((item) => {
           res.push(item.predicate);
         })
         this.setState({
           searchResults: res
         });
       },
       data: JSON.stringify(arr)
     }
     global.simpleAjax(opts);
   }
  render() {
    var results = [];
    this.state.searchResults.forEach((item)=>{
      results.push(
        <li class="list-group-item pointer" onClick={() => {this.props.onSelectItem(item)}}>
          <Predicate predicate={item} mode="READ-FOL" />
        </li>
      )
    });
    return (
      <div className="col col-lg-12">
        <table class="table">
          <tr>
          <td>
          <input
              className="form-control"
              placeholder="Predicates search"
              name="keywords"
              type="text"
              value={this.state.keywords}
              onChange={this.handleChange.bind(this)}
          />
          </td>
          <td>
          <i class="fa fa-search pointer" onClick={this.search.bind(this)}></i>
          </td>
          </tr>
        </table>
        <div className="col col-lg-12">
          <ul class="list-group">
            {results}
          </ul>
        </div>
        <div className="col col-lg-12">
        </div>
      </div>

    );
  }
}

export default PredicateSearch;
