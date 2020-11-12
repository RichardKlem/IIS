import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import moment from 'moment';
import Required from "../other/Required";

export class RegistrationPage extends Component {
    //todo return status code

    constructor(props) {
        super(props);
        this.state = {
            name: undefined,
            phone_number: undefined,
            birth_date: undefined,
            address: undefined,
            email: undefined,
            password: undefined,
            password_check: undefined,
            status: undefined
        }
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});

    RegistrationHandler = (e) => {
        e.preventDefault();
        if (this.state.password !== this.state.password_check) {
            this.setState({status: "Passwords doesn't match!"});
        } else {
            axios.post('/registration', {
                name: this.state.name,
                birth_date: this.state.birth_date,
                email: this.state.email,
                address: this.state.address,
                phone_number: this.state.phone_number,
                password: this.state.password
            }).then(res => {
                    this.setState({status: res.data.status});
                    if (res.data.statusCode === 200) {
                        this.setState({name: ''});
                        this.setState({birth_date: ''});
                        this.setState({email: ''});
                        this.setState({address: ''});
                        this.setState({phone_number: ''});
                        this.setState({password: ''});
                        this.props.history.push('/login');
                    }
                }
            );
        }
    }

    render() {
        return (
            <div>
                <div className="d-flex align-items-center auth px-0">
                    <div className="w-100 mx-0">
                        <div>
                            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                <h4>New here?</h4>
                                <h6 className="font-weight-light">Signing up is easy. It only takes a few steps</h6>
                                <form className="pt-3" onSubmit={this.RegistrationHandler}>
                                    <div className="form-group">
                                        <Required text="Full Name"/>
                                        <input type="text" className="form-control form-control-lg" name='name'
                                               placeholder='Full Name' defaultValue={this.state.name}
                                               onChange={this.onChange} required/>
                                    </div>
                                    <div className="form-group">
                                        <Required text="Email"/>

                                        <input type="tel" className="form-control form-control-lg" name='email'
                                               placeholder="Email" defaultValue={this.state.email}
                                               onChange={this.onChange} required/>
                                    </div>
                                    <div className="form-group">

                                        <Required text="Phone Number"/>
                                        <input type="tel" className="form-control form-control-lg" name='phone_number'
                                               placeholder='Phone Number'
                                               pattern="[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}"
                                               defaultValue={this.state.phone_number} onChange={this.onChange}
                                               required/>
                                    </div>
                                    <div className="form-group">
                                        <Required text="Birth Date"/>
                                        <input type="date" className="form-control form-control-lg" name='birth_date'
                                               placeholder='Birth Date' defaultValue={this.state.birth_date}
                                               max={moment().add(-18, "year").format("YYYY-MM-DD")}
                                               min={moment().format("1900-01-01")}
                                               onChange={this.onChange} required/>
                                    </div>
                                    <div className="form-group">
                                        <Required text="Address"/>
                                        <input type="text" className="form-control form-control-lg" name='address'
                                               placeholder='Address' defaultValue={this.state.address}
                                               onChange={this.onChange} required/>
                                    </div>
                                    <div className="form-group">
                                        <Required text="Password"/>
                                        <input type="password" className="form-control form-control-lg" name='password'
                                               placeholder="Password" defaultValue={this.state.password}
                                               onChange={this.onChange} required/>
                                    </div>
                                    <div className="form-group">
                                        <Required text="Re-enter Password"/>
                                        <input type="password" className="form-control form-control-lg"
                                               name='password_check' placeholder="Re-enter Password"
                                               defaultValue={this.state.password_check} onChange={this.onChange}
                                               required/>
                                        <Required end="true"/>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            style={{display: 'block'}}
                                            type="submit"
                                            value="SIGN UP"
                                            className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <div className="form-check">
                                            <label className="form-check-label text-muted">
                                                <input type="checkbox" className="form-check-input" required/>
                                                <span className="checkmark"></span>
                                                I agree to all Terms & Conditions
                                            </label>
                                        </div>
                                    </div>
                                    <div className="text-center mt-4 font-weight-light">
                                        Already have an account? <Link to="/login" className="text-primary">Login</Link>
                                    </div>
                                    <div className="text-center mt-4 font-weight-bold">
                                        {this.state.status}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RegistrationPage