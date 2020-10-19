import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import axios from 'axios';

import './App.scss';

import Header from './components/layout/Header.js';
import About from './components/pages/About.js';
import Account from './components/pages/Account.js';
import LoginPage from './components/pages/LoginPage.js';
import RegistrationPage from './components/pages/RegistrationPage.js';
import AddHotel from "./components/pages/hotelsAdmin/AddHotel";
import OpenHotel from "./components/pages/hotelsPublic/OpenHotel";
import HotelsList from "./components/pages/hotelsPublic/HotelsList";

class App extends Component {

  state = {
    todos: [],
  }

  // Toggle Completed (DB not implemented)
  markComplete = (id) => {
    this.setState({ todos: this.state.todos.map(todo => {
      if(todo.id === id){
        todo.completed = ! todo.completed
      }
      return todo;
    }) });
  }
  
  // Load Users
    componentDidMount() {
    axios.get( '/todos')
        .then(res => {
          this.setState({ todos: res.data });
        })
  }
  
  // Delete Todo
  delTodo = (id) => {
    axios.post('/delTodos', { id: id }).then(() =>
      this.setState({ todos: [...this.state.todos]
          .filter(todo =>todo.id !== id)}));
  }

  // Add Todo
  addTodo = (title) => {
    axios.post('/todos', { title: title }).then(res => {
        this.setState({ todos: [...this.state.todos, res.data]});
      }
      );
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <Header/>
              <Switch>
                  <Route exact path="/" component={HotelsList}/>
                  <Route exact path="/about" component={About}/>
                  <Route exact path="/login" component={LoginPage}/>
                  <Route exact path="/registration" component={RegistrationPage}/>
                  <Route exact path="/account" component={Account}/>
                  <Route exact path="/addHotel" component={AddHotel}/>
                  <Route exact path="/editHotel/:id" component={OpenHotel}/>
                  <Route exact path="/hotel/:id" component={OpenHotel}/>
              </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
