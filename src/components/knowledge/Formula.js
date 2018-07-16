import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

import Predicate from './Predicate';

class Formula extends Component {
  constructor(props) {
      super(props);

      this.state = {
         stateField1: "stateField1 value"
      }
      this.selectItem = this.selectItem.bind(this)
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

   selectItem(item){
     console.log('selectItem item', item);
     if(item !== this.state.selectedItem){
       this.setState({
         selectedItem: item
       });
     }
     else{
       this.setState({
         selectedItem: undefined
       });
     }
     this.props.onSelectItem(item);
   }
   generateFormulaView(formula){
     var childrens = [];
     var view;
     var groups = ['and','or'];
     groups.forEach((group)=>{
       if(formula[group]){
         formula[group].forEach((item)=>{
           childrens.push(
             <li class="list-group-item">
             {this.generateFormulaView(item)}
             </li>
           );
         });
         var isSelected;
         if(formula === this.state.selectedItem){
           isSelected = 'selected'
         }
         var type = 'card-header pointer '+group+' '+isSelected;
         view = (
           <div class="card atomic-statement">
             <div class={type} onClick={()=>{this.selectItem(formula)}}>
               {group}
             </div>
             <div class="card-body">
               <ul class="list-group">
                 {childrens}
               </ul>
             </div>
           </div>
         )
       }
     });
     var groups = ['not'];
     groups.forEach((group)=>{
       if(formula[group]){
         var isSelected;
         if(formula === this.state.selectedItem){
           isSelected = 'selected'
         }
         var type = 'card-header pointer '+group+' '+isSelected;
         view = (
           <div class="card atomic-statement">
             <div class={type} onClick={()=>{this.selectItem(formula)}}>
               {group}
             </div>
             <div class="card-body">
               {this.generateFormulaView(formula[group])}
             </div>
           </div>
         )
       }
     });
     if(global.isPredicate(formula)){
       var isSelected;
       if(formula === this.state.selectedItem){
         isSelected = 'selected'
       }
       var className = "col col-lg-12" +' '+ isSelected;
       view = (
         <div className={className} onClick={()=>{this.selectItem(formula)}}>
           <Predicate predicate={formula} mode={this.props.mode} onVarChange={this.props.onVarChange}/>
         </div>
       )
     }
     if(!view){
       view = (
         <div>

         </div>
       );
     }
     return view;
   }

  render() {
    var view = this.generateFormulaView(this.props.formula);
    return view;
  }
}

export default Formula;
