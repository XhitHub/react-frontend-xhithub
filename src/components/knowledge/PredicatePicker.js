import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

import ReactTable from "react-table";
import 'react-table/react-table.css';

import Predicate from './Predicate';
import PredicateSearch from "./PredicateSearch";

class PredicatePicker extends Component {
  constructor(props) {
      super(props);

      this.state = {
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
    var memoryPredicatePacks = JSON.parse(localStorage.getItem('predicatesPacksPool'));
    const columns = [
      {
        Header: 'Predicate',
        accessor: 'predicate', // String-based value accessors!
        Cell: props =>
          <div class="pointer" onClick={()=>{this.props.onSelectItem(props.value)}}>
            <Predicate predicate={props.value} mode="READ-FOL" />
          </div>
      },
      {
        Header: 'Description',
        accessor: 'info.description',
        Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
      }
    ];
    return (
      <div className="col col-lg-12">
        <ul class="nav nav-tabs">
          <li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#memory">Memory</a></li>
          <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#search">Search</a></li>
        </ul>
        <div class="container-fluid">
        <div class="tab-content">
          <div role="tabpanel" id="memory" class="tab-pane fade show active">
            <ReactTable
              data={memoryPredicatePacks}
              columns={columns}
              defaultPageSize="10"
              pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
            />
          </div>
          <div role="tabpanel" id="search" class="tab-pane fade">
            <PredicateSearch onSelectItem={this.props.onSelectItem} />
          </div>
        </div>
        </div>
      </div>

    );
  }
}

export default PredicatePicker;
