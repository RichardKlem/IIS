import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class TimeDate extends Component {
    constructor(props) {
      super(props);
      this.state = {date: new Date()};
    }
  
    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }
  
    componentWillUnmount() {
      clearInterval(this.timerID);
    }
  
    tick() {
      this.setState({
        date: new Date()
      });
    }
  
    render() {
        var options = { year: 'numeric', month: 'long', day: 'numeric', hours: 'long', minutes: 'long', seconds: 'long'};
        return (
        <div>
            <p>Current date and time:</p>
            <p>{this.state.date.toLocaleTimeString([],options)}</p>
        </div>
        );
    }
  }
  
  ReactDOM.render(
    <TimeDate />,
    document.getElementById('root')
  );

  export default TimeDate;
