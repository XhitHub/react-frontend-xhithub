import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

import Rule from '../knowledge/Rule';

class RuleDetails extends Component {
  constructor(props) {
      super(props);

      this.state = {
         rulePack: undefined
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
        url: global.apiUrl + 'knowledge/rule/'+id,
        type: 'get',
        success: (data) => {
          this.setState({
            rulePack: data
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
    var rp = this.state.rulePack;

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
          <h1 class="text-center">Rule details</h1>
          <div class="text-center">
            {controlButtons}
          </div>
          <hr/ >
          <h3 class="text-center">Logical form</h3>
          <div className="col offset-lg-2 col-lg-8">
            <Rule rule={rp.rule} mode="READ-FOL" onSelectItem={(item)=>{}} />
          </div>

          <hr />

          <div className="row">
          <div className="col offset-lg-2 col-lg-8">
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

export default withRouter(RuleDetails);
