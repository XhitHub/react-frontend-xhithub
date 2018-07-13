import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import Formula from "./Formula";
import Rule from "./Rule";

class CreateRule extends Component {
  constructor(props) {
      super(props);

      this.state = {
         rule: {
           lhs:{
             and:[
               {
                 text: 'goes to',
                 arguments: [
                   'home', 'school'
                 ]
               },
               {
                 text: 'back to',
                 arguments: [
                   'home', 'school'
                 ]
               },
               {
                 or:[
                   {
                     not: {
                       and:[
                         {
                           text: 'goes to',
                           arguments: [
                             'home', 'school'
                           ]
                         }
                       ]

                     }
                   }

                 ]
               }

             ]
           },
           rhs:{

           }
         }
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
  render() {
    var rule = this.state.rule;
    return (
      <div className="col col-lg-12">
        <h1>Create edit rule</h1>
        <div class="row">

        <div className="col col-md-3">
          <div className="card">
            <div className="card-header">
            Control panel
            </div>
            <div className="card-body">
            <p>Click to add elements</p>
            <div class="btn-group" role="group" aria-label="Add elements">
              <button class="btn btn-default" onClick={()=>{this.addElement({and: []})}}>AND</button>
              <button class="btn btn-default" onClick={()=>{this.addElement({or: []})}}>OR</button>
              <button class="btn btn-default" onClick={()=>{this.addElement({not: {}})}}>NOT</button>
            </div>
              <hr />
              <div className="col col-lg-12 text-center">
                <button class="btn btn-danger" onClick={this.removeElement.bind(this)}>Remove</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col col-md-9">
          <Rule rule={rule} onSelectItem={this.onSelectItem.bind(this)} />
        </div>

        </div>
      </div>

    );
  }
}

export default CreateRule;
