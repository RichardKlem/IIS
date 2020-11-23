import React, {Component} from 'react'
import {ToastContainer} from "react-toastify";
import axios from "axios";
import Cookies from "universal-cookie";
import Required from "../../other/Required";

const cookies = new Cookies();
const cookieUserID = cookies.get('CookieUserID');

export class AddBabysitter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            /* babysitter data */
            name: undefined,
            phone_number: undefined,
            description: undefined,
            age: undefined,
            price_hour: undefined,
            /* File upload variables */
            image: undefined,
            fileUploadErMsg: '',
            selectedFile: null,
            /* User */
            role: 5,
        }
    }


    render() {
            return (
                <div>
                    <div className="d-flex align-items-center px-0">
                        <div className="w-100 mx-0">
                            <div>
                                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                    <h4>Add new Babysitter</h4>
                                    <h6 className="font-weight-light">Please fill the form underneath </h6>
                                    <div className="d-flex">
                                        {this.addBabysitterPhoto()}
                                    </div>
                                    <form className="pt-3" onSubmit={this.AddBabysitterHandler}>
                                        <div className="form-group">
                                            <Required text="Name"/>
                                            <input type="text" className="form-control" name='name'
                                                   placeholder='Name' defaultValue={this.state.name}
                                                   onChange={this.onChange} required/>
                                        </div>
                                        <div className="form-group">
                                            <Required text="Age"/>
                                            <input type="text" className="form-control" name='age'
                                                   placeholder='Age' defaultValue={this.state.age}
                                                   onChange={this.onChange} required/>
                                        </div>
                                        <div className="form-group">
                                            <Required text="Phone Number"/>
                                            <input type="text" className="form-control" name='phone_number'
                                                   placeholder="Phone Number" defaultValue={this.state.phone_number}
                                                   onChange={this.onChange} required/>
                                        </div>
                                        <div className="form-group">
                                            Description
                                            <textarea value={this.state.description} className="form-control"
                                                      name='description' placeholder='Description' rows="4"
                                                      onChange={this.onChange}>{this.state.description}</textarea>
                                        </div>
                                        <div className="form-group">
                                            <Required text="Price per hour"/>
                                            <input type="number" className="form-control"
                                                   name='price_hour' placeholder='Price per hour'
                                                   defaultValue={this.state.price_hour} onChange={this.onChange}
                                                   required/>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="submit"
                                                value="Add Babysitter"
                                                className="btn btn-block btn-primary "
                                            />
                                        </div>
                                        <div className="text-center mt-4">
                                            {this.state.status}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});

    onChangeCheckbox = (e) => {
        if (e.target.value === "false") {
            this.setState({[e.target.name]: true});
        } else {
            this.setState({[e.target.name]: false});
        }
    }

    AddBabysitterHandler = (e) => {
        e.preventDefault();
        let id_babysitter = null;
        if (typeof (cookieUserID) !== "undefined") {
            axios.post('/getUserRole', {CookieUserID: cookieUserID})
                .then(res => {
                    this.setState({role: res.data.role});
                    if (res.data.role < 4) {
                        axios.post('/addBabysitter', {
                            name: this.state.name,
                            description: this.state.description,
                            phone_number: this.state.phone_number,
                            age: this.state.age,
                            price_hour: this.state.price_hour
                        })
                            .then(res => {
                                id_babysitter = res.data
                                if (this.state.image !== undefined || id_babysitter !== null) {
                                    const data = new FormData()
                                    data.append('file', this.state.selectedFile)
                                    axios.post('/uploadBabysitterImg/' + id_babysitter, data).then(() => {
                                    })
                                        .catch(err => { // then print response status
                                            this.setState({status: this.state.status + "ERROR: Image wasn't uploaded."});
                                        })

                                }
                                this.props.history.push('/adminBabysitters');
                            })
                            .catch(err => {
                                this.setState({status: this.state.status + "\nERROR: Room wasn't inserted, please contact support!"});
                            });
                    } else {
                        this.setState({status: this.state.status + "\nERROR: You don't have required permission to add new babysitter!"});
                    }
                });
        } else {
            this.setState({status: this.state.status + "\nERROR: Please log-in and try again"});
        }
    }

    addBabysitterPhoto = () => {
        return (
            <div className="d-flex">
                <img src={this.state.image} alt='' className="item-list-style-img-200"/>
                <div className="add-img-lower">
                    <div className="row">
                        <div className="col-md-6">
                            <ToastContainer/>
                            <div className="padding-bottom-10">
                                <label className="padding-left-10">Upload babysitter photo</label>
                                <input type="file" name="file" onChange={this.onChangeFileUploadHandler}/>
                            </div>
                            <div className="d-flex">
                                <p>{this.state.fileUploadErrMsg}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    /* File Upload Functions */
    onChangeFileUploadHandler = (e) => {
        let file = e.target.files[0];
        if (this.validateFile(e)) {
            this.setState({selectedFile: file, fileUploadErrMsg: ''});
        }
    };

    validateFile = (e) => {
        let file = e.target.files[0];
        if (!file || file.type.split("/")[0] !== "image") {
            this.setState({selectedFile: undefined, image: undefined, fileUploadErrMsg: 'Please select a photo.'});
            return false;
        }
        this.setState({image: URL.createObjectURL(e.target.files[0])})
        return true;
    };
}

export default AddBabysitter
