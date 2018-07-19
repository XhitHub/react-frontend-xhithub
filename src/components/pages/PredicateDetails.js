import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

import Predicate from '../knowledge/Predicate';

class PredicateDetails extends Component {
  constructor(props) {
      super(props);

      this.state = {
         predicatePack: undefined
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
      var id = this.props.match.params.id;
      var opts = {
        url: global.apiUrl + 'knowledge/predicate/'+id,
        type: 'get',
        success: (data) => {
          this.setState({
            predicatePack: data
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

   removePredicate(){
     // var yes = confirm("Remove this predicate?");
     // if(yes){
     //
     // }
   }
  render() {
    var pp = this.state.predicatePack;

    if(pp){
      var synsCards = [];
      var asd = pp.altFormInfo.allSynonymsDict;
      for(var k in asd){
        var synViews = [];
        asd[k].forEach(syn=>{
          synViews.push(
            <li class="list-group-item">
              {syn}
            </li>
          )
        })
        synsCards.push(
          <div className="col col-lg-3">
            <div className="card">
              <div className="card-header">
                {k}
              </div>
              <div className="card-body">
              <ul class="list-group">
                {synViews}
              </ul>
              </div>
            </div>
          </div>

        )
      }
      var controlButtons;
      if(global.getUserID() == pp.createdBy){
        controlButtons = (
          <div class="btn-group" role="group" aria-label="Add elements">
            <Link to={'/manage-related-predicates/'+pp._id}><button class="btn btn-primary" >Manage related predicates</button></Link>
            <Link to={'/create-predicate/edit/'+pp._id}><button class="btn btn-default" >Edit</button></Link>
            <button class="btn btn-danger" onClick={this.removePredicate.bind(this)}>Remove</button>
          </div>
        )
      }
      else{
        controlButtons = (
          <div class="btn-group" role="group" aria-label="Add elements">
            <Link to={'/manage-related-predicates/'+pp._id}><button class="btn btn-primary" >Manage related predicates</button></Link>
          </div>
        )
      }

      return (
        <div className="">
          <h3 class="text-center predicate-details-title"><Predicate predicate={pp.predicate} mode="READ-FOL"/></h3>
          <div class="text-center">
            <p>{pp.info.description}</p>
          </div>
          <div class="text-center">
            {controlButtons}
          </div>
          <hr />
          <p>Selected synonyms:</p>
          <div className="row">
          {synsCards}
          </div>
        </div>

      );

    }
    else{
      return global.loading;
    }
  }
}

export default withRouter(PredicateDetails);
