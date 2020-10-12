import React, {Component, useEffect, useState} from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';

import axios from 'axios';

import './App.css';

import TimeDate from './components/TimeDate.js';
import Todos from './components/Todos.js';
import Header from './components/layout/Header.js';
import AddTodo from './components/AddTodo.js';
import About from './components/pages/About.js';
import Account from './components/pages/Account.js';
import LoginPage from './components/pages/LoginPage.js';
import RegistrationPage from './components/pages/RegistrationPage.js';



function GetTableData() {
  const [tableData, setTableData] = useState(0);

  useEffect(() => {
    fetch('/person').then(res => res.json()).then(data => {
      setTableData(data);
    });
  }, []);

  return (
    <div className="TableData">
      <p>Data in table: </p>
      <p>{JSON.stringify(tableData,null,2) }</p>
    </div>
  );
}

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
              <hr />
              <Switch>
              <Route exact path="/" render={() => (
                <React.Fragment>
                <AddTodo addTodo={this.addTodo}/>
                <Todos 
                  todos={this.state.todos} 
                  markComplete={this.markComplete}
                  delTodo={this.delTodo}
                  />
                </React.Fragment>
              )} />
              <Route exact path="/dateTime" component={TimeDate}/>
              <Route exact path="/about" component={About}/>
              <Route exact path="/tableData" component={GetTableData}/>
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
