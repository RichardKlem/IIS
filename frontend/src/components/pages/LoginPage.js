import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export class LoginPage extends Component {
    state = {
        email: '',
        password: '',
        status: '',
        status_code: '',
        cookie_id: '',
        id_user: '',
        redirect: false,
    }
    componentDidMount() {
        const cookieUserID = cookies.get('CookieUserID');
        if (typeof cookieUserID !== 'undefined') {
            this.props.history.push('/account');
        }
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.loginHandler(e);
        }
    }

    loginHandler = (e) => {
        e.preventDefault();
        axios.post( '/login', { email: this.state.email, password: this.state.password })
            .then(res => {
                    this.setState({ status : res.data.status });
                    if (res.data.status_code === 200) {
                        let d = new Date();
                        d.setTime(d.getTime() + (60*60*1000));
                        cookies.set('CookieUserID', res.data.cookie_id, { path: '/', expires: d });
                        window.location.reload(false);
                        this.props.history.push('/account');
                    }
                }
            );
    }

    render() {
        return (
            <div>
                <div className="align-items-center auth px-0">
                    <div className="w-100 mx-0">
                        <div>
                            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                <h4>Hello Again!</h4>
                                <h6 className="font-weight-light">Login in to continue.</h6>
                                <Form className="pt-3" onSubmit={ this.loginHandler }>
                                    <Form.Group className="d-flex search-field" onSubmit={ this.loginHandler }>
                                        <Form.Control type="email" placeholder="Username" name="email" defaultValue={this.state.email} size="lg" onChange={ this.onChange } className="h-auto" />
                                    </Form.Group>
                                    <Form.Group className="d-flex search-field" onSubmit={ this.loginHandler }>
                                        <Form.Control type="password" placeholder="Password" name="password" value={this.state.password} size="lg" onChange={ this.onChange } onKeyDown={this.onEnterPress} className="h-auto" />
                                    </Form.Group>
                                    <div className="mt-3">
                                        <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/login" onClick={ this.loginHandler }>LOG IN</Link>
                                    </div>
                                    <div className="text-center my-2">
                                        <a href="/recoverPassword" onClick={event => event.preventDefault()} className="auth-link text-center text-black">Forgot password?</a>
                                    </div>
                                    <div className="text-center mt-4 font-weight-light">
                                        Don't have an account? <Link to="/registration" className="text-primary">Create</Link>
                                    </div>
                                    <div className="text-center mt-4 font-weight-bold">
                                        {this.state.status}
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginPage
