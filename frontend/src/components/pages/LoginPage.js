import React, {Component} from 'react'
import axios from "axios";
import Cookies from 'universal-cookie';

export class LoginPage extends Component{
    state = {
        email: '',
        password: '',
        status: 'Log In',
        statusCode: '',
        userId: '',
        redirect: false,
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    onSubmit = (e) => {
        e.preventDefault();
        this.loginUser(this.state.email, this.state.password)
    }

    loginUser = (email, password) => {
        axios.post( '/login', { email: email, password: password })
                .then(res => {
                    this.setState({ status : res.data.status});
                    this.setState({ statusCode : res.data.statusCode});
                    this.setState({ userId : res.data.userId});
                    if (this.state.statusCode === 200) {
                        const cookies = new Cookies();
                        cookies.set('userID', this.state.userId, { path: '/' });
                        this.props.history.push('/account');
                    }
            }
        );
    }

    render() {
        return(
            <React.Fragment>
            <form onSubmit={this.onSubmit} style={{ display: 'block'}}>
                <input
                    style={{display: 'block'}}
                    type='email'
                    name='email'
                    placeholder='email'
                    value={this.state.email}
                    onChange={this.onChange}
                    required
                />
                <input
                    style={{display: 'block'}}
                    type='password'
                    name='password'
                    placeholder='password'
                    value={this.state.password}
                    onChange={this.onChange}
                    required
                />
                <button onClick={this.onSubmit}>Login</button>
            </form>
                <p>Status: {this.state.status}</p>
            </React.Fragment>
        );
    }

}

export default LoginPage