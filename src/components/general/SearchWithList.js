import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

import Predicate from './Predicate';

class SearchWithList extends Component {
  constructor(props) {
      super(props);

      this.state = {
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
     var arr = str.split(this.props.delimiter);
     var opts = {
       url: global.apiUrl + this.props.url,
       type: this.props.method,
       success: (data) => {
         var res = [];
         data.forEach((item) => {
           res.push(item);
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
    var results;
    if(this.state.loading){
        results = (
          <div className="col col-lg-12">
            {global.loading}
          </div>
        )
    }
    else{
      if(this.state.searchResults){
        results = (
          <SelectableList items={this.state.searchResults} onSelectItem={this.props.onSelectItem} getItemView={this.props.getItemView} />
        )
      }
    }
    return (
      <div className="col col-lg-12">
        <table class="table">
          <tr>
          <td>
          <input
              className="form-control"
              placeholder="keywords"
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
        {results}
      </div>

    );
  }
}

export default SearchWithList;
