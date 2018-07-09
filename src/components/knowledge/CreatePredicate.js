import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Binder from 'react-binding';

import Predicate from './Predicate';

class CreatePredicate extends Component {
  constructor(props) {
      super(props);

      var predicatePack;
      if(this.props.predicatePack){
        predicatePack = this.props.predicatePack;
      }
      else{
        predicatePack = {
          "predicate": {
            "text": "",
            "arguments": [
            ]
          },
          "info": {
            "description": "",
            "tags": [
            ],
            "knowledgeGroups": [
            ]
          }
        };
      }

      this.state = {
         predicatePack: predicatePack
      }
   }

   handleChange(e){
     global.handleInputChange(this,e);
   }

   handle1NestedChange(e,obj){
     global.handleInputChangeNested(this,obj,e)
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

   updateInfo(e){
     var info = this.state.predicatePack.info;
     info[e.target.name] = e.target.value;
     this.setState(
       {
         info: info
       }
     );
   }

   updatePredicate(e){
     var predicate = this.state.predicatePack.predicate;
     predicate[e.target.name] = e.target.value;
     this.setState(
       {
         predicate: predicate
       }
     );
   }

   updateTerms(e){
     const args = e.target.value.split(/,/);
     console.log('updateTerms args',args)
     var predicate = this.state.predicatePack.predicate;
     predicate.arguments = args;
     this.setState(
       {
         predicate: predicate
       }
     );
   }

   getSynonyms(){
     var opts = {
       url: global.apiUrl + 'knowledge/get-stem-synonyms',
       type: 'post',
       success: (data) => {
         var altFormInfo = data[0].data;
         var dict = {}

         this.setState({
           altFormInfo: altFormInfo
         });
       },
       data: JSON.stringify(this.state.predicatePack.predicate)
     }
     global.simpleAjax(opts);
   }

  render() {
    var pp = this.state.predicatePack;

    var synonymsSection;
    if(this.state.altFormInfo){
      var ts = this.state.altFormInfo.textSynonyms
      var synViews = [];
      for (var key in ts) {
          if (ts.hasOwnProperty(key)) {
              var arr = ts[key]
              var keySynViews = []
              arr.forEach((syn) => {
                keySynViews.push(
                  <tr>
                    <td>{syn.name.split('.')[0]}</td>
                    <td>{syn.name.split('.')[1]}</td>
                    <td>{syn.definition}</td>
                    <td>
                    <input type="check" />
                    </td>
                  </tr>
                )
              });
              synViews.push(
                <div class="card">
                  <div class="card-header">
                  {key}
                  </div>
                  <div class="card-body">
                    <table class="table">
                      {keySynViews}
                    </table>
                  </div>
                </div>
              )
          }
      }
      synonymsSection = (
        <div className="row">
        <div className="col col-lg-12">
        <h3>
        Pick fitting synonyms
        </h3>
        </div>
        {synViews}
        </div>
      )
    }

    return (
      <div className="col col-lg-12">
        <h1>Create predicate</h1>
        <div className="row">
          <div class="col-md-6 col-sm-6 col-xs-12">

               <div class="form-group ">
                <label class="control-label " for="message">
                 Predicate sentence / function name
                </label>
                <textarea class="form-control" cols="40" id="message" name="text" rows="10" onChange={this.updatePredicate.bind(this)}></textarea>
               </div>

               <div class="form-group ">
                 <label class="control-label " for="name">
                  Terms / arguments
                 </label>
                 <input class="form-control" id="name" name="name" type="text" onChange={this.updateTerms.bind(this)}/>
              </div>


           </div>
           <div class="col-md-6 col-sm-6 col-xs-12">
              <div class="card">
              <div className="card-header">
                Preview
              </div>
              <div className="card-body">
              <Predicate
                predicate={pp.predicate}
                mode="READ-EXPERT"
                readOnly="true"
              />
              </div>
              </div>
           </div>
         </div>
         <div className="col col-lg-12 text-center">
         <button id="singlebutton" name="singlebutton" class="btn btn-primary" onClick={this.getSynonyms.bind(this)}>Proceed</button>
         </div>

         {synonymsSection}

         <div className="row">
         <div className="col col-lg-12">
         <div class="form-group ">
          <label class="control-label " for="message">
           Description
          </label>
          <textarea class="form-control" cols="40" id="message" name="description" rows="10" onChange={this.updateInfo.bind(this)}></textarea>
         </div>
         </div>
         </div>



        <div className="col col-lg-12">
        </div>
      </div>

    );
  }
}

export default CreatePredicate;
