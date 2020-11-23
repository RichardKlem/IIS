import React, {Component} from 'react'
import {ToastContainer} from "react-toastify";
import {Link} from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import RoomsList from "../roomsPublic/RoomsList";
import Required from "../../other/Required";

const cookies = new Cookies();
let cookieUserID = cookies.get('CookieUserID');

export class EditHotel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isLoadingError: false,
            /* Hotels data */
            name: undefined,
            address: undefined,
            description: "",
            phone_number: undefined,
            email: undefined,
            category: undefined,
            rating: undefined,
            hotel_id: undefined,
            free_cancellation: true,
            no_prepayment: true,
            free_wifi: true,
            gym: true,
            spa: true,
            swimming_pool: true,
            /* File upload variables */
            image: undefined,
            newImageWasUploaded: false,
            fileUploadErrMsg: '',
            selectedFile: undefined,
            /* Status */
            status: "",
            /* User */
            role: 5,
        }
    }

    componentDidMount() {
        const id = window.location.pathname.replace("/editHotel/", "");
        this.setState({hotel_id: id})
        cookieUserID = cookies.get('CookieUserID');
        if (typeof (cookieUserID) !== "undefined") {
            axios.post('/getUserRole', {CookieUserID: cookieUserID})
                .then(res => {
                    this.setState({role: res.data.role});
                }).catch(() => {
                this.setState({status: "ERROR please log-out and log-in again."});
            });
            axios.post('/getHotel', {hotel_id: id})
                .then(res => {
                    this.setState({
                        name: res.data.name,
                        address: res.data.address,
                        description: res.data.description,
                        phone_number: res.data.phone_number,
                        email: res.data.email,
                        category: res.data.category.toString(),
                        rating: res.data.rating,
                        free_cancellation: res.data.free_cancellation ? "true" : "false",
                        no_prepayment: res.data.no_prepayment ? "true" : "false",
                        free_wifi: res.data.free_wifi ? "true" : "false",
                        gym: res.data.gym ? "true" : "false",
                        spa: res.data.spa ? "true" : "false",
                        swimming_pool: res.data.swimming_pool ? "true" : "false"
                    });
                    axios.post('/getHotelImage', {hotel_id: id})
                        .then(res => {
                            this.setState({image: res.data});
                            this.setState({isLoading: false});
                        }).catch(() => {
                        this.setState({
                            status: "WARNING: Hotel image not found, please upload new image",
                            isLoadingError: true
                        });
                    });
                }).catch(() => {
                this.setState({
                    status: "ERROR: please reload page or try different hotel." +
                        "\nIf the issue persists, please contact support!"
                });
            });
        } else {
            this.setState({status: "ERROR: Please login!"});
            this.props.history.push('/login');
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
                    <div className="d-flex align-items-center">
                        <div className="w-100">
                            <div>
                                <div className="text-left">
                                    <h4>Edit hotel</h4>
                                    <h6 className="font-weight-light">Please edit the form underneath</h6>
                                    <div className="d-flex">
                                        {this.addHotelPhoto()}
                                    </div>
                                    <fieldset
                                        disabled={window.location.pathname.startsWith("/hotel/") ? 'disabled' : null}>
                                        <form className="pt-3">
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
                                                          onChange={this.onChange}/>
                                            </div>
                                            <div className="form-group">
                                                Address
                                                <input type="text" className="form-control"
                                                       name='address' placeholder='Address'
                                                       defaultValue={this.state.address} onChange={this.onChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                Phone number
                                                <input type="tel" className="form-control"
                                                       name='phone_number' placeholder='Phone Number'
                                                       defaultValue={this.state.phone_number} onChange={this.onChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                Email
                                                <input type="tel" className="form-control" name='email'
                                                       placeholder="Email" defaultValue={this.state.email}
                                                       onChange={this.onChange}/>
                                            </div>
                                            <div className="form-group">
                                                Rating
                                                <input type="number" className="form-control"
                                                       name='rating' placeholder='Rating (0-5 stars)' min="0" max="5"
                                                       defaultValue={this.state.rating} onChange={this.onChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                Category
                                                <select name="category" value={this.state.category}
                                                        className="form-control"
                                                        onChange={this.onChange}>
                                                    <option value="1">Standard Hotel</option>
                                                    <option value="2">Business Hotel</option>
                                                    <option value="3">Airport Hotel</option>
                                                    <option value="4">B&B</option>
                                                    <option value="5">Casino Hotel</option>
                                                    <option value="6">Studio</option>
                                                    <option value="7">Conference Hotel</option>
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
                                                                   checked={this.state.no_prepayment === "true" ? true : null}
                                                                   value={this.state.no_prepayment} type="checkbox"
                                                                   onChange={this.onChangeCheckbox}/>
                                                            <span className="checkmark"> </span>
                                                            No prepayment
                                                        </label>
                                                    </div>
                                                    <div className="form-check padding-right-10">
                                                        <label className="form-check-label">
                                                            <input className="checkmark" name="free_cancellation"
                                                                   checked={this.state.free_cancellation === "true" ? true : null}
                                                                   value={this.state.free_cancellation} type="checkbox"
                                                                   onChange={this.onChangeCheckbox}/>
                                                            <span className="checkmark"> </span>
                                                            Free cancellation
                                                        </label>
                                                    </div>
                                                    <div className="form-check padding-right-10">
                                                        <label className="form-check-label">
                                                            <input className="checkmark" name="free_wifi"
                                                                   checked={this.state.free_wifi === "true" ? true : null}
                                                                   value={this.state.free_wifi} type="checkbox"
                                                                   onChange={this.onChangeCheckbox}/>
                                                            <span className="checkmark"> </span>
                                                            Free wifi
                                                        </label>
                                                    </div>
                                                    <div className="form-check padding-right-10">
                                                        <label className="form-check-label">
                                                            <input className="checkmark" name="spa"
                                                                   checked={this.state.spa === "true" ? true : null}
                                                                   value={this.state.spa} type="checkbox"
                                                                   onChange={this.onChangeCheckbox}/>
                                                            <span className="checkmark"> </span>
                                                            SPA
                                                        </label>
                                                    </div>
                                                    <div className="form-check padding-right-10">
                                                        <label className="form-check-label">
                                                            <input className="checkmark" name="gym"
                                                                   checked={this.state.gym === "true" ? true : null}
                                                                   value={this.state.gym} type="checkbox"
                                                                   onChange={this.onChangeCheckbox}/>
                                                            <span className="checkmark"> </span>
                                                            Gym
                                                        </label>
                                                    </div>
                                                    <div className="form-check padding-right-10">
                                                        <label className="form-check-label">
                                                            <input className="checkmark" name="swimming_pool"
                                                                   value={this.state.swimming_pool} type="checkbox"
                                                                   checked={this.state.swimming_pool === "true" ? true : null}
                                                                   onChange={this.onChangeCheckbox}/>
                                                            <span className="checkmark"> </span>
                                                            Swimming Pool
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {this.getSubmitOption()}
                                        </form>
                                    </fieldset>
                                    <div className="text-center font-weight-bold">
                                        {this.state.status}
                                    </div>
                                    {this.getRoomsList()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});

    onChangeCheckbox = (e) => {
        if (e.target.value === "false") {
            this.setState({[e.target.name]: true});
        } else {
            this.setState({[e.target.name]: false});
        }
    }

    editHotelHandler = (e) => {
        if (this.state.name !== "") {
            if (this.state.role < 2) {
                e.preventDefault()
                axios.post('/editHotel', {
                    hotel_id: this.state.hotel_id,
                    name: this.state.name,
                    address: this.state.address,
                    description: this.state.description,
                    phone_number: this.state.phone_number,
                    category: this.state.category.toString(),
                    email: this.state.email,
                    rating: this.state.rating,
                    free_cancellation: this.state.free_cancellation,
                    no_prepayment: this.state.no_prepayment,
                    free_wifi: this.state.free_wifi,
                    gym: this.state.gym,
                    spa: this.state.spa,
                    swimming_pool: this.state.swimming_pool
                }).then(() => {
                    this.setState({status: "Hotel successfully updated."});
                    if (this.state.image !== undefined && this.state.selectedFile !== undefined && this.state.newImageWasUploaded) {
                        const data = new FormData()
                        data.append('file', this.state.selectedFile)
                        axios.post('/uploadHotelImg/' + this.state.hotel_id, data)
                            .then(() => {
                                this.setState({status: this.state.status + "\nImage successfully uploaded."});
                            }).catch(() => {
                            this.setState({status: this.state.status + "\nERROR: Image wasn't uploaded."});
                        });
                    }
                }).catch(() => {
                    this.setState({status: this.state.status + "\nERROR: Hotel wasn't updated, please try again or contact support!"});
                });
            } else {
                this.setState({status: this.state.status + "\nERROR: You don't have required permission to edit a hotel!"});
            }
        }
    }

    getRoomsList = () => {
        const {id} = this.props.match.params;
        return (<RoomsList hotel_id={id} no_prepayment={this.state.no_prepayment}/>)
    }

    getSubmitOption() {
        if (this.state.role < 2 && window.location.pathname.startsWith("/editHotel/")) {
            return (
                <div className="d-flex padding-bottom-20">
                    <button onClick={this.editHotelHandler}
                            className="btn btn-block btn-primary padding-10 d-block" type="submit">Submit changes
                    </button>
                    <div className="padding-10"/>
                    <Link to={"/adminHotels"}
                          className="mr-2 btn btn-block btn-primary btn-warning padding-10">Back to Hotels List</Link>
                </div>
            );
        }
    }

    addHotelPhoto = () => {
        return (
            <div className="d-flex">
                {this.getImg()}
                <div className="padding-left-10 edit-hotel-img-offset">
                    <div className="row">
                        <div className="col-md-6">
                            <ToastContainer/>
                            <div className="padding-bottom-10">
                                <label className="padding-left-10">Upload new hotel photo</label>
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
            return (<img className="item-list-style-img-200" src={`data:image/*;base64,${this.state.image}`}
                         alt='hotel'/>);
        } else {
            return (<img className="item-list-style-img-200" src={this.state.image} alt='hotel'/>);
        }
    }

    onChangeFileUploadHandler = (e) => {
        let file = e.target.files[0];
        if (this.validateFile(e)) {
            this.setState({selectedFile: file, fileUploadErrMsg: ''});
        }
    };

    validateFile = (e) => {
        let file = e.target.files[0];
        if (!file || file.type.split("/")[0] !== "image") {
            this.setState({
                selectedFile: undefined,
                image: undefined,
                fileUploadErrMsg: 'Provided file isn\'t a photo. \nPlease select new file!'
            });
            return false;
        }
        this.setState({image: URL.createObjectURL(e.target.files[0]), newImageWasUploaded: true})
        return true;
    };

}

export default EditHotel
