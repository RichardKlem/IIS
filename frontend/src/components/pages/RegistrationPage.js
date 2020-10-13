import React, {Component} from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";

export class LoginPage extends Component{
    //todo return status code
    state = {
        name : '',
        phone_number : '',
        birth_date: '',
        email: '',
        password: '',
        password_check: '',
        status_code: 400,
        status: ''
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    RegistrationHandler = (e) => {
        console.log(this.state.name)
        console.log(this.state.birth_date)
        console.log(this.state.email)
        console.log(this.state.phone_number)
        console.log(this.state.password)
        e.preventDefault();
        if (this.state.password !== this.state.password_check) {
            this.setState({ status : "Passwords doesn't match!"});
        }
        axios.post('/registration', {
                name: this.state.name,
                birth_date: this.state.birth_date,
                email: this.state.email,
                phone_number: this.state.phone_number,
                password: this.state.password
                }).then(res => {
                    this.setState({ status : res.data.status});
                    }
        );
        if (this.state.status_code === 200) {
            this.setState({ name: '' });
            this.setState({ birth_date: '' });
            this.setState({ email: '' });
            this.setState({ phone_number: '' });
            this.setState({ password: '' });
        }

    }

    render() {
        return(
            <div>
                <div className="d-flex align-items-center auth px-0">
                    <div className="w-100 mx-0">
                        <div>
                            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                <h4>New here?</h4>
                                <h6 className="font-weight-light">Signing up is easy. It only takes a few steps</h6>
                                <form className="pt-3" onSubmit={this.RegistrationHandler} >
                                    <div className="form-group">
                                        <input type="text" className="form-control form-control-lg" name='name' placeholder='Full Name' defaultValue={this.state.name} onChange={this.onChange} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="tel" className="form-control form-control-lg" name='email' placeholder="Email" defaultValue={this.state.email} onChange={this.onChange} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="tel" className="form-control form-control-lg"name='phone_number' placeholder='Phone Number' pattern="[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}" defaultValue={this.state.phone_number}  onChange={this.onChange} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="date" className="form-control form-control-lg" name='birth_date' placeholder='Birth Date' defaultValue={this.state.birth_date} onChange={this.onChange} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-lg" name='password' placeholder="Password" defaultValue={this.state.password} onChange={this.onChange} required/>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-lg" name='password_check'  placeholder="Re-enter Password" defaultValue={this.state.password_check} onChange={this.onChange} required/>
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
                                                <i className="input-helper"></i>
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

export default LoginPage