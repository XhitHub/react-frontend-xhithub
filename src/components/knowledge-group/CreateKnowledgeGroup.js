import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

class CreateKnowledgeGroup extends Component {
  constructor(props) {
      super(props);

      this.state = {
         name: ''
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
   confirm(){
     var opts = {
       url: global.apiUrl + 'knowledge/knowledge-group',
       type: 'post',
       success: (data) => {
         this.props.history.push('/knowledge-group/'+data._id);
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
  render() {
    return (
      <div className="col col-lg-12">
        <h1>Create knowledge group</h1>
        <div class="form-group ">
          <label class="control-label " for="name">
           Name
          </label>
          <input
              className="form-control"
              name="name"
              type="text"
              onChange={this.handleChange.bind(this)}
          />
         </div>
         <div class="form-group ">
           <label class="control-label " for="name">
            Description
           </label>
           <textarea class="form-control" cols="40" id="message" name="description" rows="10" onChange={this.handleChange.bind(this)}></textarea>
          </div>
          <div className="col col-lg-12 text-center">
            <button class="btn btn-primary" onClick={this.confirm.bind(this)}>Create</button>
          </div>


        <div className="col col-lg-12">
        </div>
      </div>

    );
  }
}

export default withRouter(CreateKnowledgeGroup);
