import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

import ReactTable from "react-table";
import 'react-table/react-table.css';

import Predicate from '../knowledge/Predicate';
import PrologMaker from "../general/PrologMaker";

class Predicates extends Component {
  constructor(props) {
      super(props);

      this.state = {
         predicates: [],
         allPredicates: []
      }
      this.addToMemory = this.addToMemory.bind(this);
      this.removeFromMemory = this.removeFromMemory.bind(this);
   }

   handleChange(e){
     global.handleInputChange(this,e);
   }

  componentWillMount() {
      console.log('Component WILL MOUNT!')
   }
   componentDidMount() {
      var opts2 = {
        url: global.apiUrl + 'knowledge/get-all-predicates/',
        type: 'get',
        success: (data) => {
          var res = [];
          data.forEach((item) => {
            res.push({
              predicatePack: item
            });
          })
          console.log('res',res)
          this.setState({
            predicates: res,
            allPredicates: res
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
       url: global.apiUrl + 'knowledge/search-predicate',
       type: 'post',
       success: (data) => {
         var res = [];
         data.forEach((item) => {
           res.push({
             predicatePack: item
           });
         })
         this.setState({
           predicates: res
         });
       },
       data: JSON.stringify(arr)
     }
     global.simpleAjax(opts);
   }

   clearSearch(){
     this.setState({
       predicates: this.state.allPredicates
     });
   }

   addToMemory(pp){
     var memoryPreds = JSON.parse(localStorage.getItem('predicatesPacksPool'));
     memoryPreds.push(pp)
     localStorage.setItem('predicatesPacksPool',JSON.stringify(memoryPreds));
     this.setState({});
   }

   removeFromMemory(pp){
     var memoryPreds = JSON.parse(localStorage.getItem('predicatesPacksPool'));
     // var idx = memoryPreds.indexOf(pp);
     // memoryPreds = memoryPreds.splice(idx,1);
     memoryPreds = memoryPreds.filter(item=>{
       return item._id != pp._id
     })
     console.log('memoryPreds filtered',memoryPreds);
     localStorage.setItem('predicatesPacksPool',JSON.stringify(memoryPreds));
     this.setState({});
   }

  render() {
    var memoryPreds = JSON.parse(localStorage.getItem('predicatesPacksPool'));
    console.log('memoryPreds',memoryPreds);
    const columns = [
      {
        Header: 'Predicate',
        accessor: 'predicatePack', // String-based value accessors!
        Cell: props =>
          <Link to={'/predicate/'+props.value._id}>
            <Predicate predicate={props.value.predicate} mode="READ-FOL" />
          </Link>
      },
      {
        Header: 'Description',
        accessor: 'predicatePack.info.description',
        Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
      },
      {
        Header: 'Save to memory',
        accessor: 'predicatePack', // String-based value accessors!
        Cell: props => {
          var pp = props.value;
          var idx = memoryPreds.indexOf(pp);
          var found = memoryPreds.find((item)=>{
            return item._id == pp._id;
          })
          var btn;
          if(!found){
            btn = (
              <i class="fa fa-plus pointer" onClick={()=>{this.addToMemory(pp)}}></i>
            )
          }
          else{
            btn = (
              <i class="fa fa-check memory pointer" onClick={()=>{this.removeFromMemory(pp)}}></i>
            )
          }
          return(
            <div>{btn}</div>
          )
        }
      }
    ];
    const columns2 = [
      {
        Header: 'Predicate',
        accessor: 'predicatePack', // String-based value accessors!
        Cell: props =>
          <Link to={'/predicate/'+props.value._id}>
            <Predicate predicate={props.value.predicate} mode="READ-FOL" />
          </Link>
      },
      {
        Header: 'Description',
        accessor: 'predicatePack.info.description',
        Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
      },
      {
        Header: 'Remove from memory',
        accessor: 'predicatePack', // String-based value accessors!
        Cell: props => {
          var pp = props.value;
          var idx = memoryPreds.indexOf(pp);
          var found = memoryPreds.find((item)=>{
            return item._id == pp._id;
          })
          var btn;
          btn = (
            <i class="fa fa-times memory pointer" onClick={()=>{this.removeFromMemory(pp)}}></i>
          )
          return(
            <div>{btn}</div>
          )
        }
      }
    ];
    return (
      <div className="col col-lg-12">
        <h1>Predicates</h1>
          <ul class="nav nav-tabs">
            <li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#search">Search</a></li>
            <li class="nav-item"><a class="nav-link " data-toggle="tab" href="#memory">Memory</a></li>
          </ul>
          <div class="container-fluid">
          <div class="tab-content">
            <div role="tabpanel" id="search" class="tab-pane fade show active">
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
                          <Link to={'/create-predicate/'}>
                            <button class="btn btn-primary pull-right" >Create new predicate</button>
                          </Link>
                        </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="card-body text-center">
                  <ReactTable
                    data={this.state.predicates}
                    columns={columns}
                    defaultPageSize="15"
                    pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
                  />
                </div>
              </div>
            </div>
            <div role="tabpanel" id="memory" class="tab-pane fade text-center">
              <ReactTable
                data={global.wrapData('predicatePack',memoryPreds)}
                columns={columns2}
                defaultPageSize="15"
                pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
              />
            </div>
          </div>
          </div>


      </div>

    );
  }
}

export default withRouter(Predicates);
