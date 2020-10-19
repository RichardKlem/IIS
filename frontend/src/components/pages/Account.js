import React, {Component} from 'react'
import axios from "axios";
import Cookies from 'universal-cookie';
import Users from "./usersTable/Users";
import { Form } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import HotelsList from "./hotelsPublic/HotelsList";

const cookies = new Cookies();
export class Account extends Component{
    state = {
        /* User data */
        name : '',
        phone_number : '',
        birth_date: '',
        email: '',
        address: '',
        status: '',
        image: '',
        role: 5,
        /* Admin change users' data */
        users: null,
        /* File upload variables */
        fileUploadErrMsg:'',
        fileUploadAvailable:false,
        selectedFile: null
    }

    componentDidMount() {
        const cookieUserID = cookies.get('CookieUserID');
        if (typeof(cookieUserID) === 'undefined') {
            this.props.history.push('/login');
        } else {
            axios.post('/account', {CookieUserID: cookieUserID})
                .then(res => {
                        this.setState({name: res.data.name});
                        this.setState({birth_date: res.data.birth_date});
                        this.setState({email: res.data.email});
                        this.setState({phone_number: res.data.phone_number});
                    }
                );

            axios.post('/getUsers', {CookieUserID: cookieUserID})
                .then(res => {
                        this.setState({users: res.data});
                    }
                );

            axios.post('/getUserRole', {CookieUserID: cookieUserID})
                .then(res => {
                        this.setState({role: res.data.role});
                    }
                );

            axios.post('/getProfileImage', {CookieUserID: cookieUserID})
                .then(res => {
                        this.setState({image: res.data});
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
                        {this.getProfilePhoto()}
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
        if (this.state.role === 0) {
            return(
                <div>
                    <hr style={{borderTop: '8px solid #bbb', borderRadius: '5px', marginTop: '5px'}}></hr>
                    {this.adminUserAction()}
                    <hr style={{borderTop: '8px solid #bbb', borderRadius: '5px', marginTop: '5px'}}></hr>
                    <HotelsList/>
                </div>
            )
        } else if (this.state.role === 1) {
            return(
                <div>
                    <hr style={{borderTop: '8px solid #bbb', borderRadius: '5px', marginTop: '5px'}}></hr>
                    <HotelsList/>
                </div>
            )
        }

    };

    filterTableColumnFunction = () => {
        let rowWasHidden = false;
        const keys = ["0", "1", "2", "3", "4", "5", "6"];
        for (let key of keys) {
            // Declare variables
            let input, filter, table, tr, td, i, txtValue;
            input = document.getElementById(key);
            if ( input === null ){
                return
            }
            filter = input.value.toUpperCase();
            table = document.getElementById("myTable");
            tr = table.getElementsByTagName("tr");

            // Loop through all table rows, and hide those who don't match the search query
            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[key];
                if (typeof(td) !== 'undefined') {
                    td = td.getElementsByTagName("input")[0];
                    if (td) {
                        txtValue = td.value;
                        if (txtValue.toUpperCase().indexOf(filter) > -1 && (tr[i].style.display !== "none" || rowWasHidden === false)) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                            rowWasHidden = true;
                        }
                    }
                }
            }
        }
    }

    /* Action for admin user to manipulate with other users' data */
    adminUserAction() {
        if (this.state.users) {
            return(
                <div>
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Actions</h2>
                            <h4 className="card-description"> User table:</h4>
                            <div className="table-responsive">
                                <table className="table table-hover" id="myTable">
                                    <thead>
                                    <tr>
                                        <th>ID<input style={{ minWidth:'100px', maxWidth:'auto/5'}} className="text-center form-control form-control-sm" type="text" id="0" onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Full Name<input style={{ width:'auto' }} className="text-center form-control form-control-sm" type="text" id="1" onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Mobile<input style={{ width:'auto' }} className="text-center form-control form-control-sm" type="tel" pattern="[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}" id="2" onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Email<input style={{ width:'auto' }} className="text-center form-control form-control-sm" type="email" id="3" onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Birth Date<input style={{ width:'auto' }} className="text-center form-control form-control-sm" type="date" id="4" onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Address<input style={{ width:'auto' }} className="text-center form-control form-control-sm" type="text" id="5" onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Role<input style={{ minWidth:'40px', maxWidth:'auto/5' }} className="text-center form-control form-control-sm" type="text" id="6" maxLength="1" onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Submit<input style={{ width:'auto' }} className="text-center form-control form-control-sm" type="text" id="7" readOnly/></th>
                                        <th>Status<input style={{ width:'auto' }} className="text-center form-control form-control-sm" type="text" id="8" readOnly/></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {this.getAllUserData()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    getAllUserData() {
        return <Users users={this.state.users}/>;
    }

    getProfilePhoto() {
        return <>
            <img src={`data:image/*;base64,${this.state.image}`} alt='' style={{ borderRadius: '50%', width:'100px', height:'100px'}}/>
            <div style={{ paddingLeft:'20px' }}>
                <div className="row">
                    <div className="col-md-6">
                        <ToastContainer/>
                        <form method="post" action="#" id="#">
                            <div style={{ paddingBottom:'10px' }}>
                                <label>Upload your profile photo </label>
                                <input type="file" name="file" onChange={this.onChangeFileUploadHandler}/>
                            </div>
                            <div style={{display: 'flex'}}>
                                <p>{this.state.fileUploadErrMsg}</p>
                                <button width="100%" style={this.getUploadButtonStyle()} type="button" className="btn btn-info" onClick={this.fileUploadHandler}>Upload File</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>;
    }


    /* File Upload Functions */
    getUploadButtonStyle = () => {
        return {
            display: this.state.fileUploadAvailable ?
                'flex' : 'none'
        }
    }

    onChangeFileUploadHandler = (e) => {
        var file = e.target.files[0];
        if (this.validateFileSize(e)) {
            this.setState({ selectedFile: file, fileUploadAvailable : true, fileUploadErrMsg: '' });

        }
    };

    validateFileSize = (e) => {
        let file = e.target.files[0];
        let size = 30000;

        if (!file) {
            this.setState({selectedFile : null, fileUploadAvailable : false, fileUploadErrMsg : 'Please select a photo.'});
            return false;
        }

        if (file.size > size) {
            this.setState({selectedFile : null, fileUploadAvailable : false, fileUploadErrMsg : 'File is too large, please pick a smaller file.'});
            return false;
        }
        if (file.type.split("/")[0] !== "image" ) {
            this.setState({selectedFile : null, fileUploadAvailable : false, fileUploadErrMsg : 'Please select a photo.'});
            return false;
        }
        return true;
    };

    fileUploadHandler = () => {
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        const cookies = new Cookies();
        axios.post('/upload/'+cookies.get('CookieUserID'), data)
            .then(res => { // then print response status
                window.location.reload(false);
            })
            .catch(err => { // then print response status
                this.setState({selectedFile : null, fileUploadAvailable : false, fileUploadErrMsg : 'Upload Failed, please try again.'});
            })
    };
}


export default Account