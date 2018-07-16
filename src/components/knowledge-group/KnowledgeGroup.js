import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import ReactTable from "react-table";
import 'react-table/react-table.css';

import Predicate from '../knowledge/Predicate';

class KnowledgeGroup extends Component {
  constructor(props) {
      super(props);

      this.state = {
         knowledgeGroup: undefined,
         predicates: []
      }
   }

   handleChange(e){
     global.handleInputChange(this,e);
   }

  componentWillMount() {
      console.log('Component WILL MOUNT!')
   }
   componentDidMount() {
      var kgid = this.props.match.params.id;
      var opts = {
        url: global.apiUrl + 'knowledge/knowledge-group/'+kgid,
        type: 'get',
        success: (data) => {
          this.setState({
            knowledgeGroup: data
          });
        }
      }
      global.simpleAjax(opts);

       var opts2 = {
         url: global.apiUrl + 'knowledge/get-predicates-by-knowledge-group/'+kgid,
         type: 'get',
         success: (data) => {
           this.setState({
             predicates: data
           });
         }
       }
       global.simpleAjax(opts2);
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
    var kg = this.state.knowledgeGroup;
    const columns = [
      {
        Header: 'Predicate',
        accessor: 'predicate', // String-based value accessors!
        Cell: props => <Predicate predicate={props.value} mode="READ-FOL" />
      },
      {
        Header: 'Details',
        accessor: '_id', // String-based value accessors!
        Cell: props => <Link to={'/predicate/'+props.value}>Details</Link>
      },
      {
        Header: 'Description',
        accessor: 'info.description',
        Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
      }
    ];

    if(kg){
      return (
        <div className="col col-lg-12 text-center">
          <h1>Knowledge group</h1>
          <div className="card">
            <div class="card-body">
              <h3>{kg.name}</h3>
              <p>{kg.description}</p>
            </div>
          </div>
          

          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="offset-md-3 col-md-6">
                  <h4 class="pull-left">Rules</h4>
                </div>
                <div className="col-md-3 pull-right">
                  <Link to={'/create-rule/'+kg._id}>Create</Link>
                </div>
              </div>
            </div>
            <div className="card-body">
            </div>
          </div>


          <div className="col col-lg-12">
          </div>
        </div>
      );
    }
    else{
      return global.loading;
    }
  }
}

export default KnowledgeGroup;
