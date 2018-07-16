import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

import ReactTable from "react-table";
import 'react-table/react-table.css';

import Predicate from '../knowledge/Predicate';

class KnowledgeGroups extends Component {
  constructor(props) {
      super(props);

      this.state = {
         items: [],
         allItems: []
      }
   }

   handleChange(e){
     global.handleInputChange(this,e);
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
           items: wrappedData,
           allItems: wrappedData
         });
       }
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
   templateAjax(){
     var opts = {
       url: global.apiUrl + 'knowledge/knowledge-group',
       type: 'post',
       success: (data) => {
         this.setState({
           knowledgeGroup: data
         });
       },
       data: JSON.stringify({
         "name": this.state.name,
        	"is_private":false,
        	"tags": [
        	],
          "description": this.state.description
       })
     }
     global.simpleAjax(opts);
   }

   search(e){
     var str = this.state.keywords;
     var arr = str.split(' ');
     var opts = {
       url: global.apiUrl + 'knowledge/get-knowledge-group-by-keywords',
       type: 'post',
       success: (data) => {
         var wrappedData = [];
         data.forEach((item) => {
           wrappedData.push({knowledgeGroup: item});
         })
         this.setState({
           items: wrappedData,
         });
       },
       data: JSON.stringify(arr)
     }
     global.simpleAjax(opts);
   }

   clearSearch(){
     this.setState({
       items: this.state.allItems
     });
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
      <div className="col col-lg-12">
        <h1>Knowledge Groups</h1>
        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col">
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
                  <td>
                    <button class="btn btn-default" onClick={this.clearSearch.bind(this)}>Clear search</button>
                  </td>
                  <td>
                    <Link to={'/create-knowledge-group/'}>
                      <button class="btn btn-primary pull-right" >Create new knowledge group</button>
                    </Link>
                  </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div className="card-body text-center">
            <ReactTable
              data={this.state.items}
              columns={columns}
              defaultPageSize="15"
              pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
            />
          </div>
        </div>
      </div>

    );
  }
}

export default withRouter(KnowledgeGroups);
