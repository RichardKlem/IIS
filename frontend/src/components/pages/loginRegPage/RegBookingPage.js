import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import Required from "../../other/Required";


export class RegBookingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isBooked: false,
            register: false,
            registrationButtonText: "Create Account",
            signUpText: "BOOK Room",
            name: undefined,
            phone_number: undefined,
            birth_date: "",
            address: undefined,
            email: undefined,
            password: undefined,
            password_check: undefined,
            status_code: 400,
            status: undefined
        }
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});

    RegistrationHandler = (e) => {
        e.preventDefault();
        if (this.state.signUpText === "BOOK Room") {
            axios.post('/nonRegBooking', {
                name: this.state.name,
                birth_date: this.state.birth_date,
                email: this.state.email,
                address: this.state.address,
                phone_number: this.state.phone_number,
                id_room: this.props.id_room,
                start_date: this.props.start_date,
                end_date: this.props.end_date,
                adult_count: this.props.adult_count,
                child_count: this.props.child_count,
                room_count: this.props.room_count,
                approved: this.props.approved,
            }).then(res => {
                    this.setState({status: res.data.status});
                    if (res.data.statusCode === 200) {
                        this.setState({isBooked: true})
                        this.setState({status_code: res.data.statusCode})
                    } else {
                        this.setState({isBooked: false})
                        this.setState({status_code: res.data.statusCode})
                    }
                }
            );
        } else {
            if (this.state.password !== this.state.password_check) {
                this.setState({status: "Passwords doesn't match!"});
            } else {
                axios.post('/regBooking', {
                    name: this.state.name,
                    birth_date: this.state.birth_date,
                    email: this.state.email,
                    address: this.state.address,
                    phone_number: this.state.phone_number,
                    password: this.state.password,
                    id_room: this.props.id_room,
                    start_date: this.props.start_date,
                    end_date: this.props.end_date,
                    adult_count: this.props.adult_count,
                    child_count: this.props.child_count,
                    room_count: this.props.room_count,
                    approved: this.props.approved,
                }).then(res => {
                        this.setState({status: res.data.status, isBooked: true});
                    }
                );
            }
        }
        if (this.state.status_code === 200) {
            this.setState({name: ''});
            this.setState({birth_date: ''});
            this.setState({email: ''});
            this.setState({address: ''});
            this.setState({phone_number: ''});
            this.setState({password: ''});
        }
    }

    render() {
        if (this.state.isBooked === true) {
            return <div className="App">
                Booked successfully, please check your email for more information.
            </div>;
        } else {
            return (
                <div>
                    <div className="d-flex align-items-center px-0">
                        <div className="w-100 mx-0">
                            <div>
                                <div className="text-left px-4">
                                    <h4>Continue with booking</h4>
                                    <h6 className="font-weight-light">Please fill the required information.</h6>
                                    <form className="pt-3" onSubmit={this.RegistrationHandler}>
                                        <div className="form-group">
                                            <Required text="Full Name"/>
                                            <input type="text" className="form-control " name='name'
                                                   placeholder='Full Name' defaultValue={this.state.name}
                                                   onChange={this.onChange} required/>
                                        </div>
                                        <div className="form-group">
                                            <Required text="Email"/>
                                            <input type="tel" className="form-control " name='email'
                                                   placeholder="Email" defaultValue={this.state.email}
                                                   onChange={this.onChange} required/>
                                        </div>
                                        <div className="form-group">
                                            Phone Number
                                            <input type="tel" className="form-control"
                                                   name='phone_number' placeholder='Phone Number'
                                                   defaultValue={this.state.phone_number} onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            Birth Date
                                            <input type="date" className="form-control"
                                                   name='birth_date' placeholder='Birth Date'
                                                   defaultValue={this.state.birth_date} onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            Address
                                            <input type="text" className="form-control" name='address'
                                                   placeholder='Address' defaultValue={this.state.address}
                                                   onChange={this.onChange}/>
                                            <Required end="true"/>
                                        </div>
                                        {this.passwordInput()}
                                        <div className="form-group">
                                            <input
                                                type="submit"
                                                value={this.state.signUpText}
                                                className="d-block btn btn-block btn-primary"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <div className="form-check">
                                                <label className="form-check-label text-muted">
                                                    <input type="checkbox" className="checkmark" required/>
                                                    <span className="checkmark"/>
                                                    <Required text="I agree to all Terms & Conditions"/>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="text-center font-weight-light">
                                            Already have an account? <Link to="/login"
                                                                           className="text-primary">Login</Link>
                                        </div>
                                        <div className="text-center font-weight-bold">
                                            {this.state.status}
                                        </div>
                                    </form>
                                    <button className="btn btn-block btn-secondary btn-sm"
                                            onClick={this.showPasswordInput}>{this.state.registrationButtonText}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    showPasswordInput = () => {
        this.setState({register: !this.state.register})
        if (this.state.register === true) {
            this.setState({registrationButtonText: "Create Account"})
            this.setState({signUpText: "BOOK Room"})
        } else {
            this.setState({registrationButtonText: "Cancel registration"})
            this.setState({signUpText: "Register & BOOK Room"})
        }
    }

    passwordInput() {
        return (
            <div>
                {this.state.register && <div className="form-group">
                    <Required text="Password"/>
                    <input type="password" className="form-control" name='password'
                           placeholder="Password" defaultValue={this.state.password} onChange={this.onChange}
                           required/>
                </div>}
                {this.state.register && <div className="form-group">
                    <Required text="Re-enter Password"/>
                    <input type="password" className="form-control"
                           name='password_check' placeholder="Re-enter Password"
                           defaultValue={this.state.password_check} onChange={this.onChange} required/>
                </div>}
            </div>)
    }
}

export default RegBookingPage