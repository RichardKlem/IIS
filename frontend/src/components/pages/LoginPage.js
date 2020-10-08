import React, {Component} from 'react'
import axios from "axios";
import {FLASK_URL} from "../../init";

export class LoginPage extends Component{
    state = {
        email: '',
        password: '',
        status: 'Log In'
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    onSubmit = (e) => {
        e.preventDefault();
        this.loginUser(this.state.email, this.state.password)
    }

    loginUser = (email, password) => {
        axios.post(FLASK_URL + '/login', { email: email, password: password }).then(res => {
                console.log(res.data);
                this.setState({ status : res.data.status});
                console.log(this.state.status);
            }
        );
    }

    render() {
        return(
            <React.Fragment>
            <form onSubmit={this.onSubmit} style={{ display: 'flex'}}>
                <input
                    type='email'
                    name='email'
                    placeholder='email'
                    value={this.state.email}
                    onChange={this.onChange}
                    required
                />
                <input
                    type='password'
                    name='password'
                    placeholder='password'
                    value={this.state.password}
                    onChange={this.onChange}
                    required
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