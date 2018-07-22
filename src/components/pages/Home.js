import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

class Template extends Component {
  constructor(props) {
      super(props);

      this.state = {
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
  render() {
    var button;
    console.log('global.user',global.user)
    if(true||global.getUserID()){
      button = (
        <Link to={'/knowledge-groups'}>
          <button class="btn btn-primary btn-lg pointer circle-btn start-btn" role="button">Start building knowledge</button>
        </Link>
      )
    }
    return (
      <div className="col col-lg-12">
      <div class="home-container text-center">
        <img id="home-pic" src="https://cdn.pixabay.com/photo/2017/04/13/20/26/artificial-intelligence-2228610_960_720.jpg" />
        <div class="div-over-img text-center">
          <h1 class="display-3">Intelligent collaborated reasoning system</h1>
          <hr class="my-4" />
          <p class="">A collaborative reasoning system with Intelligent knowledge base management for maximized knowledge compatibility.</p>
          <hr class="my-4" />
          {button}
        </div>

      </div>
      </div>

    );
  }
}

export default withRouter(Template);
