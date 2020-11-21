import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import moment from 'moment';
import Required from "../../other/Required";

export class RegistrationPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: undefined,
            phone_number: "",
            birth_date: "",
            address: "",
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
                <div className="d-flex align-items-center">
                    <div className="w-100 mx-0">
                        <div>
                            <div className="text-left py-5">
                                <h4>New here?</h4>
                                <h6 className="font-weight-light padding-bottom-10">Signing up is easy. It only takes a
                                    few steps</h6>
                                <form onSubmit={this.RegistrationHandler}>
                                    <div className="form-group">
                                        <Required text="Full Name"/>
                                        <input type="text" className="form-control" name='name'
                                               placeholder='Full Name' defaultValue={this.state.name}
                                               onChange={this.onChange} required/>
                                    </div>
                                    <div className="form-group">
                                        <Required text="Email"/>
                                        <input type="tel" className="form-control" name='email'
                                               placeholder="Email" defaultValue={this.state.email}
                                               onChange={this.onChange} required/>
                                    </div>
                                    <div className="form-group">
                                        Phone Number
                                        <input type="tel" className="form-control" name='phone_number'
                                               placeholder='Phone Number'
                                               defaultValue={this.state.phone_number} onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        Birth Date
                                        <input type="date" className="form-control" name='birth_date'
                                               placeholder='Birth Date' defaultValue={this.state.birth_date}
                                               max={moment().add(-18, "year").format("YYYY-MM-DD")}
                                               min={moment().format("1900-01-01")}
                                               onChange={this.onChange}/>
                                    </div>
                                    <div className="form-group">
                                        Address
                                        <input type="text" className="form-control" name='address'
                                               placeholder='Address' defaultValue={this.state.address}
                                               onChange={this.onChange}/>
                                    </div>
                                    <div className="form-group">
                                        <Required text="Password"/>
                                        <input type="password" className="form-control" name='password'
                                               placeholder="Password" defaultValue={this.state.password}
                                               onChange={this.onChange} required/>
                                    </div>
                                    <div className="form-group">
                                        <Required text="Re-enter Password"/>
                                        <input type="password" className="form-control"
                                               name='password_check' placeholder="Re-enter Password"
                                               defaultValue={this.state.password_check} onChange={this.onChange}
                                               required/>
                                        <Required end="true"/>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="submit"
                                            value="SIGN UP"
                                            className="btn btn-block btn-primary"
                                        />
                                    </div>
                                    <div>
                                        <div className="form-check">
                                            <label className="form-check-label text-muted">
                                                <input type="checkbox" className="checkmark" required/>
                                                <span className="checkmark"/>
                                                <Required text="I agree to all Terms & Conditions"/>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="text-center font-weight-light">
                                        Already have an account? <Link to="/login" className="text-primary">Login</Link>
                                    </div>
                                    <div className="text-center font-weight-bold">
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