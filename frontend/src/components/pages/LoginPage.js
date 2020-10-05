import React, {Component} from 'react'
import axios from "axios";
import {FLASK_URL} from "../../init";

export class LoginPage extends Component{
    state = {
        email: '',
        password: '',
        status: 'not logged in'
    }

    addTodo = (email, password) => {
        axios.post(FLASK_URL + '/login', { email: email, password: password }).then(res => {
                console.log(res.data);
                this.setState({ status : res.data.status});
                console.log(this.state.status);
            }
        );
    }


    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    onSubmit = (e) => {
        e.preventDefault();
        this.addTodo(this.state.email, this.state.password)
    }

    render() {
        return(
            <React.Fragment>
            <form onSubmit={this.onSubmit} style={{ display: 'flex'}}>
                <input
                    type='text'
                    name='email'
                    placeholder='email'
                    value={this.state.email}
                    onChange={this.onChange}
                />
                <input
                    type='password'
                    name='password'
                    placeholder='password'
                    value={this.state.password}
                    onChange={this.onChange}
                />
                <input
                    type="submit"
                    value="Submit"
                    className="btn"
                    style={{flex: '1'}}
                />
            </form>
                <p>Status: {this.state.status}</p>
            </React.Fragment>
        );
    }
}

export default LoginPage