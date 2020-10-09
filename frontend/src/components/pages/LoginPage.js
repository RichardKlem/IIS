import React, {Component} from 'react'
import axios from "axios";
import Cookies from 'universal-cookie';

export class LoginPage extends Component{
    state = {
        email: '',
        password: '',
        status: 'Log In',
        status_code: '',
        cookie_id: '',
        id_user: '',
        redirect: false,
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    loginHandler = (e) => {
        e.preventDefault();
        axios.post( '/login', { email: this.state.email, password: this.state.password })
                .then(res => {
                    this.setState({ status : res.data.status });
                    if (res.data.status_code === 200) {
                        const cookies = new Cookies();
                        let d = new Date();
                        d.setTime(d.getTime() + (60*60*1000));
                        console.log(this.state.id_user);
                        cookies.set('CookieUserID', res.data.cookie_id, { path: '/', expires: d });
                        this.props.history.push('/account');
                    }
            }
        );
    }

    logoutHandler = () => {
        const cookies = new Cookies();
        cookies.remove('CookieUserID');
        this.setState({ status : "Logged out successfully" });
    }

    render() {
        return(
            <React.Fragment>
            <form onSubmit={ this.loginHandler } style={{ display: 'block'}}>
                <input
                    style={{ display: 'block' }}
                    type='email'
                    name='email'
                    placeholder='email'
                    value={this.state.email}
                    onChange={this.onChange}
                    required
                />
                <input
                    style={{ display: 'block' }}
                    type='password'
                    name='password'
                    placeholder='password'
                    value={this.state.password}
                    onChange={this.onChange}
                    required
                />
                <button onClick={ this.loginHandler }>Login</button>
            </form>
            <p>Status: { this.state.status }</p>
                <button onClick={ this.logoutHandler }>Logout</button>
            </React.Fragment>
        );
    }
}

export default LoginPage