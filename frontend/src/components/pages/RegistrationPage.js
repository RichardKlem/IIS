import React, {Component} from 'react'
import axios from "axios";

export class LoginPage extends Component{
    state = {
        name : '',
        surname : '',
        phoneNumber : '',
        birthDate: '',
        email: '',
        password: '',
        passwordCheck: '',
        status: 'Register'
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    onSubmit = (e) => {
        e.preventDefault();
        if (this.state.password !== this.state.passwordCheck) {
            this.setState({ status : "Passwords doesn't match!"});
        }
        axios.post('/registration', {
                name: this.state.name,
                surname: this.state.surname,
                birthDate: this.state.birthDate,
                email: this.state.email,
                phoneNumber: this.state.phoneNumber,
                password: this.state.password
                }).then(res => {
                    this.setState({ status : res.data.status});
                    }
        );
        this.setState({ name: '' });
        this.setState({ surname: '' });
        this.setState({ birthDate: '' });
        this.setState({ email: '' });
        this.setState({ phoneNumber: '' });
        this.setState({ password: '' });
    }

    render() {
        return(
            <React.Fragment>
            <form onSubmit={this.onSubmit} style={{ display: 'block'}}>
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
                    name='surname'
                    placeholder='surname'
                    value={this.state.surname}
                    onChange={this.onChange}
                    required
                />
                <input
                    style={{display: 'block'}}
                    type='tel'
                    name='phoneNumber'
                    placeholder='phone Number'
                    pattern="[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}"
                    value={this.state.phoneNumber}
                    onChange={this.onChange}
                    required
                />
                <input
                    style={{display: 'block'}}
                    type='date'
                    name='birthDate'
                    placeholder='birth Date'
                    value={this.state.birthDate}
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
                    name='passwordCheck'
                    placeholder='password again'
                    value={this.state.passwordCheck}
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