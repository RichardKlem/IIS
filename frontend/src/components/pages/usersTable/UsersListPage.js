import React, {Component} from 'react'
import axios from "axios";
import Cookies from 'universal-cookie';
import UsersTable from "./UsersTable";

const cookies = new Cookies();
let cookieUserID = cookies.get('CookieUserID');

export class UsersListPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isLoadingError: false,
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
        cookieUserID = cookies.get('CookieUserID');
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
            ).catch(() => {
            this.setState({status: "WARNING: User image not found, please upload new image", isLoadingError: true});
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        cookieUserID = cookies.get('CookieUserID');
        if (typeof (cookieUserID) === "undefined") {
            this.props.history.push('/login');
        }
    }


    render() {
        const {isLoading} = this.state;
        if (isLoading) {
            return (
                <div className="App">Loading...</div>
            );
        } else if (this.state.isLoadingError) {
            return (
                <div className="App">ERROR, please log-out and log-in</div>
            );
        } else {
            return (
                <div>
                    {this.renderUsersTable()}
                </div>
            );
        }
    }

    renderUsersTable() {
        if (this.state.users) {
            return (<UsersTable users={this.state.users}/>);
        }
    };

}


export default UsersListPage