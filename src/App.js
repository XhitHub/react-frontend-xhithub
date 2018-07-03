import React, { Component } from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';

import Template from './components/template/Template';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <ul>
              <li><Link to={'/'}>Home</Link></li>
              <li><Link to={'/Login'}>Login</Link></li>
           </ul>
           <Switch>
              <Route exact path='/' component={Template} />
           </Switch>
        </div>
     </Router>
    );
  }
}

export default App;
