import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import axios from 'axios';

import './App.scss';

import Todos from './components/pages/todos/Todos.js';
import Header from './components/layout/Header.js';
import AddTodo from './components/pages/todos/AddTodo.js';
import About from './components/pages/About.js';
import Account from './components/pages/Account.js';
import LoginPage from './components/pages/LoginPage.js';
import RegistrationPage from './components/pages/RegistrationPage.js';

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
                  <Route exact path="/" render={() => (
                    <React.Fragment>
                      <div style={{paddingTop:'10px', backgroundColor:'#fff'}}>
                      <AddTodo addTodo={this.addTodo}/>
                      <Todos
                        todos={this.state.todos}
                        markComplete={this.markComplete}
                        delTodo={this.delTodo}
                        />
                      </div>
                    </React.Fragment>
                  )} />
              <Route exact path="/about" component={About}/>
              <Route exact path="/login" component={LoginPage}/>
              <Route exact path="/registration" component={RegistrationPage}/>
              <Route exact path="/account" component={Account}/>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
