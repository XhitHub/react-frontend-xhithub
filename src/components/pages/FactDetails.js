import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

import Fact from '../knowledge/Fact';

class FactDetails extends Component {
  constructor(props) {
      super(props);

      this.state = {
         factPack: undefined
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
        url: global.apiUrl + 'knowledge/fact/'+id,
        type: 'get',
        success: (data) => {
          this.setState({
            factPack: data
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
    var rp = this.state.factPack;

    if(rp){

      var controlButtons;
      if(global.getUserID() == rp.createdBy){
        controlButtons = (
          <div class="btn-group" role="group" aria-label="Add elements">
            <Link to={'/create-rule/edit/'+rp._id}><button class="btn btn-default" >Edit</button></Link>
            <button class="btn btn-danger" onClick={this.removePredicate.bind(this)}>Remove</button>
          </div>
        )
      }

      return (
        <div className="">
          <h1 class="text-center">Fact details</h1>
          <div class="text-center">
            {controlButtons}
          </div>
          <hr/ >
          <h3 class="text-center">Logical form</h3>
          <Fact fact={rp.fact} mode="READ-FOL"/>

          <hr />

          <div className="">
          <div className="col col-lg-12">
          <h3 class="text-center">Text form</h3>
          <p>{rp.info.textForm}</p>
          </div>
          </div>
        </div>

      );

    }
    else{
      return global.loading;
    }
  }
}

export default withRouter(FactDetails);
