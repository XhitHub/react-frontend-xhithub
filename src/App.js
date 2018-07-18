import React, { Component } from 'react';
import config from 'react-global-configuration';
import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import $ from 'jquery';

import './App.css';
import Template from './components/template/Template';
import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import KnowledgeGroups from './components/pages/KnowledgeGroups';
import Predicates from './components/pages/Predicates';
import Rules from './components/pages/Rules';
import Facts from './components/pages/Facts';
import PredicateDetails from './components/pages/PredicateDetails';
import RuleDetails from './components/pages/RuleDetails';
import FactDetails from './components/pages/FactDetails';
import Home from './components/pages/Home';
import KnowledgeGroup from './components/knowledge-group/KnowledgeGroup';
import CreateKnowledgeGroup from './components/knowledge-group/CreateKnowledgeGroup';
import CreatePredicate from './components/knowledge/CreatePredicate';
import CreateRule from './components/knowledge/CreateRule';
import CreateFact from './components/knowledge/CreateFact';
import ManageRelatedPredicates from './components/knowledge/ManageRelatedPredicates';

config.set({ apiUrl: 'http://localhost:3000/' });
// global.config = {
//   apiUrl: 'http://localhost:3000/'
// }
global.apiUrl = 'http://localhost:3000/';
global.appUrl = 'http://localhost:3001/';
global.handleInputChange = function(componentThis,e){
  componentThis.setState(
    {
      [e.target.name]: e.target.value
    }
  );
};
global.handleInputChangeNested = function(componentThis,obj,e){
  obj[e.target.name] = e.target.value;
  componentThis.setState(
    {
      _triggerUpdate: 1
    }
  );
};
global.handleInputChange1N = function(componentThis,keysArr,e){
  var obj = componentThis.state;
  keysArr.forEach((key) => {
    obj = obj[key];
  })
  componentThis.setState(
    {
      [e.target.name]: e.target.value
    }
  );
};
global.isPredicate = function(obj){
  return obj.text;
}
global.simpleAjax = function(optionsExtra){
  var options = {
      dataType: 'json',
      contentType: 'application/json',
      error: (err) => {
        console.log('err', err);
        if(err.status == 401){
          localStorage.removeItem('token');
          window.location.href = global.appUrl;
        }
      },
      headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')}
  };
  for (var key in optionsExtra) {
    options[key] = optionsExtra[key];
  }
  $.ajax(options);
}
global.getUserID = function(){
  if(global.user){
    return global.user._id;
  }
  else{
    return false;
  }
}
global.wrapData = function(dataName, arr){
  var wrappedData = [];
  arr.forEach((item) => {
    var obj = {};
    obj[dataName] = item;
    wrappedData.push(obj);
  })
  return wrappedData;
}
global.loading = (
  <div id="global-loading" class="text-center">
    <h4>Loading</h4>
  </div>
);

// TODO: remove true
if(false || !localStorage.getItem('predicatesPacksPool')){
  localStorage.setItem('predicatesPacksPool',JSON.stringify([]))
}
if(false || !localStorage.getItem('relatedPredicatePacks')){
  localStorage.setItem('relatedPredicatePacks',JSON.stringify([]))
}

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App container">
        <div className="row">
        <div className="col col-lg-12">
        <Navbar></Navbar>
           <Switch>
             <Route exact path='/' component={Home} />
             <Route exact path='/login' component={Login} />
             <Route exact path='/knowledge-groups' component={KnowledgeGroups} />
             <Route exact path='/predicates' component={Predicates} />
             <Route path='/knowledge-group/:id' component={KnowledgeGroup} />
             <Route path='/create-knowledge-group' component={CreateKnowledgeGroup} />
             <Route path='/create-predicate/:kgid' component={CreatePredicate} />
             <Route path='/create-predicate/' component={CreatePredicate} />
             <Route path='/manage-related-predicates/:id' component={ManageRelatedPredicates} />
             <Route path='/create-rule/:mode' component={CreateRule} />
             <Route path='/create-rule/' component={CreateRule} />
             <Route path='/create-fact/' component={CreateFact} />
             <Route path='/rules/' component={Rules} />
             <Route path='/facts/' component={Facts} />
             <Route path='/predicate/:id' component={PredicateDetails} />
             <Route path='/fact/:id' component={FactDetails} />
             <Route path='/rule/:id' component={RuleDetails} />
           </Switch>
        </div>
        </div>
        </div>
     </Router>
    );
  }
}



export default App;
