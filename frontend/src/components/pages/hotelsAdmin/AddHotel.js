import React, {Component} from 'react'
import {ToastContainer} from "react-toastify";
import axios from "axios";
import Cookies from "universal-cookie";
import Required from "../../other/Required";

const cookies = new Cookies();
const cookieUserID = cookies.get('CookieUserID');

export class AddHotel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: undefined,
            address: undefined,
            description: undefined,
            phone_number: undefined,
            email: undefined,
            category: "1",
            rating: undefined,
            hotel_id: undefined,
            free_cancellation: false,
            no_prepayment: false,
            free_wifi: false,
            gym: false,
            spa: false,
            swimming_pool: false,
            /* File upload variables */
            image: undefined,
            fileUploadErrMsg: undefined,
            selectedFile: undefined,
            /* Status */
            status: "",
            /* User */
            role: 5,
        }
    }

    render() {
        return (
            <div>
                <div className="d-flex align-items-center">
                    <div className="w-100 mx-0">
                        <div>
                            <div className="text-left py-5">
                                <h4>Add new hotel.</h4>
                                <h6 className="font-weight-light">Please fill the form underneath </h6>
                                <div className="d-flex">
                                    {this.addHotelPhoto()}
                                </div>
                                <form className="pt-3" onSubmit={this.AddHotelHandler}>
                                    <div className="form-group">
                                        <Required text="Name"/>
                                        <input type="text" className="form-control" name='name'
                                               placeholder='Name' defaultValue={this.state.name}
                                               onChange={this.onChange} required/>
                                    </div>
                                    <div className="form-group">
                                        Description
                                        <textarea defaultValue={this.state.description} className="form-control"
                                                  name='description' placeholder='Description' rows="4"
                                                  onChange={this.onChange} >{this.state.description}</textarea>
                                    </div>
                                    <div className="form-group">
                                        Address
                                        <input type="text" className="form-control" name='address'
                                               placeholder='Address' defaultValue={this.state.address}
                                               onChange={this.onChange} />
                                    </div>
                                    <div className="form-group">
                                        Phone number
                                        <input type="tel" className="form-control" name='phone_number'
                                               placeholder='Phone Number'
                                               defaultValue={this.state.phone_number} onChange={this.onChange}
                                               />
                                    </div>
                                    <div className="form-group">
                                        Email
                                        <input type="tel" className="form-control" name='email'
                                               placeholder="Email" defaultValue={this.state.email}
                                               onChange={this.onChange} />
                                    </div>
                                    <div className="form-group">
                                        Rating
                                        <input type="number" className="form-control" name='rating'
                                               placeholder='Rating (0-5 stars)' min="0" max="5"
                                               defaultValue={this.state.rating} onChange={this.onChange} />
                                    </div>
                                    <div className="form-group">
                                        Category
                                        <select name="category" defaultValue={this.state.category}
                                                className="form-control" onChange={this.onChange}>
                                            <option value="1">Standard Hotel</option>
                                            <option value="2">Business Hotel</option>
                                            <option value="3">Airport Hotel</option>
                                            <option value="4">B&B</option>
                                            <option value="5">Casino Hotel</option>
                                            <option value="6">Studio</option>
                                            <option value="7">Conference Hotel</option>
                                            <option value="8">Economy Hotel</option>
                                        </select>
                                    </div>
                                    <div className="padding-bottom-20">
                                        <div className="form-group padding-bottom-20">
                                            Other
                                        </div>
                                        <div className="other-input d-flex">
                                            <div className="form-check padding-right-10">
                                                <label className="form-check-label">
                                                    <input className="checkmark" name="no_prepayment"
                                                           defaultChecked={this.state.no_prepayment}
                                                           defaultValue={this.state.no_prepayment} type="checkbox"
                                                           onChange={this.onChangeCheckbox}/>
                                                    <span className="checkmark"> </span>
                                                    No prepayment
                                                </label>
                                            </div>
                                            <div className="form-check padding-right-10">
                                                <label className="form-check-label">
                                                    <input className="checkmark" name="free_cancellation"
                                                           defaultChecked={this.state.free_cancellation}
                                                           defaultValue={this.state.free_cancellation} type="checkbox"
                                                           onChange={this.onChangeCheckbox}/>
                                                    <span className="checkmark"> </span>
                                                    Free cancellation
                                                </label>
                                            </div>
                                            <div className="form-check padding-right-10">
                                                <label className="form-check-label">
                                                    <input className="checkmark" name="free_wifi"
                                                           defaultChecked={this.state.free_wifi}
                                                           defaultValue={this.state.free_wifi} type="checkbox"
                                                           onChange={this.onChangeCheckbox}/>
                                                    <span className="checkmark"> </span>
                                                    Free wifi
                                                </label>
                                            </div>
                                            <div className="form-check padding-right-10">
                                                <label className="form-check-label">
                                                    <input className="checkmark" name="spa"
                                                           defaultChecked={this.state.spa} defaultValue={this.state.spa}
                                                           type="checkbox" onChange={this.onChangeCheckbox}/>
                                                    <span className="checkmark"> </span>
                                                    SPA
                                                </label>
                                            </div>
                                            <div className="form-check padding-right-10">
                                                <label className="form-check-label">
                                                    <input className="checkmark" name="gym"
                                                           defaultChecked={this.state.gym} defaultValue={this.state.gym}
                                                           type="checkbox" onChange={this.onChangeCheckbox}/>
                                                    <span className="checkmark"> </span>
                                                    Gym
                                                </label>
                                            </div>
                                            <div className="form-check padding-right-10 ">
                                                <label className="form-check-label">
                                                    <input className="checkmark" name="swimming_pool"
                                                           defaultChecked={this.state.swimming_pool}
                                                           defaultValue={this.state.swimming_pool} type="checkbox"
                                                           onChange={this.onChangeCheckbox}/>
                                                    <span className="checkmark"> </span>
                                                    Swimming Pool
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="submit"
                                            value="Add hotel"
                                            className="d-block btn btn-block btn-primary"
                                        />
                                    </div>
                                    <div className="text-center mt-4 font-weight-bold">
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

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    onChangeCheckbox = (e) => {
        if (e.target.value === "false") {
            this.setState({[e.target.name]: true});
        } else {
            this.setState({[e.target.name]: false});
        }
    }


    AddHotelHandler = (e) => {
        e.preventDefault();
        let id_hotel = null;
        if (typeof (cookieUserID) !== "undefined") {
            axios.post('/getUserRole', {CookieUserID: cookieUserID})
                .then(res => {
                    this.setState({role: res.data.role});
                    if (res.data.role < 2) {
                        axios.post('/addHotel', {
                            name: this.state.name,
                            address: this.state.address,
                            description: this.state.description,
                            phone_number: this.state.phone_number,
                            category: this.state.category,
                            email: this.state.email,
                            rating: this.state.rating,
                            free_cancellation: this.state.free_cancellation,
                            no_prepayment: this.state.no_prepayment,
                            free_wifi: this.state.free_wifi,
                            gym: this.state.gym,
                            spa: this.state.spa,
                            swimming_pool: this.state.swimming_pool
                        })
                            .then(res => {
                                id_hotel = res.data
                                if (this.state.image !== undefined && this.state.selectedFile !== undefined && id_hotel !== null) {
                                    const data = new FormData()
                                    data.append('file', this.state.selectedFile)
                                    axios.post('/uploadHotelImg/' + id_hotel, data)
                                        .then(() => {
                                        })
                                        .catch(err => {
                                            this.setState({status: this.state.status + "ERROR: Image wasn't uploaded."});
                                        });
                                }
                                this.props.history.push('/adminHotels');
                            })
                            .catch(err => {
                                this.setState({status: this.state.status + "\nERROR: Hotel wasn't inserted, please contact support!"});
                            });
                    } else {
                        this.setState({status: this.state.status + "\nERROR: You don't have required permission to add new hotel!"});
                    }
                });
        } else {
            this.setState({status: this.state.status + "\nERROR: Please log-in and try again"});
        }
    }

    addHotelPhoto = () => {
        return (
            <div className="d-flex">
                <img className="item-list-style-img-200" src={this.state.image} alt=''/>
                <div className="add-img-lower">
                    <div className="row">
                        <div className="col-md-6">
                            <ToastContainer/>
                            <div className="padding-bottom-10">
                                <label>Upload hotel photo</label>
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

export default AddHotel
