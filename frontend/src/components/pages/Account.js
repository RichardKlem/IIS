import React, {Component} from 'react'
import axios from "axios";
import Cookies from 'universal-cookie';

export class Account extends Component{
    state = {
        name : '',
        surname : '',
        phoneNumber : '',
        birthDate: '',
        email: '',
        userId: '',
    }

    componentDidMount() {
        const cookies = new Cookies();
        axios.post('/account', { userId: cookies.get('userID') }).then(res => {
            this.setState({ name : res.data.name});
            this.setState({ surname : res.data.surname});
            this.setState({ birthDate : res.data.birthDate});
            this.setState({ email : res.data.email});
            this.setState({ phoneNumber : res.data.phoneNumber});
            }
        );
    }

    render() {
        return(
            <React.Fragment>
                <p>Name: {this.state.name}</p>
                <p>Surname: {this.state.surname}</p>
                <p>Birth Date: {this.state.birthDate}</p>
                <p>e-mail: {this.state.email}</p>
                <p>Phone number: {this.state.phoneNumber}</p>
            </React.Fragment>
        );
    }
}

export default Account