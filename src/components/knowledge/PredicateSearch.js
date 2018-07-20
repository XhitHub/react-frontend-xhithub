import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";


import ReactTable from "react-table";
import 'react-table/react-table.css';

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
     var arr = str.split(/\s+/)
     var opts = {
       url: global.apiUrl + 'knowledge/search-predicate',
       type: 'post',
       success: (data) => {
         var wrappedData = [];
         data.forEach((item) => {
           wrappedData.push({pack: item});
         })
         this.setState({
           searchResults: wrappedData
         });
       },
       data: JSON.stringify(arr)
     }
     global.simpleAjax(opts);
   }
  render() {
    const columns = [
      {
        Header: 'Predicate',
        accessor: 'pack', // String-based value accessors!
        Cell: props =>
          <div class="pointer" onClick={()=>{this.props.onSelectItem(props.value)}}>
            <Predicate predicate={props.value.predicate} mode="READ-FOL" />
          </div>
      },
      {
        Header: 'Description',
        accessor: 'pack.info.description',
        Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
      }
    ];
    return (
      <div className="">
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
        <div className="">
          <ReactTable
            data={this.state.searchResults}
            columns={columns}
            defaultPageSize="10"
            pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
          />
        </div>
      </div>

    );
  }
}

export default PredicateSearch;
