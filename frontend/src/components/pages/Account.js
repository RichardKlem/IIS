import React, {Component} from 'react'
import axios from "axios";
import Cookies from 'universal-cookie';

export class Account extends Component{
    state = {
        name : '',
        phone_number : '',
        birth_date: '',
        email: '',
        user_id: '',
    }

    componentDidMount() {
        const cookies = new Cookies();
        axios.post('/account', { CookieUserID: cookies.get('CookieUserID') }).then(res => {
            this.setState({ name : res.data.name});
            this.setState({ birth_date : res.data.birth_date});
            this.setState({ email : res.data.email});
            this.setState({ phone_number : res.data.phone_number});
            }
        );
    }

    render() {
        return(
            <React.Fragment>
                <p>Name: {this.state.name}</p>
                <p>Birth Date: {this.state.birth_date}</p>
                <p>e-mail: {this.state.email}</p>
                <p>Phone number: {this.state.phone_number}</p>
            </React.Fragment>
        );
    }
}

export default Account