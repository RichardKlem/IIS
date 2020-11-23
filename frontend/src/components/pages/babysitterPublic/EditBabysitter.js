import React, {Component} from 'react'
import {ToastContainer} from "react-toastify";
import {Link} from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import Required from "../../other/Required";

const cookies = new Cookies();
const cookieUserID = cookies.get('CookieUserID');

export class EditBabysitter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            /* babysitter data */
            id_babysitter: undefined,
            name: undefined,
            description: undefined,
            phone_number: undefined,
            age: undefined,
            price_hour: undefined,
            /* File upload variables */
            image: undefined,
            newImageWasUploaded: false,
            fileUploadErrMsg: '',
            selectedFile: null,
            /* User */
            role: 5,
        }
    }


    componentDidMount() {
        const id = window.location.pathname.replace("/editBabysitter/", "");
        this.setState({id_babysitter: id})
        if (typeof (cookieUserID) !== "undefined") {
            axios.post('/getUserRole', {CookieUserID: cookieUserID})
                .then(res => {
                    this.setState({role: res.data.role});
                });
        }
        axios.post('/getBabysitter', {id_babysitter: id})
            .then((res) => {
                this.setState({
                    id_babysitter: res.data.id_babysitter,
                    name: res.data.name,
                    description: res.data.description,
                    phone_number: res.data.phone_number,
                    age: res.data.age,
                    price_hour: res.data.price_hour,
                });
                axios.post('/getBabysitterImg', {id_babysitter: id})
                    .then(res => {
                            this.setState({image: res.data});
                            this.setState({isLoading: false});
                        }
                    );
            });
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
                    <div className="d-flex align-items-center">
                        <div className="w-100 mx-0">
                            <div>
                                <div className="text-left py-5">
                                    <h4>Edit Babysitter</h4>
                                    <h6 className="font-weight-light">Please edit the form underneath</h6>
                                    <div className="d-flex">
                                        {this.addBabysitterPhoto()}
                                    </div>
                                    <fieldset>
                                    <form className="pt-3">
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
                                        {this.getSubmitOption()}
                                    </form>
                                </fieldset>
                                    <div className="text-center mt-4 font-weight-bold">
                                        {this.state.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }


    onChange = (e) => this.setState({[e.target.name]: e.target.value});


    editBabysitterHandler = (e) => {
        if (this.state.name !== "" && this.state.phone_number !== "" && this.state.price_hour !== "") {
            e.preventDefault()
            if (this.state.role < 3) {
                axios.post('/editBabysitter', {
                    id_babysitter: this.state.id_babysitter,
                    name: this.state.name,
                    description: this.state.description,
                    phone_number: this.state.phone_number,
                    age: this.state.age,
                    price_hour: this.state.price_hour
                })
                    .then(() => {
                        this.setState({status: " Babysitter's info updated successfully.\n"});
                        if (this.state.newImageWasUploaded) {
                            const data = new FormData()
                            data.append('file', this.state.selectedFile)
                            axios.post('/uploadBabysitterImg/' + this.state.id_babysitter, data)
                                .then(() => {
                                    this.setState({status: this.state.status + "Image was uploaded successfully."});
                                })
                                .catch(() => { // then print response status
                                    this.setState({status: this.state.status + "ERROR: Image wasn't uploaded."});
                                })
                        }
                    })
                    .catch(() => {
                        this.setState({status: this.state.status + "\nERROR: Babysitter's info wasn't updated, please contact support!"});
                    });
            } else {
                this.setState({status: this.state.status + "\nERROR: You don't have required permission to edit a babysitter!"});
            }
        }
    }


    getSubmitOption() {
        if (this.state.role < 4) {
            return(
                <div className="d-flex padding-bottom-20">
                    <button style={this.getSubmitButtonStyle()} onClick={this.editBabysitterHandler}
                            className="btn btn-block btn-primary padding-10" type="submit">Submit changes
                    </button>
                    <div className="padding-10"/>
                    <Link to={"/adminBabysitters"}
                          className="mr-2 btn btn-block btn-primary btn-warning padding-10">Return to list view</Link>
                </div>);
        }

    }

    addBabysitterPhoto = () => {
        return (
            <div className="d-flex">
                {this.getImg()}
                <div className="add-img-lower">
                    <div className="row">
                        <div className="col-md-6">
                            <ToastContainer/>
                            <div className="padding-bottom-10">
                                <label>Upload babysitter photo</label>
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


    getImg() {
        if (this.state.newImageWasUploaded === false) {
            return <img className="item-list-style-img-200" src={`data:image/*;base64,${this.state.image}`} alt=''/>;
        } else {
            return <img className="item-list-style-img-200" src={this.state.image} alt=''/>;
        }
    }

    getSubmitButtonStyle = () => {
        return {
            display: 'block'
        }
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
        this.setState({image: URL.createObjectURL(e.target.files[0]), newImageWasUploaded: true})
        return true;
    };
}

export default EditBabysitter
