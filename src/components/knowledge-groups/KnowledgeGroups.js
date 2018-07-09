import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './style.css';
import { TablePagination } from 'react-pagination-table';
import config from 'react-global-configuration';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import $ from 'jquery';

// var apiUrl = config.get('apiUrl');

class KnowledgeGroups extends Component {
  constructor(props) {
      super(props);

      this.state = {
         knowledgeGroups: []
      }
   }

  componentWillMount() {
      console.log('Component WILL MOUNT!')
   }
   componentDidMount() {
      var opts = {
        url: global.apiUrl + 'knowledge/get-knowledge-group',
        type: 'post',
        success: (data) => {
          var wrappedData = [];
          data.forEach((item) => {
            wrappedData.push({knowledgeGroup: item});
          })
          this.setState({
            knowledgeGroups: wrappedData
          });
        },
        data: JSON.stringify({
          "tags": ["thrower","asd"]
        })
      }
      global.simpleAjax(opts);
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
    const columns = [{
      Header: 'Name',
      accessor: 'knowledgeGroup', // String-based value accessors!
      Cell: props => <Link to={'/knowledge-group/'+props.value._id}>{props.value.name}</Link>
    }, {
      Header: 'Description',
      accessor: 'knowledgeGroup.description',
      Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
    }];
    return (
      <div className="">
        <h1>Knowledge groups</h1>
        <ReactTable
          data={this.state.knowledgeGroups}
          columns={columns}
          defaultPageSize="15"
          pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
        />
      </div>
    );
  }
}

export default KnowledgeGroups;
