import React, {Component, useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import axios from 'axios';
import {FLASK_URL} from "./init";

import './App.css';

import TimeDate from './components/TimeDate.js';
import Todos from './components/Todos.js';
import Header from './components/layout/Header.js';
import AddTodo from './components/AddTodo.js';
import About from './components/pages/About.js';
import LoginPage from './components/pages/LoginPage.js';


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
  
  // Load Todos
  componentDidMount() {
    axios.get(FLASK_URL + '/todos')
        .then(res => this.setState({ todos: res.data }))
  }
  
  // Delete Todo
  delTodo = (id) => {
    axios.post(FLASK_URL + '/delTodos', { id: id }).then(() =>
      this.setState({ todos: [...this.state.todos]
          .filter(todo =>todo.id !== id)}));
  }

  // Add Todo
  addTodo = (title) => {
    axios.post(FLASK_URL + '/todos', { title: title }).then(res => {
        console.log(res.data);
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
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
