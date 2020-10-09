import React, {Component} from 'react'
import axios from "axios";

export class LoginPage extends Component{
    state = {
        name : '',
        phone_number : '',
        birth_date: '',
        email: '',
        password: '',
        password_check: '',
        status: 'Register'
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    RegistrationHandler = (e) => {
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
        this.setState({ name: '' });
        this.setState({ birth_date: '' });
        this.setState({ email: '' });
        this.setState({ phone_number: '' });
        this.setState({ password: '' });
    }

    render() {
        return(
            <React.Fragment>
            <form onSubmit={this.RegistrationHandler} style={{ display: 'block'}}>
                <input
                    style={{display: 'block'}}
                    type='text'
                    name='name'
                    placeholder='name'
                    value={this.state.name}
                    onChange={this.onChange}
                    required
                />
                <input
                    style={{display: 'block'}}
                    type='text'
                    name='phone_number'
                    placeholder='phone Number'
                    pattern="[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}"
                    value={this.state.phone_number}
                    onChange={this.onChange}
                    required
                />
                <input
                    style={{display: 'block'}}
                    type='date'
                    name='birth_date'
                    placeholder='birth Date'
                    value={this.state.birth_date}
                    onChange={this.onChange}
                    required
                />
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
                <input
                    style={{display: 'block'}}
                    type='password'
                    name='password_check'
                    placeholder='password again'
                    value={this.state.password_check}
                    onChange={this.onChange}
                    required
                />
                <input
                    style={{display: 'block'}}
                    type="submit"
                    value="Submit"
                    className="btn"
                />
            </form>
                <p>Registation status: {this.state.status}</p>
            </React.Fragment>
        );
    }
}

export default LoginPage