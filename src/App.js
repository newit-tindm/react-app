import React, { Component } from 'react';
import ItemsSoldOut from './components/items-sold-out';
import AddItemsBlacklist from './components/add-items-blacklist';
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
          <Route
            path="/add-items-blacklist"
            exact={true}
            component={AddItemsBlacklist}
          />
        </Router>
      </div>
    );
  }
}

export default App;
