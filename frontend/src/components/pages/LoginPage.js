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
    componentDidMount() {
        const cookies = new Cookies();
        const cookieUserID = cookies.get('CookieUserID');
        if (typeof cookieUserID !== 'undefined') {
            this.props.history.push('/account');
        }
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
                        cookies.set('CookieUserID', res.data.cookie_id, { path: '/', expires: d });
                        this.props.history.push('/account');
                    }
            }
        );
    }

    render() {
        return(
            <React.Fragment>
                <h2>Login Page</h2>
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
            </React.Fragment>
        );
    }
}

export default LoginPage