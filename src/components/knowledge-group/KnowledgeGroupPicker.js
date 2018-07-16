import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

import SearchWithList from "../general/SearchWithList";



class KnowledgeGroupPicker extends Component {
  constructor(props) {
      super(props);

      this.state = {
         stateField1: "stateField1 value",
         pickedGroups:[]
      }
      this.addGroup = this.addGroup.bind(this);
      this.removeGroup = this.removeGroup.bind(this);
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

    addGroup(group){
      var pgs = this.state.pickedGroups;
      if(pgs.indexOf(group) == -1){
        pgs.push(group);
      }
      this.setState({})
      this.props.onPickedGroupsChange(pgs);
    }

    removeGroup(group){
      var pgs = this.state.pickedGroups;
      var index = pgs.indexOf(group)
      if(index != -1){
        pgs.splice(index,1);
      }
      this.setState({})
      this.props.onPickedGroupsChange(pgs);
    }

  render() {
    var pgs = this.state.pickedGroups;
    var pickedGroupViews = []
    pgs.forEach((g)=>{
      pickedGroupViews.push(
        <span class="picked-group badge badge-light">
          {g.name}
          <i class="fa fa-backspace pointer" onClick={()=>{this.removeGroup(g)}}></i>
        </span>
      )
    })
    return (
      <div className="col col-lg-12">
          <div className="card">
            <div className="card-body">
              {pickedGroupViews}
            </div>
          </div>
          <p>Search and pick knowledge group:</p>
          <SearchWithList
            delimiter={' '}
            url='knowledge/get-knowledge-group-by-keywords'
            method="post"
            onSelectItem={this.addGroup}
            getItemView={
              (item)=>{
                return (
                  <span>{item.name}</span>
                )
              }
            }
          />
      </div>

    );
  }
}

export default withRouter(KnowledgeGroupPicker);
