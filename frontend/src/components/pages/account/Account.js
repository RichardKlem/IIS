import React, {Component} from 'react'
import axios from "axios";
import Cookies from 'universal-cookie';
import {Form} from 'react-bootstrap';
import {ToastContainer} from 'react-toastify';
import Required from "../../other/Required";

const cookies = new Cookies();
let cookieUserID = cookies.get('CookieUserID');

export class Account extends Component {

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
            selectedFile: null,
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
                        this.setState({address: res.data.address});
                        this.setState({phone_number: res.data.phone_number});
                        this.setState({role: res.data.role});
                        if (res.data.role === 0) {
                            axios.post('/getUsers', {CookieUserID: cookieUserID})
                                .then(res => {
                                        this.setState({users: res.data});
                                    }
                                );
                        }
                        axios.post('/getProfileImage', {CookieUserID: cookieUserID})
                            .then(res => {
                                    this.setState({image: res.data});
                                    this.setState({isLoading: false})
                                }
                            ).catch(() => {
                            this.setState({status: "ERROR, please reload page", isLoadingError: true})
                        });
                    }
                ).catch(() => {
                this.setState({status: "ERROR, please reload page", isLoadingError: true})
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        cookieUserID = cookies.get('CookieUserID');
        if (typeof (cookieUserID) === "undefined") {
            this.props.history.push('/login');
        }
    }


    render() {
        const {isLoading} = this.state;
     if (this.state.isLoadingError) {
         return (
             <div className="App">ERROR, please log-out and log-in</div>
         );
     }else if (isLoading) {
            return (
                <div className="App">Loading...</div>
            );
        } else {
            return (
                <div className="card">
                    <div className="card-body">
                        <h2 className="card-title">My Account</h2>
                        <h3 className="card-description"> User Information </h3>
                        <div className="d-flex padding-bottom-40">
                            <img src={`data:image/*;base64,${this.state.image}`} alt=''
                                 className="img"/>
                            <div className="padding-left-20">
                                <div className="row">
                                    <div className="col-md-6">
                                        <ToastContainer/>
                                        <form method="post" action="#" id="#">
                                            <div className="padding-left-10 padding-bottom-10 padding-top-25">
                                                <label>Upload your profile photo</label>
                                                <input type="file" name="file"
                                                       onChange={this.onChangeFileUploadHandler}/>
                                            </div>
                                            <div className="d-flex">
                                                <p>{this.state.fileUploadErrMsg}</p>
                                                <button style={this.getUploadButtonStyle()} type="button"
                                                        className="btn btn-info" onClick={this.fileUploadHandler}>Upload
                                                    File
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={this.InfoUpdateHandler}>
                            <Form.Group className="row">
                                <label className="col-sm-3 col-form-label"><Required text="Full Name"/></label>
                                <div className="col-sm-9">
                                    <Form.Control type="text" name='name'
                                                  defaultValue={this.state.name} onChange={this.onChange}
                                                  placeholder="Full Name" required/>
                                </div>
                            </Form.Group>
                            <Form.Group className="row">
                                <label className="col-sm-3 col-form-label"><Required text="Email"/></label>
                                <div className="col-sm-9">
                                    <Form.Control type="email" name='email'
                                                  defaultValue={this.state.email} onChange={this.onChange}
                                                  placeholder="Email" required/>
                                </div>
                            </Form.Group>
                            <Form.Group className="row">
                                <label className="col-sm-3 col-form-label">Mobile</label>
                                <div className="col-sm-9">
                                    <Form.Control type="tel" name='phone_number'
                                                  defaultValue={this.state.phone_number} onChange={this.onChange}
                                                  placeholder="Mobile Number"/>
                                </div>
                            </Form.Group>
                            <Form.Group className="row">
                                <label className="col-sm-3 col-form-label">Birth
                                    Date</label>
                                <div className="col-sm-9">
                                    <Form.Control type="date" name='birth_date'
                                                  defaultValue={this.state.birth_date} onChange={this.onChange}
                                                  placeholder="Birth Date"/>
                                </div>
                            </Form.Group>
                            <Form.Group className="row">
                                <label className="col-sm-3 col-form-label">Address</label>
                                <div className="col-sm-9">
                                    <Form.Control type="text" name='address'
                                                  defaultValue={this.state.address} onChange={this.onChange}
                                                  placeholder="Address"/>
                                </div>
                            </Form.Group>
                            <Form.Control type="submit"
                                          className="btn btn-block btn-primary"
                                          value="Submit Changes"/>
                        </form>
                        <div className="text-center font-weight-bold">
                            {this.state.status}
                        </div>
                    </div>
                </div>
            );
        }
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});

    InfoUpdateHandler = (e) => {
        e.preventDefault();
        axios.post('/updateAccount', {
            CookieUserID: cookies.get('CookieUserID'),
            name: this.state.name,
            birth_date: this.state.birth_date,
            email: this.state.email,
            address: this.state.address,
            phone_number: this.state.phone_number,
        }).then(res => {
                this.setState({status: res.data});
            }
        );
    }


    /* File Upload Functions */
    getUploadButtonStyle = () => {
        return {
            display: this.state.fileUploadAvailable ?
                'flex' : 'none'
        }
    }

    onChangeFileUploadHandler = (e) => {
        const file = e.target.files[0];
        if (this.validateFileSize(e)) {
            this.setState({selectedFile: file, fileUploadAvailable: true, fileUploadErrMsg: ''});

        }
    };

    validateFileSize = (e) => {
        let file = e.target.files[0];

        if (!file) {
            this.setState({selectedFile: null, fileUploadAvailable: false, fileUploadErrMsg: 'Please select a photo.'});
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


export default Account