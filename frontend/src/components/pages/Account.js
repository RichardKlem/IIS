import React, {Component} from 'react'
import axios from "axios";
import Cookies from 'universal-cookie';
import Users from "./usersTable/Users";
import { Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

const cookies = new Cookies();
export class Account extends Component{
    state = {
        name : '',
        phone_number : '',
        birth_date: '',
        email: '',
        address: '',
        status: '',
        image: '',
        users: false,
        selectedFile: null
    }

    componentDidMount() {
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

            axios.post('/getProfileImage', { CookieUserID: cookies.get('CookieUserID')})
                .then(res => {
                    this.setState({image : res.data});
                    }
                );
        }
    }
    render() {
        return(
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Manage Account</h2>
                    <h3 className="card-description"> User Information </h3>
                    <div style={{display:'flex', paddingBottom: '40px'}}>
                        {this.imageHandler()}
                    </div>
                    <form className="forms-sample" onSubmit={this.InfoUpdateHandler}>
                        <Form.Group className="row">
                            <label htmlFor="exampleInputUsername2" className="col-sm-3 col-form-label">Full Name</label>
                            <div className="col-sm-9">
                                <Form.Control type="text" className="form-control" name='name' defaultValue={this.state.name} onChange={this.onChange} placeholder="Full Name" required/>
                            </div>
                        </Form.Group>
                        <Form.Group className="row">
                            <label htmlFor="exampleInputEmail2" className="col-sm-3 col-form-label">Email</label>
                            <div className="col-sm-9">
                                <Form.Control type="email" className="form-control" name='email' defaultValue={this.state.email} onChange={this.onChange} placeholder="Email" required/>
                            </div>
                        </Form.Group>
                        <Form.Group className="row">
                            <label htmlFor="exampleInputMobile" className="col-sm-3 col-form-label">Mobile</label>
                            <div className="col-sm-9">
                                <Form.Control type="tel" className="form-control" name='phone_number' pattern="[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}" defaultValue={this.state.phone_number} onChange={this.onChange} placeholder="Mobile Number" required/>
                            </div>
                        </Form.Group>
                        <Form.Group className="row">
                            <label htmlFor="exampleInputMobile" className="col-sm-3 col-form-label">Birth Date</label>
                            <div className="col-sm-9">
                                <Form.Control type="date" className="form-control" name='birth_date' defaultValue={this.state.birth_date} onChange={this.onChange} placeholder="Birth Date" required/>
                            </div>
                        </Form.Group>
                        <Form.Group className="row">
                            <label htmlFor="exampleInputMobile" className="col-sm-3 col-form-label">Address</label>
                            <div className="col-sm-9">
                                <Form.Control type="text" className="form-control" name='address' defaultValue={this.state.address} onChange={this.onChange} placeholder="Address" required/>
                            </div>
                        </Form.Group>
                        <Form.Control type="submit" className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn mr-2" value="Submit Changes"/>
                    </form>
                    <div className="text-center mt-4 font-weight-bold">
                        {this.state.status}
                    </div>
                </div>
                <br/>
                {this.userActions()}
            </div>
        );
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    InfoUpdateHandler = (e) => {
        // todo investigate browser's autolick on submit button
        e.preventDefault();
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
                <div>
                    <hr style={{ borderTop: '8px solid #bbb', borderRadius: '5px', marginTop : '5px' }}></hr>
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Actions</h2>
                            <h4 className="card-description"> User table:</h4>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Full Name</th>
                                        <th>Mobile</th>
                                        <th>Email</th>
                                        <th>Birth Date</th>
                                        <th>Address</th>
                                        <th>Role</th>
                                        <th>Submit</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <Users users={this.state.users}/>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };


    imageHandler() {
        return <>
            <img src={`data:image/*;base64,${this.state.image}`} alt='' style={{ borderRadius: '50%', width:'100px', height:'100px'}}/>
            <div style={{ paddingLeft:'20px' }}>
                <div className="row">
                    <div className="col-md-6">
                        <ToastContainer/>
                        <form method="post" action="#" id="#">
                            <div style={{ paddingBottom:'10px' }}>
                                <label>Upload your profile photo </label>
                                <input type="file" name="file" onChange={this.onChangeHandler}/>
                            </div>
                            <div className="">
                                <button width="100%" type="button" className="btn btn-info" onClick={this.fileUploadHandler}>Upload File</button>
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