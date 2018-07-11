import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import PredicatePack from './PredicatePack';
import Predicate from './Predicate';

var Combinatorics = require('js-combinatorics');


class ManageRelatedPredicates extends Component {
  constructor(props) {
      super(props);

      this.state = {
         predicatePack: null,
         relatedPredicates: null
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
      var pid = this.props.match.params.id;
      var opts = {
        url: global.apiUrl + 'knowledge/predicate/'+pid,
        type: 'get',
        success: (data) => {
          this.setState({
            predicatePack: data
          });
          this.findRelatedPredicates();
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

   findRelatedPredicates(){
     var predPack = this.state.predicatePack;
     var allSynonymsDict = predPack.altFormInfo.allSynonymsDict;
     var predWords = [];
     for (var k in allSynonymsDict){
       predWords.push(k);
     }
     var predWordsPowerSet = Combinatorics.power(predWords);
     console.log('predWordsPowerSet',predWordsPowerSet);
     // TODO: filter powersets, no too small ones
     var relatedPreds = [];
     var relatedPredsList = [];
     predWordsPowerSet = predWordsPowerSet.filter((item)=>{
       return item.length > 0;
     })
     predWordsPowerSet.forEach((words) => {
       var wordsSyns = [];
       words.forEach((word)=>{
         var syns = allSynonymsDict[word];
         wordsSyns = wordsSyns.concat(syns);
       });
       console.log('wordsSyns',wordsSyns);
       // search with the syns
       var opts = {
         url: global.apiUrl + 'knowledge/get-predicate-alternative-forms-by-synonyms',
         type: 'post',
         data: JSON.stringify(
           {
             synonyms: wordsSyns,
             passCount: words.length
           }
         ),
         success: (data) => {
           if(data.length > 0){
             var relatedPredsItem = {
               words: words,
               relatedPredicates: data
             }
             data.forEach((relatedPredicatePack)=>{
               var obj = {
                 relatedPredicatePack: relatedPredicatePack,
                 matchCount: words.length
               }
               if(!relatedPredsList.find((item)=>{
                 return item.relatedPredicatePack._id == relatedPredicatePack._id;
               })){
                 relatedPredsList.push(obj);
               }
             })
             relatedPreds.push(relatedPredsItem);
           }
           relatedPredsList.sort((a,b)=>{
             return a.matchCount - b.matchCount;
           })
           this.setState({
             relatedPredicates: relatedPreds,
             relatedPredicatesList: relatedPredsList
           });
         }
       }
       global.simpleAjax(opts);
     })
   }

   togglePredicateIsRelated(pred){
     pred.isRelated = !pred.isRelated;
     this.setState({});
   }

  render() {
    var predicateInfo;
    var relatedPredicatesView;
    var relatedPreds = this.state.relatedPredicates;
    var relatedPredsList = this.state.relatedPredicatesList;
    console.log('relatedPreds',relatedPreds);
    if(this.state.predicatePack){
      predicateInfo = (
        <div className="col col-lg-12">
          <Predicate predicate={this.state.predicatePack.predicate} mode="READ-FOL" />
          <div className="col col-lg-12">

          </div>
        </div>
      )
    }
    if(relatedPreds){
      console.log('relatedPreds',relatedPreds);
      if(relatedPredsList.length > 0 ){
        var relatedPredsViewItems = [];
        relatedPredsList.forEach((obj)=>{
          var pred = obj.relatedPredicatePack.predicate;
          var btn;
          if(pred.isRelated){
            btn = (
              <input type="button" class="btn btn-success" value="Is related" onClick={()=>{this.togglePredicateIsRelated(pred)}} />
            )
          }
          else{
            btn = (
              <input type="button" class="btn btn-fail" value="Not related" onClick={()=>{this.togglePredicateIsRelated(pred)}} />
            )
          }
          relatedPredsViewItems.push(
            <li class="list-group-item">
            <div className="row">
              <div class="col-md-9">
              <Predicate predicate={pred} mode="READ-FOL" />
              </div>
              <div class="col-md-3">
              {btn}
              </div>
            </div>
            </li>
          )
        });
        relatedPredicatesView = (
          <div className="col col-lg-12">
            <ul class="list-group">
              {relatedPredsViewItems}
            </ul>
          </div>
        )
      }
      else{
        relatedPredicatesView = (
          <div className="col col-lg-12">
            No related predicates were found.
          </div>
        )
      }
    }
    return (
      <div className="col col-lg-12">
        <h1>Manage related predicates</h1>
        <h4>The predicate:</h4>
        {predicateInfo}
        <hr />
        <h4>Potential related predicates</h4>
        {relatedPredicatesView}
      </div>

    );
  }
}

export default ManageRelatedPredicates;
