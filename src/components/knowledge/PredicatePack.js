import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Predicate from './Predicate';

class PredicatePack extends Component {
  constructor(props) {
      super(props);

      this.state = {
         predicatePack: props.predicatePack,
         mode: props.mode
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
  render() {
    var details;
    var p = this.state.predicatePack;

    if(p){
      if(p.altFormInfo){
        var synCards = [];
        for (var k in p.altFormInfo.allSynonymsDict){
          var synLis = [];
          p.altFormInfo.allSynonymsDict[k].forEach((syn)=>{
            var synNameArr = syn.split('.');
            synLis.push(
              <li class="list-item">{synNameArr[0] + '('+synNameArr[2]+')'}</li>
            )
          })
          synCards.push(
            <div className=" card">
              <div className=" card-header">
                {k}
              </div>
              <div className=" card-body">
                <ul class="list">
                  {synLis}
                </ul>
              </div>
            </div>
          );
        }

        details = (
          <div>
          <h4>Description</h4>
          <p>{p.info.description}</p>
          <h3>Synonyms info</h3>
          {synCards}
          </div>
        );
      }
    }

    return (
      <div className="predicatePack">
        <h4>Predicate</h4>
        <Predicate predicate={this.state.predicatePack.predicate} mode="READ-FOL" />
        {details}
      </div>
    );
  }
}

Predicate.defaultProps = {
  mode: 'READ',
  details: false,
  readOnly: true
};


export default PredicatePack;
