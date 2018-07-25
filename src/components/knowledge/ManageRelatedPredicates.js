import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

import ReactTable from "react-table";
import 'react-table/react-table.css';

import PredicatePack from './PredicatePack';
import Predicate from './Predicate';
import PredicatePicker from "./PredicatePicker";

var Combinatorics = require('js-combinatorics');


class ManageRelatedPredicates extends Component {
  constructor(props) {
      super(props);

      this.state = {
         predicatePack: null,
         relatedPredicates: null,
         relatedPredicatePacks: [],
         unrelatedPredicatePacks: [],
         oldId: null
      }
      this.addRelatedPredicate = this.addRelatedPredicate.bind(this)
      this.addUnrelatedPredicate = this.addUnrelatedPredicate.bind(this)
      this.removeRelatedPredicate = this.removeRelatedPredicate.bind(this)
      this.removeUnrelatedPredicate = this.removeUnrelatedPredicate.bind(this)
      this.findExtraRelatedPredicates = this.findExtraRelatedPredicates.bind(this)
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
          this.findExtraRelatedPredicates();
        }
      }
      global.simpleAjax(opts);
      var opts2 = {
        url: global.apiUrl + 'knowledge/get-related-predicates-by-id/'+pid,
        type: 'get',
        success: (data) => {
          this.setState({
            relatedPredicatePacks: data.relatedPredicatePacks,
            unrelatedPredicatePacks: data.unrelatedPredicatePacks,
            oldId: data._id
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

   findExtraRelatedPredicates(){
     var pid = this.props.match.params.id;
     var predPack = this.state.predicatePack;
     var allSynonymsList = predPack.altFormInfo.allSynonymsList;
     var powerset = Combinatorics.power(allSynonymsList);
     powerset = powerset.filter((item)=>{
       return item.length >= allSynonymsList.length - 1;
     })
     // powerset = [allSynonymsList]
     powerset.forEach(set=>{
       var opts = {
         url: global.apiUrl + 'knowledge/search-b-model-rule',
         type: 'post',
         success: (data) => {
           console.log('findExtraRelatedPredicates',data)
           data.forEach(rule=>{
             var opts2 = {
               url: global.apiUrl + 'knowledge/get-predicate-alternative-forms-by-synonyms',
               type: 'post',
               data: JSON.stringify(
                 {
                   synonyms: rule.rhs,
                   passCount: rule.rhs.length
                 }
               ),
               success: (relatedPredicatePacks) => {
                 var relatedPredicatesList = this.state.relatedPredicatesList
                 if(relatedPredicatePacks.length > 0){
                   relatedPredicatePacks.forEach((relatedPredicatePack)=>{
                     // var obj = {
                     //   relatedPredicatePack: relatedPredicatePack,
                     //   matchCount: words.length
                     // }
                     relatedPredicatePack.matchCount = rule.rhs.length
                     if(
                       relatedPredicatePack._id != pid
                       &&
                       !relatedPredicatesList.find((item)=>{
                         return item._id == relatedPredicatePack._id;
                       })
                     ){
                       relatedPredicatesList.push(relatedPredicatePack);
                     }
                   })
                 }
                 relatedPredicatesList.sort((a,b)=>{
                   return -( a.matchCount - b.matchCount );
                 })
                 this.setState({
                 });
               }
             }
             global.simpleAjax(opts2);
           })
         },
         data: JSON.stringify({
           "synonyms": set
         })
       }
       global.simpleAjax(opts);
     })
   }

   findRelatedPredicatesFunction(words, allSynonymsDict){
     var pid = this.props.match.params.id;
     var relatedPreds = [];
     var relatedPredsList = [];
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
             // var obj = {
             //   relatedPredicatePack: relatedPredicatePack,
             //   matchCount: words.length
             // }
             relatedPredicatePack.matchCount = words.length
             if(
               relatedPredicatePack._id != pid
               &&
               !relatedPredsList.find((item)=>{
                 return item._id == relatedPredicatePack._id;
               })
             ){
               relatedPredsList.push(relatedPredicatePack);
             }
           })
           relatedPreds.push(relatedPredsItem);
         }
         relatedPredsList.sort((a,b)=>{
           return -( a.matchCount - b.matchCount );
         })
         this.setState({
           relatedPredicates: relatedPreds,
           relatedPredicatesList: relatedPredsList
         });
       }
     }
     global.simpleAjax(opts);
   }

   findRelatedPredicates(){
     var pid = this.props.match.params.id;
     var predPack = this.state.predicatePack;
     var allSynonymsDict = predPack.altFormInfo.allSynonymsDict;
     var predWords = [];
     for (var k in allSynonymsDict){
       predWords.push(k);
     }
     var predWordsPowerSet = Combinatorics.power(predWords);
     console.log('predWordsPowerSet',predWordsPowerSet);
     // TODO: filter powersets, no too small ones
     predWordsPowerSet = predWordsPowerSet.filter((item)=>{
       return item.length > 0;
     })
     predWordsPowerSet.sort((a,b)=>{
       return -( a.length - b.length )
     })
     predWordsPowerSet.forEach((words) => {
      this.findRelatedPredicatesFunction(words, allSynonymsDict)
     })
   }

   togglePredicateIsRelated(predPack){
     predPack.isRelated = !predPack.isRelated;
     this.setState({});
   }

   addExtraRelatedPredicate(predPack){
     console.log('addRelatedPredicate predPack',predPack)
     predPack.isExtra = true
     var rpps = this.state.relatedPredicatePacks;
     if(!rpps.find(rpp=>{
       return rpp._id == predPack._id
     })){
       rpps.push(predPack)
     }
     this.setState({
       relatedPredicatePacks:rpps
     })
   }

   addRelatedPredicate(predPack){
     console.log('addRelatedPredicate predPack',predPack)
     predPack.isExtra = false
     var rpps = this.state.relatedPredicatePacks;
     if(!rpps.find(rpp=>{
       return rpp._id == predPack._id
     })){
       rpps.push(predPack)
     }
     this.setState({
       relatedPredicatePacks:rpps
     })
   }

   addUnrelatedPredicate(predPack){
     console.log('addRelatedPredicate predPack',predPack)
     predPack.isExtra = false
     var rpps = this.state.unrelatedPredicatePacks;
     if(!rpps.find(rpp=>{
       return rpp._id == predPack._id
     })){
       rpps.push(predPack)
     }
     this.setState({
       unrelatedPredicatePacks:rpps
     })
   }

   removeRelatedPredicate(predPack){
     var rpps = this.state.relatedPredicatePacks;
     rpps = rpps.filter(pp=>{
       return pp._id != predPack._id
     })
     this.setState({
       relatedPredicatePacks:rpps
     })
   }

   removeUnrelatedPredicate(predPack){
     var rpps = this.state.unrelatedPredicatePacks;
     rpps = rpps.filter(pp=>{
       return pp._id != predPack._id
     })
     this.setState({
       unrelatedPredicatePacks:rpps
     })
   }

   confirmRelatedPredicates(){
     var pack = {
       predicatePack: this.state.predicatePack,
       relatedPredicatePacks: this.state.relatedPredicatePacks,
       unrelatedPredicatePacks: this.state.unrelatedPredicatePacks
     }
     if(this.state.oldId){
       pack._id = this.state.oldId;
     }
     var opts = {
       url: global.apiUrl + 'knowledge/upsert-related-predicates',
       type: 'post',
       success: (data) => {
         var rpps = [this.state.predicatePack]
         rpps = rpps.concat(this.state.relatedPredicatePacks)
         if(data){
           alert('Related predicates updated.')
           localStorage.setItem('relatedPredicatePacks',JSON.stringify(rpps));
           this.props.history.push('/create-rule/connect-related-predicates');
         }
       },
       data: JSON.stringify(pack)
     }
     global.simpleAjax(opts);

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
          var pred = obj.predicate;
          var btn;
          if(obj.isRelated){
            btn = (
              <input type="button" class="btn btn-success" value="Is related" onClick={()=>{this.togglePredicateIsRelated(obj)}} />
            )
          }
          else{
            btn = (
              <input type="button" class="btn btn-fail" value="Not related" onClick={()=>{this.togglePredicateIsRelated(obj)}} />
            )
          }
          relatedPredsViewItems.push(
            <li class="list-group-item">
            <div className="row">
              <div class="col-md-9">
              <Predicate predicate={pred} mode="READ-FOL" />
              </div>
              <div class="col-md-3">
                <input type="button" class="btn btn-danger" value="Not related" onClick={()=>{this.addUnrelatedPredicate(obj)}} />
                <input type="button" class="btn btn-success" value="Is related" onClick={()=>{this.addRelatedPredicate(obj)}} />
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
    const columnsR = [
      {
        Header: 'Predicate',
        accessor: 'pack', // String-based value accessors!
        Cell: props =>
          <div class="">
            <Predicate predicate={props.value.predicate} mode="READ-FOL" />
          </div>
      },
      {
        Header: 'Remove',
        accessor: 'pack',
        Cell: props => <i className='fa fa-times pointer' onClick={(()=>{this.removeRelatedPredicate(props.value)})}></i> // Custom cell components!
      }
    ];
    const columnsUNR = [
      {
        Header: 'Predicate',
        accessor: 'pack', // String-based value accessors!
        Cell: props =>
          <div class="">
            <Predicate predicate={props.value.predicate} mode="READ-FOL" />
          </div>
      },
      {
        Header: 'Remove',
        accessor: 'pack',
        Cell: props => <i className='fa fa-times pointer' onClick={(()=>{this.removeUnrelatedPredicate(props.value)})}></i> // Custom cell components!
      }
    ];
    return (
      <div className="col col-lg-12">
        <h1 class="text-center">Manage related predicates</h1>
        <h4 class="text-center">for</h4>
        <h3 class="text-center">{predicateInfo}</h3>

        <hr />
        <div class="row text-center">
          <div class="col-lg-6">
            <h4>Related predicates</h4>
            <ReactTable
              data={global.wrapData('pack',this.state.relatedPredicatePacks)}
              columns={columnsR}
              defaultPageSize="10"
              pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
            />
          </div>
          <div class="col-lg-6">
            <h4>unrelated predicates</h4>
            <ReactTable
              data={global.wrapData('pack',this.state.unrelatedPredicatePacks)}
              columns={columnsUNR}
              defaultPageSize="10"
              pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
            />
          </div>
        </div>
        <hr />
        <div className="col col-lg-12 text-center">
          <button class="btn btn-primary" onClick={this.confirmRelatedPredicates.bind(this)}>Confirm related predicates</button>
        </div>
        <hr />
        <h4>Potentially related predicates</h4>
        {relatedPredicatesView}
        <hr />
        <h4>Pick related predicates we did not think of</h4>
        <PredicatePicker mode="" onSelectItem={this.addExtraRelatedPredicate.bind(this)} />
      </div>

    );
  }
}

export default withRouter(ManageRelatedPredicates);
