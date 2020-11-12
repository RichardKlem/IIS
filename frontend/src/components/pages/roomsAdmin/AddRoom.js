import React, {Component} from 'react'
import {ToastContainer} from "react-toastify";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const cookieUserID = cookies.get('CookieUserID');

export class AddHotel extends Component {

    constructor(props) {
        super(props);
        let pathName = window.location.pathname.split("/");
        this.state = {
            isLoading: true,
            /* room data */
            name: undefined,
            bed_count: undefined,
            description: undefined,
            price_night: undefined,
            category: "1",
            bed_type: "1",
            meal: "1",
            room_size: undefined,
            free_breakfast: false,
            hotel_id: pathName[2],
            count: 1,
            pre_price: 0,
            no_prepayment: 0,
            /* File upload variables */
            image: undefined,
            fileUploadErrMsg: '',
            selectedFile: null,
            /* User */
            role: null,
        }
    }

    componentDidMount() {
        //todo in api create get_no_prepayment for hotel
        axios.post('/getHotel', {hotel_id: this.state.hotel_id})
            .then((res) => {
                this.setState({no_prepayment: res.data.no_prepayment});
            });
        this.setState({isLoading: false})
    }

    render() {
        if (this.state.isLoading) {
            return (<div className="App">Loading...</div>);
        } else {
            return (
                <div>
                    <div className="d-flex align-items-center auth px-0">
                        <div className="w-100 mx-0">
                            <div>
                                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                    <h4>Add new Room.</h4>
                                    <h6 className="font-weight-light">Please fill the form underneath </h6>
                                    <div style={{display: 'flex'}}>
                                        {this.addRoomPhoto()}
                                    </div>
                                    <form className="pt-3" onSubmit={this.AddRoomHandler}>
                                        <div className="form-group">
                                            <input type="text" className="form-control form-control-lg" name='name'
                                                   placeholder='Name' defaultValue={this.state.name}
                                                   onChange={this.onChange} required/>
                                        </div>
                                        <div className="form-group">
                                            <textarea value={this.state.description} className="form-control"
                                                      name='description' placeholder='Description' rows="4"
                                                      onChange={this.onChange}
                                                      required>{this.state.description}</textarea>
                                        </div>
                                        <div className="form-group">
                                            Room size
                                            <input type="int" className="form-control form-control-lg" name='room_size'
                                                   placeholder="Room Size" defaultValue={this.state.room_size}
                                                   onChange={this.onChange} required/>
                                        </div>
                                        <div className="form-group">
                                            Category
                                            <select name="category" defaultValue={this.state.category}
                                                    className="form-control form-control-lg" onChange={this.onChange}>
                                                <option value="1">Standard Room</option>
                                                <option value="2">Business Double</option>
                                                <option value="3">Standard Triple</option>
                                                <option value="4">Business</option>
                                                <option value="5">Deluxe</option>
                                                <option value="6">Studio</option>
                                                <option value="7">Suite</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            Bed count
                                            <input type="int" className="form-control form-control-lg" name='bed_count'
                                                   placeholder='Bed Count' defaultValue={this.state.bed_count}
                                                   onChange={this.onChange} required/>
                                        </div>
                                        <div className="form-group">
                                            Bed type
                                            <select name="bed_type" defaultValue={this.state.bed_type}
                                                    className="form-control form-control-lg" onChange={this.onChange}>
                                                <option value="1">Separate beds</option>
                                                <option value="2">Double beds</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            Meal
                                            <select name="meal" defaultValue={this.state.meal}
                                                    className="form-control form-control-lg" onChange={this.onChange}>
                                                <option value="1">None</option>
                                                <option value="2">Half Board</option>
                                                <option value="3">Full Board</option>
                                                <option value="4">All inclusive</option>
                                            </select>
                                        </div>
                                        <div style={{paddingBottom: "20px"}}>
                                            <div className="form-group">
                                                Free breakfast
                                            </div>
                                            <div style={{display: 'flex', marginTop: "-30px"}}>
                                                <div className="form-check" style={{paddingRight: "10px"}}>
                                                    <label className="form-check-label">
                                                        <input className="form-check-input" name="free_breakfast"
                                                               defaultChecked={this.state.free_breakfast}
                                                               defaultValue={this.state.free_breakfast} type="checkbox"
                                                               onChange={this.onChangeCheckbox}/>
                                                        <span className="checkmark"> </span>
                                                        Free breakfast
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            Price per night
                                            <input type="int" className="form-control form-control-lg"
                                                   name='price_night' placeholder='Price per Night'
                                                   defaultValue={this.state.price_night} onChange={this.onChange}
                                                   required/>
                                        </div>
                                        {this.prePrice()}
                                        <div className="form-group">
                                            Count
                                            <input type="int" className="form-control form-control-lg" name='count'
                                                   placeholder='Room count' defaultValue={this.state.count}
                                                   onChange={this.onChange} required/>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="submit"
                                                value="Add Room"
                                                className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
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
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});

    onChangeCheckbox = (e) => {
        if (e.target.value === "false") {
            this.setState({[e.target.name]: true});
        } else {
            this.setState({[e.target.name]: false});
        }
    }

    AddRoomHandler = (e) => {
        e.preventDefault();
        let room_id = null;
        let free_breakfast = null;
        if (typeof (cookieUserID) !== "undefined") {
            if (this.state.free_breakfast === true) {
                free_breakfast = 1;
            } else {
                free_breakfast = 0;
            }
            axios.post('/getUserRole', {CookieUserID: cookieUserID})
                .then(res => {
                    this.setState({role: res.data.role});
                    if (res.data.role < 2) {
                        axios.post('/addRoom', {
                            name: this.state.name,
                            bed_count: this.state.bed_count,
                            description: this.state.description,
                            price_night: this.state.price_night,
                            category: this.state.category,
                            room_size: this.state.room_size,
                            bed_type: this.state.bed_type,
                            free_breakfast: free_breakfast,
                            meal: this.state.meal,
                            count: this.state.count,
                            pre_price: this.state.pre_price,
                            hotel_id: this.state.hotel_id,
                        })
                            .then(res => {
                                room_id = res.data
                                if (this.state.image !== undefined || room_id !== null) {
                                    const data = new FormData()
                                    data.append('file', this.state.selectedFile)
                                    axios.post('/uploadRoomImg/' + this.state.hotel_id + "_" + room_id, data).then(() => {
                                    })
                                        .catch(err => { // then print response status
                                            this.setState({status: this.state.status + "ERROR: Image wasn't uploaded."});
                                        })
                                }
                            })
                            .catch(err => {
                                this.setState({status: this.state.status + "\nERROR: Room wasn't inserted, please contact support!"});
                            });
                        this.props.history.push('/editHotel/' + this.state.hotel_id);
                    } else {
                        this.setState({status: this.state.status + "\nERROR: You don't have required permission to add new room!"});
                    }
                });
        } else {
            this.setState({status: this.state.status + "\nERROR: Please log-in and try again"});
        }
    }

    addRoomPhoto = () => {
        return (
            <div style={{display: 'flex'}}>
                <img src={this.state.image} alt='' style={{width: '200px', height: '200px'}}/>
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

    prePrice() {
        //todo in api create get_no_prepayment for hotel
        if (this.state.no_prepayment === 0) {
            return (<div className="form-group">
                Pre-price
                <input type="int" className="form-control form-control-lg" name='pre_price'
                       placeholder='Required prepay' defaultValue={this.state.pre_price} onChange={this.onChange}
                       required/>
            </div>)
        } else {
            return (<></>)
        }
    }
}

export default AddHotel
