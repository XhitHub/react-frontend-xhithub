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
import PrologMaker from "../general/PrologMaker";


class FactBuilder extends Component {
  constructor(props) {
      super(props);
      var fact = {}
      this.state = {
         fact: fact,
         textForm:'',
         selectedItem: fact
      }
      this.addElement = this.addElement.bind(this);
      this.prologMaker = new PrologMaker();

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
     this.props.updateFact(this.state.fact);
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
     this.props.updateFact(this.state.fact);
     console.log('this.state.fact',this.state.fact);
   }
   onVarChange(e,pred){
     // if(!pred.parameters){
     //   pred.parameters = {}
     // }
     // pred.parameters[e.target.name] = e.target.value;

     if(!pred.variables){
       pred.variables = {}
     }
     pred.variables[e.target.name] = e.target.value;

     this.setState({})
     this.props.updateFact(this.state.fact);
     console.log('this.state.fact',this.state.fact);
   }
   convertToLogicalForm(){

   }

  render() {
    var fact = this.state.fact;
    var memoryPredicatePacks = JSON.parse(localStorage.getItem('predicatesPacksPool'));
    return (
      <div className="col col-lg-12">
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
                    {
                      //<button class="btn btn-default" onClick={()=>{this.addElement({not: {}})}}>NOT</button>
                    }
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
              <h4>{this.props.factName}</h4>
              <Fact fact={fact} selectedItem={this.state.selectedItem} onSelectItem={this.onSelectItem.bind(this) } mode="EDIT-FOL-VAR"  onVarChange={this.onVarChange.bind(this)}/>
            </div>
          </div>


      </div>

    );
  }
}

export default FactBuilder;
