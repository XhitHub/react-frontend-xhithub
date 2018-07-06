import React, { Component } from 'react';
import config from 'react-global-configuration';
import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';

import Template from './components/template/Template';
import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import KnowledgeGroups from './components/knowledge-groups/KnowledgeGroups';

config.set({ apiUrl: 'http://localhost:3000/' });
// global.config = {
//   apiUrl: 'http://localhost:3000/'
// }
global.apiUrl = 'http://localhost:3000/';
global.handleInputChange = function(componentThis,e){
  componentThis.setState(
    {
      [e.target.name]: e.target.value
    }
  );
};

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App container">
        <div className="row">
        <div className="col col-lg-12">
        <Navbar></Navbar>

           <Switch>
             <Route exact path='/' component={Template} />
             <Route exact path='/login' component={Login} />
             <Route exact path='/knowledge-groups' component={KnowledgeGroups} />
           </Switch>
        </div>
        </div>
        </div>
     </Router>
    );
  }
}

export default App;
