import React, {Component} from 'react'
import {Form} from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from "axios";
import {Link} from "react-router-dom";
import Cookies from "universal-cookie";
import OpenRoom from "./OpenRoom";
import {Redirect} from "react-router";
import RegBookingPage from "../RegBookingPage";

const cookies = new Cookies();

export class RoomItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isAvailable: true,
            isBooked: false,
            image: null,
            isOpen: false,
            isRegistrationOpen: false,
            isBookingOpen: false,
        }
    }

    componentDidMount() {
        axios.post('/getRoomImage', {id_room: this.props.room.id_room, hotel_id: this.props.room.hotel_id})
            .then(res => {
                    this.setState({image: res.data});
                    this.checkAvailability();
                    this.setState({isLoading: false})
                }
            );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.start_date !== this.props.start_date || prevProps.end_date !== this.props.end_date
            || prevProps.room_count !== this.props.room_count) {
            this.checkAvailability();
        }
    }

    removeHotel = () => {
        axios.post('/removeRoom', {id_room: this.props.room.id_room})
            .then((res) => {
                }
            );
    }

    render() {
        if (this.state.isBooked === true) {
            return <div className="App">
                Booked successfully,
                <Redirect to={"/bookings"}/>
            </div>;
        }
        if (this.state.isLoading === true) {
            return <div className="App">Loading...</div>;
        } else {
            if (this.state.isAvailable === false) {
                return <div>Not available</div>;
            } else {
                return (
                    <div className="card" style={{padding: "10px"}}>
                        <div className="border" style={{display: 'flex'}}>
                            <div style={{display: 'block', margin: 'auto', marginLeft: '20px'}}>
                                <img src={`data:image/*;base64,${this.state.image}`} alt="hotel"
                                     style={{width: '225px', height: '225px'}} onClick={this.handlePopUp}/>
                            </div>
                            <div className="card-body">
                                <div style={{display: 'flex'}} className="forms-sample">
                                    <button className="btn btn-link" onClick={this.handlePopUp}>
                                        <h3>{this.props.room.name}</h3>
                                    </button>
                                    <div style={{paddingLeft: "10px", width: "150px"}}>
                                        <select style={{backgroundColor: "#fff", WebkitAppearance: "none"}}
                                                name="category" value={this.props.room.category}
                                                className="form-control form-control-lg" disabled>
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
                                <form className="forms-sample">
                                    <Form.Group>
                                        <p>{this.props.room.address}</p>
                                        <textarea style={{backgroundColor: "#fff"}} value={this.props.room.description}
                                                  className="form-control" rows="4"
                                                  readOnly>{this.state.description}</textarea>
                                    </Form.Group>
                                    <div className="justify-content-between" style={{display: 'flex'}}>
                                        <div style={{lineHeight: "0.5px"}}>
                                            <p style={{color: "#008000"}}>{this.props.room.free_breakfast === 1 ? "Offered with free breakfast" : ""}</p>
                                            <p>Beds count: {this.props.room.bed_count}</p>
                                            <p>Price per night: {this.props.room.price_night + "Kč"}</p>
                                            <p>{this.props.room.pre_price === 0 ? "" : "Pre-payprice: " + this.props.room.pre_price + "Kč"}</p>
                                            {this.prepaymentFields()}
                                        </div>
                                        {this.setUrl()}
                                    </div>
                                </form>
                            </div>
                        </div>
                        {this.openRoomPopUp()}
                        {this.registerRoomPopUp()}
                        {this.bookingRoomPopUp()}
                    </div>
                )
            }
        }
    };

    setUrl = () => {
        if (window.location.pathname.startsWith("/hotel/")) {
            return (
                <div>
                    <p>{
                        (this.props.start_date !== "" && this.props.end_date !== "") ?
                            "Price for  " + this.props.room_count.toString() + " room(s) for " + this.calculateNights() + " night(s): " + this.calculatePrice() : "Please select date of your stay to see price."}</p>
                    <button className="btn btn-primary mr-2" onClick={this.handleBookingPopUp}>Reserve</button>
                </div>
            )
        } else {
            return (
                <div>
                    <Link to={{pathname: `/editRoom/${this.props.room.id_room}`}} className="btn btn-primary mr-2">Edit
                        Room</Link>
                    <button className="btn btn-danger" onClick={this.removeHotel}>Remove</button>
                </div>
            );
        }
    }

    prepaymentFields = () => {
        if (this.props.no_prepayment === 0) {
            return (
                <p>Required prepayment: {this.props.room.pre_price}</p>
            )
        }
    }

    calculatePrice() {
        const nights = this.calculateNights();
        const price = nights * this.props.room.price_night * this.props.room_count;
        return price.toString() + "Kč";
    }

    calculateNights() {
        const start_date = new Date(this.props.start_date);
        const end_date = new Date(this.props.end_date);
        return Math.ceil((end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24))
    }

    checkAvailability() {
        axios.post('/checkDates', {
            id_room: this.props.room.id_room,
            start_date: this.props.start_date,
            end_date: this.props.end_date,
            room_count: this.props.room_count
        })
            .then(res => {
                this.setState({isAvailable: res.data})
            });
    }

    handlePopUp = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openRoomPopUp() {
        /* todo make new non-registered user booking page */
        return (<div>
                {this.state.isOpen && <div className="popup-box">
                    <div className="box">
                        <span className="close-icon" onClick={this.handlePopUp}>x</span>
                        <OpenRoom id_room={this.props.room.id_room}/>
                    </div>
                </div>}
            </div>
        );
    }

    reservationHandle = (e) => {
        e.preventDefault();
        const cookieUserID = cookies.get('CookieUserID');
        if (typeof cookieUserID === 'undefined') {
            this.handleRegistrationPopUp();
        } else {
            axios.post('/bookRoom',
                {
                    CookieUserID: cookieUserID,
                    id_room: this.props.room.id_room,
                    start_date: this.props.start_date,
                    end_date: this.props.end_date,
                    room_count: this.props.room_count,
                    adult_count: this.props.adult_count,
                    child_count: this.props.child_count,
                    approved: this.props.room.pre_price === 0 ? "1" : "0"
                }
            ).then(res => {
                this.setState({isBooked: true})
            });
        }
    }

    handleRegistrationPopUp = () => {
        this.setState({isRegistrationOpen: !this.state.isRegistrationOpen})
    }

    handleBookingPopUp = (e) => {
        e.preventDefault();
        this.setState({isBookingOpen: !this.state.isBookingOpen})
    }

    registerRoomPopUp() {
        return (<div>
                {this.state.isRegistrationOpen && <div className="popup-box">
                    <div className="box">
                        <span className="close-icon" onClick={this.handleRegistrationPopUp}>x</span>
                        <RegBookingPage id_room={this.props.room.id_room}
                                        handlePopUp={this.handlePopUp}
                                        start_date={this.props.start_date}
                                        end_date={this.props.end_date}
                                        room_count={this.props.room_count}
                                        adult_count={this.props.adult_count}
                                        child_count={this.props.child_count}
                                        approved={this.props.room.pre_price === 0 ? "1" : "0"}
                        />
                    </div>
                </div>}
            </div>
        );
    }

    bookingRoomPopUp() {
        return (<div>
                {this.state.isBookingOpen && <div className="popup-box">
                    <div className="box d-flex">
                        <span className="close-icon" onClick={this.handleBookingPopUp}>x</span>
                        <div>
                            <div>
                                Do you want to book this room?
                            </div>
                            <div>
                                {this.props.no_prepayment === 1 ? "" : "Payment page will be opened in new tab."}
                            </div>
                            <div>
                                <button className="btn btn-primary mr-2"
                                        onClick={this.reservationHandle}>{this.props.no_prepayment === 1 ? "Book" : "Book and pay: " + this.props.room.pre_price + "Kč"}</button>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
}

RoomItem.propTypes = {
    room: PropTypes.object.isRequired,
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
    adult_count: PropTypes.string.isRequired,
    child_count: PropTypes.string.isRequired,
}


export default RoomItem;

