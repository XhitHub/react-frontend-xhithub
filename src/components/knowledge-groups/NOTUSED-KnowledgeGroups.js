import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './style.css';
import { TablePagination } from 'react-pagination-table';
import config from 'react-global-configuration';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import $ from 'jquery';
import SearchWithList from "../general/SearchWithList";

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
       url: global.apiUrl + 'knowledge/get-knowledge-groups',
       type: 'get',
       success: (data) => {
         var wrappedData = [];
         data.forEach((item) => {
           wrappedData.push({knowledgeGroup: item});
         })
         this.setState({
           knowledgeGroups: wrappedData
         });
       }
     }

      // var opts = {
      //   url: global.apiUrl + 'knowledge/get-knowledge-group',
      //   type: 'post',
      //   success: (data) => {
      //     var wrappedData = [];
      //     data.forEach((item) => {
      //       wrappedData.push({knowledgeGroup: item});
      //     })
      //     this.setState({
      //       knowledgeGroups: wrappedData
      //     });
      //   },
      //   data: JSON.stringify({
      //     "tags": ["thrower","asd"]
      //   })
      // }
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
      <div className="row">
        <div className="col col-lg-12 text-center">
        <h1>Knowledge groups</h1>
        <div className="row">
          <div className="col col-lg-9">
            <SearchWithList
              delimiter={' '}
              url='knowledge/get-knowledge-group-by-keywords'
              method="post"
              onSelectItem={()=>{}}
              getItemView={
                (item)=>{
                  return (
                    <Link to={'/knowledge-group/'+item._id}>{item.name}</Link>
                  )
                }
              }
            />
          </div>
          <div className="col col-lg-3">
            <Link to={'/create-knowledge-group'}>Create knowledge group</Link>
          </div>
        </div>
        <ReactTable
          data={this.state.knowledgeGroups}
          columns={columns}
          defaultPageSize="15"
          pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
        />
        </div>
      </div>
    );
  }
}

export default KnowledgeGroups;
