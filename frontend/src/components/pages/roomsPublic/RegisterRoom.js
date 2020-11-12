import React, {Component} from 'react'
import axios from "axios";
import Cookies from "universal-cookie";
import RegBookingPage from "../RegBookingPage";

const cookies = new Cookies();

export class RegisterRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isOpen: false,
            /* room data */
            name: undefined,
            bed_count: undefined,
            description: undefined,
            phone_number: undefined,
            price_night: undefined,
            pre_price: undefined,
            category: undefined,
            room_size: undefined,
            hotel_id: undefined,
            bed_type: "1",
            meal: " 1",
            free_breakfast: false,
            count: undefined,
            /* Registration */
            start_date: undefined,
            end_date: undefined,
            total_price: 0,
            /* File upload variables */
            image: undefined,
            newImageWasUploaded: false,
            fileUploadErrMsg: '',
            hotelUploadAvailable: true,
            selectedFile: null,
            /* User */
            role: 5,
            /* Status */
            status: null,
            /* Booking */
            daysSelected: 0,
            people: 1,
            room_count: 0,
            pre_price_sum: 0,
            buttonMsg: "Please choose dates of your stay."
        }
    }

    componentDidMount() {
        const {id} = this.props.match.params;
        this.setState({id_room: id})
        axios.post('/getRoom', {id_room: id})
            .then((res) => {
                this.setState({
                    hotel_id: res.data.hotel_id,
                    name: res.data.name,
                    description: res.data.description,
                    bed_count: res.data.bed_count,
                    price_night: res.data.price_night,
                    category: res.data.category,
                    room_size: res.data.room_size,
                    bed_type: res.data.bed_type,
                    meal: res.data.meal,
                    count: res.data.count,
                    pre_price: res.data.pre_price,
                    free_breakfast: res.data.free_breakfast ? "true" : "false",
                });
                axios.post('/getRoomImage', {id_room: id, hotel_id: res.data.hotel_id})
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
                <div className="d-flex align-items-center auth px-0" style={{paddingTop: "100px"}}>
                    <div className="w-100 mx-0">
                        <div>
                            <div className="auth-form-light py-5 px-4 px-sm-5 border">
                                <div className="border">
                                    <div className="d-flex" style={{paddingLeft: "10px", paddingTop: "10px"}}>
                                        <h2>{this.state.name}</h2>
                                        <div style={{width: "150px", paddingLeft: "10px"}}>
                                            <select style={{backgroundColor: "#fff", webkitAppearance: "none"}}
                                                    name="category" value={this.state.category}
                                                    className="form-control form-control-lg" disabled="true">
                                                <option value="1">Standard Room</option>
                                                <option value="2">Business Double</option>
                                                <option value="3">Standard Triple</option>
                                                <option value="4">Business</option>
                                                <option value="5">Deluxe</option>
                                                <option value="6">Studio</option>
                                                <option value="7">Suite</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div style={{paddingRight: "10px", paddingLeft: "10px"}}>
                                            <img src={`data:image/*;base64,${this.state.image}`} alt=''
                                                 style={{width: '200px', height: '200px'}}/>
                                        </div>
                                        <div>
                                            <p className="font-weight-light">{"Description: " + this.state.description}</p>
                                            <p className="font-weight-light">{"Bed count: " + this.state.bed_count}</p>
                                            <p className="font-weight-light">{"Price per night: " + this.state.price_night + "Kč"}</p>
                                            <p className="font-weight-light">{this.state.pre_price === 0 ? "" : "Pre-payprice: " + this.state.pre_price + "Kč"}</p>
                                            <p className="font-weight-light">{"Rooms available: " + this.state.count}</p>
                                            <div style={{width: "150px"}}>
                                                <select style={{backgroundColor: "#fff", webkitAppearance: "none"}}
                                                        name="category" value={this.state.bed_type}
                                                        className="form-control form-control-lg" disabled="true">
                                                    <option value="1">Separate beds</option>
                                                    <option value="2">Double beds</option>
                                                </select>
                                            </div>
                                            <div style={{width: "150px"}}>
                                                <select style={{backgroundColor: "#fff", webkitAppearance: "none"}}
                                                        name="category" value={this.state.meal}
                                                        className="form-control form-control-lg" disabled="true">
                                                    <option value="1">None</option>
                                                    <option value="2">Half Board</option>
                                                    <option value="3">Full Board</option>
                                                    <option value="4">All inclusive</option>
                                                </select>
                                            </div>
                                            <div style={{paddingBottom: "20px"}}>
                                                <div className="form-group">
                                                    Offers:
                                                </div>
                                                <div style={{display: 'flex', marginTop: "-30px"}}>
                                                    <div className="form-check" style={{paddingRight: "10px"}}>
                                                        <label className="form-check-label">
                                                            <input disabled="disabled" className="form-check-input"
                                                                   name="free_breakfast"
                                                                   checked={this.state.free_breakfast === "true" ? true : null}
                                                                   value={this.state.free_breakfast} type="checkbox"/>
                                                            <span className="checkmark"> </span>
                                                            Free breakfast
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.getSubmitOption()}
                            </div>
                            {this.state.status}
                        </div>
                    </div>
                </div>
            )
        }
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});

    EditHotelHandler = (e) => {
        e.preventDefault();
        axios.post('/editRoom', {
            id_room: this.state.id_room,
            name: this.state.name,
            description: this.state.description,
            bed_count: this.state.bed_count,
            category: this.state.category,
            room_size: this.state.room_size,
            price_night: this.state.price_night
        })
            .then(res => {
                if (this.state.newImageWasUploaded) {
                    const data = new FormData()
                    data.append('file', this.state.selectedFile)
                    axios.post('/uploadRoomImg/' + this.state.hotel_id + "_" + this.state.id_room, data).then(res => { // then print response status
                    })
                        .catch(err => { // then print response status
                        })
                }
            });
        this.props.history.push('/account');
    }


    getStyle = () => {
        if (this.state.role > 3 || window.location.pathname.startsWith("/hotel/")) {
            if (document.getElementById('hotelInput') !== null) {
                document.getElementById('hotelInput').disabled = true;
            }
        }
    }

    getSubmitOption() {
        return (
            <div style={{display: 'flex'}}>
                <form className="table table-hover" id="myTable" onSubmit={this.reservationHandle}>
                    <div className="d-flex align-items-center" style={{whiteSpace: "nowrap"}}>
                        Start Date<input name="start_date" defaultValue={this.state.start_date}
                                         style={{minWidth: '100px', maxWidth: 'auto/5'}} placeholder="Start date"
                                         className="text-center form-control form-control-sm" type="date" id="1"
                                         onChange={this.onChangeDate} required/>
                        End Date<input name="end_date" defaultValue={this.state.end_date}
                                       style={{minWidth: '100px', maxWidth: 'auto/5'}} placeholder="End date"
                                       className="text-center form-control form-control-sm" type="date" id="2"
                                       onChange={this.onChangeDate} required/>
                        People <input name="people" defaultValue={this.state.people} placeholder="Adults count"
                                      className="text-center form-control form-control-sm" type="number" min="1"
                                      max="10" onChange={this.onChange} required/>
                    </div>
                    <input
                        style={{display: 'block'}}
                        type="submit"
                        onSubmit={this.reservationHandle}
                        value={this.state.buttonMsg}
                        className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    />
                </form>
                {this.popUp()}
            </div>
        );
    }

    onChange = (e) => {
        // todo refactor
        this.setState({[e.target.name]: e.target.value});
        let days = 0;
        let a, b;
        let price;
        let room_count;
        let pre_price_sum;
        if (this.state.end_date !== undefined && this.state.start_date !== undefined) {
            a = new Date(this.state.start_date);
            b = new Date(this.state.end_date);
            days = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
            this.setState({daysSelected: days})
            room_count = Math.ceil(e.target.value / this.state.bed_count)
            this.setState({room_count: room_count})
            price = days * this.state.price_night * room_count;
            this.setState({total_price: price})
            pre_price_sum = days * room_count * this.state.pre_price
            this.setState({pre_price_sum: pre_price_sum})
            if (room_count <= this.state.count) {
                axios.post('/checkDates', {
                    id_room: this.state.id_room,
                    start_date: this.state.start_date,
                    end_date: this.state.end_date
                })
                    .then(res => {
                        this.setState({role: res.data.role});
                    });
                this.setState({buttonMsg: "BOOK " + room_count + " room(s) for " + e.target.value + "ppl for " + days + " day(s) for " + price + "Kč! " + (this.state.pre_price === 0 ? "" : ("Pay " + pre_price_sum + "Kč NOW"))})
            } else {
                this.setState({buttonMsg: "Not enough rooms available"})
            }

        }
    }

    onChangeDate = (e) => {
        // todo refactor
        let price;
        let room_count;
        let pre_price_sum;
        let days = 0;
        let b;
        let a;
        this.setState({[e.target.name]: e.target.value})
        if (this.state.start_date !== undefined && e.target.name === "end_date") {
            a = new Date(this.state.start_date);
            b = new Date(e.target.value);
            axios.post('/checkDates', {
                id_room: this.state.id_room,
                start_date: this.state.start_date,
                end_date: e.target.value
            })
                .then(res => {
                    this.setState({role: res.data.role});
                });
            days = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
            this.setState({daysSelected: days})
        } else if ((this.state.end_date !== undefined && e.target.name === "start_date")) {
            a = new Date(e.target.value);
            b = new Date(this.state.end_date);
            axios.post('/checkDates', {
                id_room: this.state.id_room,
                start_date: e.target.value,
                end_date: this.state.end_date
            })
                .then(res => {
                    this.setState({role: res.data.role});
                });
            days = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
            this.setState({daysSelected: days})
        } else {
            a = new Date(this.state.start_date);
            b = new Date(this.state.end_date);
            axios.post('/checkDates', {
                id_room: this.state.id_room,
                start_date: this.state.start_date,
                end_date: this.state.end_date
            })
                .then(res => {
                    this.setState({role: res.data.role});
                });
            days = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
            this.setState({daysSelected: days})
        }
        room_count = Math.ceil(this.state.people / this.state.bed_count)
        this.setState({room_count: room_count})
        price = days * this.state.price_night * room_count;
        this.setState({total_price: price})
        pre_price_sum = days * room_count * this.state.pre_price
        this.setState({pre_price_sum: pre_price_sum})
        if (room_count <= this.state.count) {
            this.setState({buttonMsg: "BOOK " + room_count + " room(s) for " + this.state.people + "ppl for " + days + " day(s) for " + price + "Kč! " + (this.state.pre_price === 0 ? "" : ("Pay " + pre_price_sum + "Kč NOW"))})
        } else {
            this.setState({buttonMsg: "Not enough rooms available"})
        }
    }


    popUp() {
        /* todo make new non-registered user booking page */
        return (<div>
                {this.state.isOpen && <div className="popup-box">
                    <div className="box">
                        <span className="close-icon" onClick={this.handlePopUp}>x</span>
                        <RegBookingPage id_room={this.state.id_room}
                                        handlePopUp={this.handlePopUp}
                                        start_date={this.state.start_date}
                                        end_date={this.state.end_date}
                                        total_price={this.state.total_price}/>
                    </div>
                </div>}
            </div>
        );
    }

    reservationHandle = (e) => {
        e.preventDefault();
        const cookieUserID = cookies.get('CookieUserID');
        if (typeof cookieUserID === 'undefined') {
            this.handlePopUp();
        } else {
            axios.post('/bookRoom',
                {
                    CookieUserID: cookieUserID,
                    id_room: this.state.id_room,
                    start_date: this.state.start_date,
                    end_date: this.state.end_date,
                    total_price: this.state.total_price
                }
            ).then(res => {
                this.setState({status: res.data});
            });
        }
    }

    handlePopUp = () => {
        this.setState({isOpen: !this.state.isOpen})
    }
}

export default RegisterRoom
