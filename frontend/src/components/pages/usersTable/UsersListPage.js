import React, {Component} from 'react'
import axios from "axios";
import Cookies from 'universal-cookie';
import UsersTable from "./UsersTable";

const cookies = new Cookies();

export class UsersListPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            /* User data */
            name: undefined,
            phone_number: undefined,
            birth_date: undefined,
            email: undefined,
            address: undefined,
            status: undefined,
            image: undefined,
            role: 5,
            /* Admin change users' data */
            users: undefined,
            /* File upload variables */
            fileUploadErrMsg: '',
            fileUploadAvailable: false,
            selectedFile: null
        }
    }

    componentDidMount() {
        const cookieUserID = cookies.get('CookieUserID');
        if (typeof (cookieUserID) === 'undefined') {
            this.props.history.push('/login');
        } else {
            axios.post('/account', {CookieUserID: cookieUserID})
                .then(res => {
                        this.setState({name: res.data.name});
                        this.setState({birth_date: res.data.birth_date});
                        this.setState({email: res.data.email});
                        this.setState({phone_number: res.data.phone_number});
                        this.setState({address: res.data.address});
                        this.setState({role: res.data.role});
                        if (res.data.role === 0) {
                            axios.post('/getUsers', {CookieUserID: cookieUserID})
                                .then(res => {
                                        this.setState({users: res.data});
                                    }
                                );
                        }
                    }
                );
        }
        axios.post('/getProfileImage', {CookieUserID: cookieUserID})
            .then(res => {
                    this.setState({image: res.data});
                    this.setState({isLoading: false})
                }
            );
    }


    render() {
        const {isLoading} = this.state;
        if (isLoading) {
            return (
                <div className="App">Loading...</div>
            );
        } else {
            return (
                <div>
                    {this.renderUsersTable()}
                </div>
            );
        }
    }


    /* Action for admin user to manipulate with other users' data */
    renderUsersTable() {
        if (this.state.users) {
            return (<UsersTable users={this.state.users}/>);
        }
    };

}


export default UsersListPage