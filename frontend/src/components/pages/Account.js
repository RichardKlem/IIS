import React, {Component} from 'react'
import axios from "axios";
import Cookies from 'universal-cookie';

export class Account extends Component{
    state = {
        name : '',
        phone_number : '',
        birth_date: '',
        email: '',
        status: '',
    }

    componentDidMount() {
        const cookies = new Cookies();
        const cookieUserID = cookies.get('CookieUserID');
        if (typeof cookieUserID === 'undefined' ) {
            this.props.history.push('/login');
        } else {
            axios.post('/account', { CookieUserID: cookieUserID }).then(res => {
                    this.setState({ name : res.data.name});
                    this.setState({ birth_date : res.data.birth_date});
                    this.setState({ email : res.data.email});
                    this.setState({ phone_number : res.data.phone_number});
                }
            );
        }
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    InfoUpdateHandler = (e) => {
        e.preventDefault();
        const cookies = new Cookies();
        axios.post('/updateAccount', {
            CookieUserID: cookies.get('CookieUserID'),
            name: this.state.name,
            birth_date: this.state.birth_date,
            email: this.state.email,
            phone_number: this.state.phone_number,
        }).then(res => {
            this.setState({ status : res.data});
            }
        );
    }

    render() {
        return(
            <React.Fragment>
                <h2>Manage Account</h2>
                <form onSubmit={this.InfoUpdateHandler} style={{ display: 'block'}}>
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
                        type="submit"
                        value="Submit Changes"
                        className="btn"
                    />
                </form>
                <p>{ this.state.status }</p>
            </React.Fragment>
        );
    }
}

export default Account