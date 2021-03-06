import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import Formula from "./Formula";
import Rule from "./Rule";
import Predicate from './Predicate';
import PredicateSearch from "./PredicateSearch";
import PredicatePicker from "./PredicatePicker";
import SelectableList from "../general/SelectableList";
import MachineLearning from "../general/MachineLearning";
import KnowledgeGroupPicker from "../knowledge-group/KnowledgeGroupPicker";


class CreateRule extends Component {
  constructor(props) {
      super(props);
      var rule = {
        lhs:{

        },
        rhs:{

        }
      }
      // rule = {
      //   lhs:{
      //     text: 'shoots well',
      //     arguments: ['human'],
      //     variables: {
      //       human: '_player'
      //     }
      //   },
      //   rhs:{
      //     text: 'goals',
      //     arguments: ['player']
      //   }
      // }
      this.state = {
         rule: rule,
         textForm:'',
         selectedItem: rule.lhs
      }
      this.addElement = this.addElement.bind(this);
      this.machineLearning = new MachineLearning();
      this.analyzeTextLogicalFormRelationship = this.analyzeTextLogicalFormRelationship.bind(this)
   }

   handleChange(e){
     global.handleInputChange(this,e);
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
   onSelectItem(item){
     console.log('onSelectItem item', item);
     this.setState({
       selectedItem: item
     })
   }
   addElement(elem){
     console.log('addElement elem',elem);
     if(elem.predicate){
       elem = elem.predicate;
     }
     var selectItem = this.state.selectedItem;
     if(selectItem){
       if(selectItem.and){
         selectItem.and.push(elem);
         this.setState({});
       }
       else if(selectItem.or){
         selectItem.or.push(elem);
         this.setState({});
       }
       else if(selectItem.not){
         selectItem.not = elem;
         this.setState({});
       }
       else{
         if(!(selectItem.and || selectItem.or || selectItem.not)){
           for(var k in elem){
             selectItem[k] = elem[k]
           }
           this.setState({});
         }
       }
     }
   }
   removeElementRecursion(target,formula){
     if(target === formula){
       for(var k in formula){
         formula[k] = undefined
       }
     }
     var arr;
     if(formula.and){
       arr = formula.and;
       if(target === formula.and){
         formula.and = undefined;
       }
     }
     if(formula.or){
       arr = formula.or;
       if(target === formula.or){
         formula.or = undefined;
       }
     }
     if(arr){
       var index = arr.indexOf(target);
        if (index > -1) {
          arr.splice(index, 1);
        }
        arr.forEach((item)=>{
          this.removeElementRecursion(target,item);
        });
     }
     if(formula.not){
       this.removeElementRecursion(target,formula.not);
     }
   }
   removeElement(){
     this.removeElementRecursion(this.state.selectedItem,this.state.rule.lhs);
     this.removeElementRecursion(this.state.selectedItem,this.state.rule.rhs);
     this.setState({});
     console.log('this.state.rule',this.state.rule);
   }
   updateKnowledgeGroups(groups){
     var arr = [];
     groups.forEach(
       (g)=>{
         arr.push(g._id)
       }
     )
     this.state.knowledgeGroups = arr;
     this.setState({})
   }
   onVarChange(e,pred){
     if(!pred.variables){
       pred.variables = {}
     }
     pred.variables[e.target.name] = e.target.value;
     this.setState({})
     console.log('this.state.rule',this.state.rule);
   }
   convertToLogicalForm(){
     var opts = {
       url: global.apiUrl + 'knowledge/get-parse-tree',
       type: 'post',
       success: (data) => {
         console.log('parse tree',data)
         var parseTree = data[0].data
         var textlessTree = this.machineLearning.getTextTrimmedTree(parseTree)
         var searchString = JSON.stringify(textlessTree)
         console.log('convertToLogicalForm searchString',searchString);
         // search for fitting ttr rules
         var opts2 = {
           url: global.apiUrl + 'knowledge/search-text-to-rule-rule',
           type: 'post',
           success: (data) => {
             console.log('search-text-to-rule-rule',data)
             var ttrRule = data[0]
             if(ttrRule){
               var reversedRule = this.machineLearning.getArgsReversedRule(parseTree,ttrRule);
               alert('Text form is converted to logical form.')
               this.setState({
                 rule: reversedRule
               })
             }
             else{
               alert('Sorry, system does not recognize such text form. Please input the logical form to train system for this text form.')
             }
           },
           data: JSON.stringify({
             "searchString": searchString
           })
         }
         global.simpleAjax(opts2);
       },
       data: JSON.stringify({
         "text": this.state.textForm
       })
     }
     global.simpleAjax(opts);
   }
   analyzeTextLogicalFormRelationship(){
     this.machineLearning.argizeTreeRule(this.state.parseTree, this.state.rule)
     console.log('argizeTreeRule')
     console.log('this.state.parseTree',this.state.parseTree);
     console.log('this.state.rule',this.state.rule);
     var trainingPair = {
       textForm: JSON.stringify(this.state.parseTree),
       logicalForm: JSON.stringify(this.state.rule)
     }
     alert('Text to logical form training record is created successfully.');
     console.log('trainingPair', trainingPair);
     var opts = {
       url: global.apiUrl + 'knowledge/text-logical-pair',
       type: 'post',
       success: (data) => {
         console.log('analyzeTextLogicalFormRelationship post data',data)
         this.props.history.push('/rule/'+data._id);
       },
       data: JSON.stringify(trainingPair)
     }
     global.simpleAjax(opts);
   }
   submit(){
     var uniqueCheckString = global.ruleToString(this.state.rule,'unique')
     console.log('uniqueCheckString',uniqueCheckString)
     var mode = this.props.match.params.mode;
     var knowledgeGroups;
     if(mode == 'connect-related-predicates'){
       knowledgeGroups = ['related-predicates-rules'];
     }
     else{
       knowledgeGroups = this.state.knowledgeGroups;
     }
     var rulePack = {
       rule: this.state.rule,
       info:{
         textForm: this.state.textForm,
         knowledgeGroups: knowledgeGroups,
         string: global.ruleToString(this.state.rule),
         uniqueCheckString: uniqueCheckString
       }
     };

     var opts2 = {
       url: global.apiUrl + 'knowledge/check-rule-uniqueness',
       type: 'post',
       success: (data) => {
         if(data.length == 0){
           var opts = {
             url: global.apiUrl + 'knowledge/rule',
             type: 'post',
             success: (data) => {
               alert('Rule is created successfully.');
               if(mode == 'connect-related-predicates'){
                 this.setState(
                   {
                      rule: {
                        lhs:{

                        },
                        rhs:{

                        }
                      },
                      textForm:''
                   }
                 )
               }
               else{
                 //create text to logical training record
                 var opts2 = {
                   url: global.apiUrl + 'knowledge/get-parse-tree',
                   type: 'post',
                   success: (data) => {
                     console.log('parse tree',data)
                     this.setState({
                       parseTree: data[0].data
                     });
                     this.analyzeTextLogicalFormRelationship();
                   },
                   data: JSON.stringify({
                     "text": this.state.textForm
                   })
                 }
                 global.simpleAjax(opts2);
               }
             },
             data: JSON.stringify(rulePack)
           }
           global.simpleAjax(opts);
         }
         else{
           alert('This rule duplicates with an existing rule. It will not be created.');
         }
       },
       data: JSON.stringify({
         uniqueCheckString: uniqueCheckString
       })
     }
     global.simpleAjax(opts2);


   }

  render() {
    var mode = this.props.match.params.mode;
    var rule = this.state.rule;
    var memoryPredicatePacks = JSON.parse(localStorage.getItem('predicatesPacksPool'));
    var title;
    var knowledgeGroupSection;
    var connectiveBtns;
    if(mode == 'connect-related-predicates'){
      title = 'Create conversion rules for related predicates'
    }
    else{
      title = 'Create / edit rule'
      knowledgeGroupSection = (
        <div className="col offset-lg-0 col-lg-12">
        <div class="form-group ">
          <label class="control-label " for="name">
           Knowledge groups this rule belongs to:
          </label>
          <KnowledgeGroupPicker onPickedGroupsChange={this.updateKnowledgeGroups.bind(this)} />
        </div>
        </div>
      )
    }
    if(this.state.selectedItem != rule.rhs){
      connectiveBtns = (
        <div>
          <p>Logical connectives</p>
          <div class="btn-group" role="group" aria-label="Add elements">
            <button class="btn btn-default" onClick={()=>{this.addElement({and: []})}}>AND</button>
            <button class="btn btn-default" onClick={()=>{this.addElement({or: []})}}>OR</button>
            <button class="btn btn-default" onClick={()=>{this.addElement({not: {}})}}>NOT</button>
          </div>
          <hr />
        </div>
      )
    }
    return (
      <div className="col col-lg-12">
        <h1>{title}</h1>
          <ul class="nav nav-tabs">
            <li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#textForm">Step 1: Text form</a></li>
            <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#logicForm">Step 2: Logical form</a></li>
          </ul>
          <div class="container-fluid">
          <div class="tab-content">
            <div role="tabpanel" id="textForm" class="tab-pane fade show active">
              <div class="form-group ">
               <label class="control-label " for="message">
                Describe the rule in text:
               </label>
               <textarea class="form-control text-form" cols="40" id="message" name="textForm" rows="20" onChange={this.handleChange.bind(this)}></textarea>

              </div>
              <div className="col col-lg-12 text-center">
                <button class="btn btn-default" onClick={this.convertToLogicalForm.bind(this)}>Convert to logical form</button>
              </div>
              {
              // <div className="col col-lg-12 text-center">
              //   <button class="btn btn-default" onClick={this.analyzeTextLogicalFormRelationship.bind(this)}>Analyze</button>
              // </div>
              }
            </div>
            <div role="tabpanel" id="logicForm" class="tab-pane fade">
              <div class="row">
              <div className="col col-md-4">
                <div className="card" id="rule-control-panel">
                  <div className="card-header">
                  Add element
                  </div>
                  <div className="card-body">
                    {connectiveBtns}
                    <p>Predicates</p>
                    <PredicatePicker mode={mode} onSelectItem={this.addElement.bind(this)} />
                    <hr />
                    <div className="col col-lg-12 text-center">
                      <button class="btn btn-danger" onClick={this.removeElement.bind(this)}>Remove element</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col col-md-8">
                <h4>The rule:</h4>
                <Rule rule={rule} selectedItem={this.state.selectedItem} onSelectItem={this.onSelectItem.bind(this) } mode="EDIT-FOL-VAR"  onVarChange={this.onVarChange.bind(this)}/>
                <hr />
                <p>Use "_" or uppercase 1st letter to indicate a term as a variable</p>
              </div>

              </div>
            </div>
          </div>

      </div>
      <hr />
      {knowledgeGroupSection}
      <div className="col col-lg-12 text-center">
        <button class="btn btn-primary" onClick={this.submit.bind(this)}>Create rule</button>
      </div>
      </div>

    );
  }
}

export default CreateRule;
