import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import Formula from "./Formula";
import Fact from "./Fact";
import Predicate from './Predicate';
import PredicateSearch from "./PredicateSearch";
import PredicatePicker from "./PredicatePicker";
import SelectableList from "../general/SelectableList";
import KnowledgeGroupPicker from "../knowledge-group/KnowledgeGroupPicker";


class CreateFact extends Component {
  constructor(props) {
      super(props);

      this.state = {
         fact: {
         },
         textForm:''
      }
      this.addElement = this.addElement.bind(this);
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
           for(var k in elem.predicate){
             selectItem[k] = elem.predicate[k]
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
     this.removeElementRecursion(this.state.selectedItem,this.state.fact);
     this.setState({});
     console.log('this.state.fact',this.state.fact);
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
     if(!pred.parameters){
       pred.parameters = {}
     }
     pred.parameters[e.target.name] = e.target.value;
     this.setState({})
     console.log('this.state.fact',this.state.fact);
   }
   convertToLogicalForm(){

   }
   submit(){
     var factPack = {
       fact: this.state.fact,
       info:{
         textForm: this.state.textForm,
         knowledgeGroups: this.state.knowledgeGroups,
         string: global.formulaToString(this.state.fact)
       }
     };
     var opts = {
       url: global.apiUrl + 'knowledge/fact',
       type: 'post',
       success: (data) => {
         alert('Fact is created successfully.');
         this.props.history.push('/fact/'+data._id);
       },
       data: JSON.stringify(factPack)
     }
     global.simpleAjax(opts);
   }

  render() {
    var fact = this.state.fact;
    var memoryPredicatePacks = JSON.parse(localStorage.getItem('predicatesPacksPool'));
    return (
      <div className="col col-lg-12">
        <h1>Create / edit fact</h1>
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
                <button class="btn btn-primary" onClick={this.convertToLogicalForm.bind(this)}>Convert to logical form</button>
              </div>
            </div>
            <div role="tabpanel" id="logicForm" class="tab-pane fade">
              <div class="row">
              <div className="col col-md-4">
                <div className="card" id="rule-control-panel">
                  <div className="card-header">
                  Add element
                  </div>
                  <div className="card-body">
                    <p>Logical connectives</p>
                    <div class="btn-group" role="group" aria-label="Add elements">
                      <button class="btn btn-default" onClick={()=>{this.addElement({and: []})}}>AND</button>
                      <button class="btn btn-default" onClick={()=>{this.addElement({or: []})}}>OR</button>
                      <button class="btn btn-default" onClick={()=>{this.addElement({not: {}})}}>NOT</button>
                    </div>
                    <hr />
                    <p>Predicates</p>
                    <PredicatePicker onSelectItem={this.addElement.bind(this)} />
                    <hr />
                    <div className="col col-lg-12 text-center">
                      <button class="btn btn-danger" onClick={this.removeElement.bind(this)}>Remove element</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col col-md-8">
                <Fact fact={fact} onSelectItem={this.onSelectItem.bind(this) } mode="EDIT-FOL-VAR"  onVarChange={this.onVarChange.bind(this)}/>
              </div>

              </div>
            </div>
          </div>

      </div>
      <hr />
      <div className="col offset-lg-0 col-lg-12">
      <div class="form-group ">
        <label class="control-label " for="name">
         Knowledge groups this fact belongs to:
        </label>
        <KnowledgeGroupPicker onPickedGroupsChange={this.updateKnowledgeGroups.bind(this)} />
      </div>
      </div>
      <div className="col col-lg-12 text-center">
        <button class="btn btn-primary" onClick={this.submit.bind(this)}>Create fact</button>
      </div>
      </div>

    );
  }
}

export default CreateFact;
