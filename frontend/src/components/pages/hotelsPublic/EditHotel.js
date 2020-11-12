import React, {Component} from 'react'
import {ToastContainer} from "react-toastify";
import {Link} from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import RoomsList from "../roomsPublic/RoomsList";

const cookies = new Cookies();
const cookieUserID = cookies.get('CookieUserID');

export class EditHotel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            /* User data */
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
            fileUploadErrMsg: undefined,
            hotelUploadAvailable: true,
            selectedFile: null,
            /* Status */
            status: "",
            /* User */
            role: 5,
        }
    }

    componentDidMount() {
        const id = window.location.pathname.replace("/editHotel/", "");
        this.setState({hotel_id: id})
        if (typeof (cookieUserID) !== "undefined") {
            axios.post('/getUserRole', {CookieUserID: cookieUserID})
                .then(res => {
                    this.setState({role: res.data.role});
                });

            axios.post('/getHotel', {hotel_id: id})
                .then((res) => {
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
                });
            axios.post('/getHotelImage', {hotel_id: id})
                .then(res => {
                    this.setState({image: res.data});
                    this.setState({isLoading: false});
                });
        }
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
                    <div className="d-flex align-items-center auth px-0">
                        <div className="w-100 mx-0">
                            <div>
                                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                    <h4>Edit hotel.</h4>
                                    <h6 className="font-weight-light">Please edit the form underneath </h6>
                                    <div style={{display: 'flex'}}>
                                        {this.addHotelPhoto()}
                                    </div>
                                    <fieldset
                                        disabled={window.location.pathname.startsWith("/hotel/") ? 'disabled' : null}>
                                        <form className="pt-3">
                                            <div className="form-group">
                                                Name
                                                <input type="text" className="form-control form-control-lg" name='name'
                                                       placeholder='Name' defaultValue={this.state.name}
                                                       onChange={this.onChange} required/>
                                            </div>
                                            <div className="form-group">
                                                Description
                                                <textarea defaultValue={this.state.description} className="form-control"
                                                          name='description' placeholder='Description' rows="4"
                                                          onChange={this.onChange} required/>
                                            </div>
                                            <div className="form-group">
                                                Address
                                                <input type="text" className="form-control form-control-lg"
                                                       name='address' placeholder='Address'
                                                       defaultValue={this.state.address} onChange={this.onChange}
                                                       required/>
                                            </div>
                                            <div className="form-group">
                                                Phone number
                                                <input type="tel" className="form-control form-control-lg"
                                                       name='phone_number' placeholder='Phone Number'
                                                       pattern="[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}"
                                                       defaultValue={this.state.phone_number} onChange={this.onChange}
                                                       required/>
                                            </div>
                                            <div className="form-group">
                                                Email
                                                <input type="tel" className="form-control form-control-lg" name='email'
                                                       placeholder="Email" defaultValue={this.state.email}
                                                       onChange={this.onChange} required/>
                                            </div>
                                            <div className="form-group">
                                                Rating
                                                <input type="number" className="form-control form-control-lg"
                                                       name='rating' placeholder='Rating (0-5 stars)' min="0" max="5"
                                                       defaultValue={this.state.rating} onChange={this.onChange}
                                                       required/>
                                            </div>
                                            <div className="form-group">
                                                Category
                                                <select name="category" value={this.state.category}
                                                        className="form-control form-control-lg"
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
                                            <div style={{paddingBottom: "20px"}}>
                                                <div className="form-group">
                                                    Other
                                                </div>
                                                <div style={{display: 'flex', marginTop: "-30px"}}>
                                                    <div className="form-check" style={{paddingRight: "10px"}}>
                                                        <label className="form-check-label">
                                                            <input className="form-check-input" name="no_prepayment"
                                                                   checked={this.state.no_prepayment === "true" ? true : null}
                                                                   value={this.state.no_prepayment} type="checkbox"
                                                                   onChange={this.onChangeCheckbox}/>
                                                            <span className="checkmark"> </span>
                                                            No prepayment
                                                        </label>
                                                    </div>
                                                    <div className="form-check" style={{paddingRight: "10px"}}>
                                                        <label className="form-check-label">
                                                            <input className="form-check-input" name="free_cancellation"
                                                                   checked={this.state.free_cancellation === "true" ? true : null}
                                                                   value={this.state.free_cancellation} type="checkbox"
                                                                   onChange={this.onChangeCheckbox}/>
                                                            <span className="checkmark"> </span>
                                                            Free cancellation
                                                        </label>
                                                    </div>
                                                    <div className="form-check" style={{paddingRight: "10px"}}>
                                                        <label className="form-check-label">
                                                            <input className="form-check-input" name="free_wifi"
                                                                   checked={this.state.free_wifi === "true" ? true : null}
                                                                   value={this.state.free_wifi} type="checkbox"
                                                                   onChange={this.onChangeCheckbox}/>
                                                            <span className="checkmark"> </span>
                                                            Free wifi
                                                        </label>
                                                    </div>
                                                    <div className="form-check" style={{paddingRight: "10px"}}>
                                                        <label className="form-check-label">
                                                            <input className="form-check-input" name="spa"
                                                                   checked={this.state.spa === "true" ? true : null}
                                                                   value={this.state.spa} type="checkbox"
                                                                   onChange={this.onChangeCheckbox}/>
                                                            <span className="checkmark"> </span>
                                                            SPA
                                                        </label>
                                                    </div>
                                                    <div className="form-check" style={{paddingRight: "10px"}}>
                                                        <label className="form-check-label">
                                                            <input className="form-check-input" name="gym"
                                                                   checked={this.state.gym === "true" ? true : null}
                                                                   value={this.state.gym} type="checkbox"
                                                                   onChange={this.onChangeCheckbox}/>
                                                            <span className="checkmark"> </span>
                                                            Gym
                                                        </label>
                                                    </div>
                                                    <div className="form-check" style={{paddingRight: "10px"}}>
                                                        <label className="form-check-label">
                                                            <input className="form-check-input" name="swimming_pool"
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
                                            <div className="text-center mt-4 font-weight-bold">
                                                {this.state.status}
                                            </div>
                                        </form>
                                    </fieldset>
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

    editHotelHandler = () => {
        if (this.state.role < 3) {
            let id_hotel = this.state.hotel_id;
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
            })
                .then(res => {
                })
                .catch(err => {
                    this.setState({status: this.state.status + "\nERROR: Hotel wasn't inserted, please contact support!"});
                });
            if (this.state.image !== undefined && this.state.selectedFile !== undefined && id_hotel !== null) {
                const data = new FormData()
                data.append('file', this.state.selectedFile)
                axios.post('/uploadHotelImg/' + this.state.hotel_id, data)
                    .then(() => {
                    })
                    .catch(err => {
                        this.setState({status: this.state.status + "ERROR: Image wasn't uploaded."});
                    });
            }
            this.props.history.push('/account');
        } else {
            this.setState({status: this.state.status + "\nERROR: You don't have required permission to edit a hotel!"});
        }

    }

    getRoomsList = () => {
        const {id} = this.props.match.params;
        return (<RoomsList hotel_id={id} no_prepayment={this.state.no_prepayment}/>)
    }

    getSubmitOption() {
        if (this.state.role < 4 && window.location.pathname.startsWith("/editHotel/")) {
            return (
                <div style={{display: 'flex'}}>
                    <button style={this.getSubmitButtonStyle()} onClick={this.editHotelHandler}
                            className="btn btn-block btn-primary btn-lg mr-2" type="submit">Submit changes
                    </button>
                    <Link to="/account"
                          className="btn btn-block btn-primary btn-lg mr-2 btn-light font-weight-medium">Cancel</Link>
                </div>
            );
        }
    }

    addHotelPhoto = () => {
        return (
            <div style={{display: 'flex'}}>
                {this.getImg()}
                <div style={{paddingLeft: '20px', paddingTop: '125px',}}>
                    <div className="row">
                        <div className="col-md-6">
                            <ToastContainer/>
                            <div style={{paddingBottom: '10px'}}>
                                <label>Upload hotel photo</label>
                                <input type="file" name="file" onChange={this.onChangeFileUploadHandler}/>
                            </div>
                            <div style={{display: 'flex'}}>
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
            return <img src={`data:image/*;base64,${this.state.image}`} alt=''
                        style={{width: '200px', height: '200px'}}/>;
        } else {
            return <img src={this.state.image} alt='' style={{width: '200px', height: '200px'}}/>;
        }
    }

    getSubmitButtonStyle = () => {
        return {
            display: this.state.hotelUploadAvailable ?
                'block' : 'none'
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

export default EditHotel
