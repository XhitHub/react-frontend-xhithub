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
import Home from './components/pages/Home';
import KnowledgeGroup from './components/knowledge-group/KnowledgeGroup';
import CreateKnowledgeGroup from './components/knowledge-group/CreateKnowledgeGroup';
import CreatePredicate from './components/knowledge/CreatePredicate';
import CreateRule from './components/knowledge/CreateRule';
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
global.loading = (<div><h4>Loading</h4></div>);

console.log('app.js predicatesPacksPool',localStorage.getItem('predicatesPacksPool'))
// TODO: remove true
if(false || !localStorage.getItem('predicatesPacksPool')){
  console.log('app.js predicatesPacksPool',localStorage.getItem('predicatesPacksPool'))
  localStorage.setItem('predicatesPacksPool',JSON.stringify([]))
  console.log('app.js predicatesPacksPool',localStorage.getItem('predicatesPacksPool'))
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
             <Route path='/create-rule/:kgid' component={CreateRule} />
             <Route path='/create-rule/' component={CreateRule} />
             <Route path='/rules/' component={Rules} />
           </Switch>
        </div>
        </div>
        </div>
     </Router>
    );
  }
}



export default App;
