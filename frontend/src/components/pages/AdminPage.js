import React, {Component} from 'react'
import axios from "axios";
import Cookies from 'universal-cookie';
import UsersTable from "./usersTable/UsersTable";

const cookies = new Cookies();

export class AdminPage extends Component {

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

    onChange = (e) => this.setState({[e.target.name]: e.target.value});


    /* Action for admin user to manipulate with other users' data */
    renderUsersTable() {
        if (this.state.users) {
            return (<UsersTable users={this.state.users}/>);
        }
    };


    onChangeFileUploadHandler = (e) => {
        const file = e.target.files[0];
        if (this.validateFileSize(e)) {
            this.setState({selectedFile: file, fileUploadAvailable: true, fileUploadErrMsg: ''});

        }
    };

    validateFileSize = (e) => {
        let file = e.target.files[0];
        let size = 30000;

        if (!file) {
            this.setState({selectedFile: null, fileUploadAvailable: false, fileUploadErrMsg: 'Please select a photo.'});
            return false;
        }

        if (file.size > size) {
            this.setState({
                selectedFile: null,
                fileUploadAvailable: false,
                fileUploadErrMsg: 'File is too large, please pick a smaller file.'
            });
            return false;
        }
        if (file.type.split("/")[0] !== "image") {
            this.setState({selectedFile: null, fileUploadAvailable: false, fileUploadErrMsg: 'Please select a photo.'});
            return false;
        }
        return true;
    };

    fileUploadHandler = () => {
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        const cookies = new Cookies();
        axios.post('/upload/' + cookies.get('CookieUserID'), data)
            .then(res => { // then print response status
                window.location.reload(false);
            })
            .catch(err => { // then print response status
                this.setState({
                    selectedFile: null,
                    fileUploadAvailable: false,
                    fileUploadErrMsg: 'Upload Failed, please try again.'
                });
            })
    };
}


export default AdminPage