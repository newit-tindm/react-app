import React, { Component } from 'react';
import ItemsSoldOut from './components/items-sold-out';
import './app.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Router>
            <Route
              path="/items-sold-out"
              exact={true}
              component={ItemsSoldOut}
            />
          </Router>
      </div>
    );
  }
}

export default App;
