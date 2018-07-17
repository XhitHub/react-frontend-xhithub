import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

import ReactTable from "react-table";
import 'react-table/react-table.css';

import Predicate from '../knowledge/Predicate';

class Rules extends Component {
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
       url: global.apiUrl + 'knowledge/get-all-rules',
       type: 'get',
       success: (data) => {
         var wrappedData = [];
         data.forEach((item) => {
           wrappedData.push({rulePack: item});
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
       url: global.apiUrl + 'knowledge/search-rules',
       type: 'post',
       success: (data) => {
         var wrappedData = [];
         data.forEach((item) => {
           wrappedData.push({rulePack: item});
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
    const columns = [
      {
        Header: 'Rule',
        accessor: 'rulePack', // String-based value accessors!
        Cell: props =>
          <Link to={'/rule/'+props.value._id}>
            <pre>{global.ruleToString(props.value.rule)}</pre>
          </Link>
      },
      {
        Header: 'Text form',
        accessor: 'rulePack', // String-based value accessors!
        Cell: props => <span>{props.value.info.textForm}</span>
      }
    ];
    return (
      <div className="col col-lg-12">
        <h1>Rules</h1>
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
                    <Link to={'/create-rule/'}>
                      <button class="btn btn-primary pull-right" >Create new rule</button>
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

export default withRouter(Rules);
