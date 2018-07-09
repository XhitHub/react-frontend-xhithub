import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class KnowledgeGroup extends Component {
  constructor(props) {
      super(props);

      this.state = {
         knowledgeGroup: undefined
      }
   }

   handleChange(e){
     global.handleInputChange(this,e);
   }

  componentWillMount() {
      console.log('Component WILL MOUNT!')
   }
   componentDidMount() {
      var kgid = this.props.match.params.id;
      var opts = {
        url: global.apiUrl + 'knowledge/knowledge-group/'+kgid,
        type: 'get',
        success: (data) => {
          this.setState({
            knowledgeGroup: data
          });
        }
      }
      global.simpleAjax(opts);
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
    var kg = this.state.knowledgeGroup;
    if(kg){
      return (
        <div className="col col-lg-12">
          <h1>Knowledge group</h1>
          <div className="card">
            <div class="card-body">
              <h3>{kg.name}</h3>
              <p>{kg.description}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="offset-md-3 col-md-6">
                  <h4 class="pull-left">Predicates</h4>
                </div>
                <div className="col-md-3 pull-right">
                  <Link to={'/create-predicate/'+kg._id}>Create</Link>
                </div>
              </div>
            </div>
            <div className="card-body">

              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </div>
          </div>


          <div className="col col-lg-12">
          </div>
        </div>
      );
    }
    else{
      return global.loading;
    }
  }
}

export default KnowledgeGroup;
