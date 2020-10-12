import React, {Component} from 'react'
import axios from "axios";
import Cookies from 'universal-cookie';
import Users from "./adminAction/Users";
import { ToastContainer, toast } from 'react-toastify';

export class Account extends Component{
    state = {
        name : '',
        phone_number : '',
        birth_date: '',
        email: '',
        status: '',
        image: '',
        users: false,
        selectedFile: null
    }

    componentDidMount() {
        const cookies = new Cookies();
        const cookieUserID = cookies.get('CookieUserID');
        if (typeof cookieUserID === 'undefined' ) {
            this.props.history.push('/login');
        } else {
            axios.post('/account', { CookieUserID: cookieUserID })
                .then(res => {
                    this.setState({ name : res.data.name});
                    this.setState({ birth_date : res.data.birth_date});
                    this.setState({ email : res.data.email});
                    this.setState({ phone_number : res.data.phone_number});
                }
            );
            axios.post('/getUsers', { CookieUserID: cookies.get('CookieUserID')})
                .then(res => {
                    this.setState({users : res.data});
                }
            );

            axios.post('/display', { CookieUserID: cookies.get('CookieUserID')})
                .then(res => {
                    this.setState({image : res.data});
                    }
                );
        }
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    InfoUpdateHandler = (e) => {
        // todo investigate browser's autolick on submit button
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


    userActions = () => {
        return(this.adminAction());
    };

    adminAction() {
        if (this.state.users) {
            return(
                <React.Fragment>
                    <hr style={{ borderTop: '8px solid #bbb', borderRadius: '5px', marginTop : '5px' }}></hr>
                    <h3>User Actions:</h3>
                    <h4>Edit user data:</h4>
                    <Users users={this.state.users}/>
                </React.Fragment>
            );
        }
    };

    logoutHandler = () => {
        const cookies = new Cookies();
        cookies.remove('CookieUserID');
        this.setState({ status : "Logged out successfully" });
        this.props.history.push('/login');
    };

    render() {
        return(
            <React.Fragment>
                <h2>Manage Account</h2>
                <h2>User Information</h2>
                {this.imageHandler()}
                <form onSubmit={this.InfoUpdateHandler}>
                    <div style={{display: 'flex', paddingTop: '5px', paddingBottom: '5px'}}>
                        <p style={{paddingRight: '10px'}}>Name:</p>
                        <input
                            style={{display: 'flex'}}
                            type='text'
                            name='name'
                            placeholder='name'
                            value={this.state.name}
                            onChange={this.onChange}
                            required
                        />
                    </div>
                    <div style={{display: 'flex', paddingTop: '5px', paddingBottom: '5px'}}>
                        <p style={{paddingRight: '10px'}}>Phone number:</p>
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
                    </div>
                    <div style={{display: 'flex', paddingTop: '5px', paddingBottom: '5px'}}>
                        <p style={{paddingRight: '10px'}}>Birth date:</p>
                        <input
                            style={{display: 'block'}}
                            type='date'
                            name='birth_date'
                            placeholder='birth Date'
                            value={this.state.birth_date}
                            onChange={this.onChange}
                            required
                        />
                    </div>
                    <div style={{display: 'flex', paddingTop: '5px', paddingBottom: '5px'}}>
                        <p style={{paddingRight: '10px'}}>Email:</p>
                        <input
                            style={{display: 'block'}}
                            type='email'
                            name='email'
                            placeholder='email'
                            value={this.state.email}
                            onChange={this.onChange}
                            required
                        />
                    </div>
                    <input
                        style={{display: 'block'}}
                        type="submit"
                        value="Submit Changes"
                        className="btn"
                    />
                </form>
                <p>{this.state.status}</p>
                <button onClick={this.logoutHandler}>Logout</button>
                <br/>
                {this.userActions()}
            </React.Fragment>
        );
    };


    imageHandler() {
        return <>
            <img src={`data:image/*;base64,${this.state.image}`} alt='' style={{ borderRadius: '50%', width:'100px', height:'100px'}}/>
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <ToastContainer/>
                        <form method="post" action="#" id="#">
                            <div className="form-group files">
                                <label>Upload your photo </label>
                                <input type="file" name="file" className="form-control"
                                       onChange={this.onChangeHandler}/>
                            </div>
                            <div className="col-md-6 pull-right">
                                <button width="100%" type="button" className="btn btn-info"
                                        onClick={this.fileUploadHandler}>Upload File
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>;
    }

    onChangeHandler=event=>{
        var file = event.target.files[0];
        if(this.validateSize(event)){
            // if return true allow to setState
            this.setState({
                selectedFile: file
            });

        }
    };

    fileUploadHandler = () => {
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        const cookies = new Cookies();
        axios.post('/upload/'+cookies.get('CookieUserID'), data)
            .then(res => { // then print response status
                window.location.reload();
            })
            .catch(err => { // then print response status
                toast.error('upload fail')
            })

    };

    validateSize=(event)=>{
        let file = event.target.files[0];
        let size = 30000;
        let err = '';
        console.log(file.size);
        if (file.size > size) {
            err = file.type+'is too large, please pick a smaller file\n';
            toast.error(err);
        }
        return true
    };
}


export default Account