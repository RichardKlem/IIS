import React, {Component} from 'react'
import {Form} from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from "axios";
import {Link} from "react-router-dom";
import Cookies from "universal-cookie";
import OpenRoom from "./OpenRoom";
import {Redirect} from "react-router";
import RegBookingPage from "../loginRegPage/RegBookingPage";
import moment from "moment";

const cookies = new Cookies();
let cookieUserID = cookies.get('CookieUserID');

export class RoomListItem extends Component {

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
            isReserved: true,
        }
    }

    componentDidMount() {
        axios.post('/isRoomReserved', {id_room: this.props.room.id_room})
            .then(res => {
                this.setState({isReserved: res.data.status});
            });

        axios.post('/getRoomImage', {id_room: this.props.room.id_room, hotel_id: this.props.room.hotel_id})
            .then(res => {
                    this.setState({image: res.data});
                    this.checkAvailability();
                    this.setState({isLoading: false})
                }
            );
        cookieUserID = cookies.get('CookieUserID');
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.start_date !== this.props.start_date || prevProps.end_date !== this.props.end_date
            || prevProps.room_count !== this.props.room_count) {
            this.checkAvailability();
        }
        cookieUserID = cookies.get('CookieUserID');
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
                    <div className="card padding-10">
                        <div className="border border-light d-flex">
                            <div className="item-list-style">
                                <img src={`data:image/*;base64,${this.state.image}`} alt="hotel"
                                     className="item-list-style-img"/>
                            </div>
                            <div className="card-body">
                                <div className="d-flex">
                                    <div className="padding-left-10 not-btn">
                                        <h3>{this.props.room.name}</h3>
                                    </div>
                                    <div className="width-auto padding-bottom-10 margin-top-5-neg padding-top-10">
                                        <select
                                            name="category" value={this.props.room.category}
                                            className="form-control select-disabled white-textarea" disabled>
                                            <option value="1">Standard Room</option>
                                            <option value="2">Business Double</option>
                                            <option value="3">Standard Triple</option>
                                            <option value="4">Business</option>
                                            <option value="5">Deluxe</option>
                                            <option value="6">Studio</option>
                                            <option value="7">Suite</option>
                                        </select>
                                    </div>
                                    <div
                                        className="width-auto padding-bottom-10 margin-top-5-neg padding-top-10 padding-left-10">
                                        <select name="bed_type" defaultValue={this.props.room.bed_type}
                                                className="form-control select-disabled white-textarea" disabled>
                                            <option value="1">Separate beds</option>
                                            <option value="2">Double beds</option>
                                        </select>
                                    </div>
                                </div>
                                <form>
                                    <Form.Group>
                                        <p>{this.props.room.address}</p>
                                        <textarea value={this.props.room.description}
                                                  className="form-control white-textarea" rows="4"
                                                  readOnly>{this.state.description}</textarea>
                                    </Form.Group>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <div className="d-flex">
                                                <div>
                                                    <p className="padding-left-5 margin-0">Beds
                                                        count: {this.props.room.bed_count}</p>
                                                    <p className="padding-left-5 margin-0">{"Room size:" + this.props.room.room_size + "m"}<sup>2</sup>
                                                    </p>
                                                    <p className="padding-left-5 margin-0 color-green flex-wrap-reverse">{this.props.room.free_breakfast === 1 ? "Offered with free breakfast" : ""}</p>
                                                </div>
                                                <div className="padding-left-10">
                                                    <p className="margin-0">{(this.props.start_date !== "" && this.props.end_date !== "") ? "Price per night: " + this.props.room.price_night + "Kč (reservation fee included)" : ""}</p>
                                                    <b className="margin-0">{(this.props.start_date !== "" && this.props.end_date !== "") ? "Reservation fee (per night): " + this.props.room.pre_price + "Kč" : ""}</b>
                                                </div>
                                            </div>
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
                    <p>{((this.props.start_date !== "" && this.props.end_date !== "") && (moment(this.props.start_date) < moment(this.props.end_date))) ?
                        "Price for  " + this.props.room_count.toString() + " room(s) for " + this.calculateNights() + " night(s): " + this.calculatePrice() : "Please select date of your stay to see price."}</p>
                    {((this.props.start_date !== "" && this.props.end_date !== "") && (moment(this.props.start_date) < moment(this.props.end_date))) ?
                        <button className="btn btn-primary mr-2" onClick={this.handleBookingPopUp}>Reserve</button> :
                        <button className="btn btn-primary btn-success mr-2" disabled>Please select date first</button>}
                </div>
            )
        } else {
            return (
                <div>
                    <Link to={{pathname: `/editRoom/${this.props.room.id_room}`}} className="btn btn-primary mr-2">Edit
                        Room</Link>
                    {this.getButton()}
                </div>
            );
        }
    }

    getButton() {
        if (this.state.isReserved === true) {
            return <button className="btn bg-transparent disabled border" disabled>This room is reserved and cannot be
                removed.</button>;
        } else {
            return <button className="btn btn-danger" onClick={this.removeRoom}>Remove</button>;
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

    calculatePrePrice() {
        const nights = this.calculateNights();
        const price = nights * this.props.room.pre_price * this.props.room_count;
        return price.toString() + "Kč";
    }

    calculateNights() {
        const start_date = new Date(this.props.start_date);
        const end_date = new Date(this.props.end_date);
        return Math.ceil((end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24))
    }

    checkAvailability() {
        if (window.location.pathname.startsWith("/hotel/") && (this.props.room_count !== 0 || this.props.room_count !== undefined)) {
            axios.post('/checkDates', {
                id_room: this.props.room.id_room,
                start_date: this.props.start_date,
                end_date: this.props.end_date,
                room_count: this.props.room_count
            })
                .then(res => {
                    this.setState({isAvailable: res.data.available})
                });
        }
    }

    handlePopUp = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    removeRoom = () => {
        axios.post('/removeRoom', {id_room: this.props.room.id_room})
            .then(() => {
                }
            );
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
        if (typeof cookieUserID === 'undefined') {
            this.handleBookingPopUp(e);
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
            ).then(() => {
                this.setState({isBooked: true})
            }).catch(() => {
                this.setState({isBooked: false})
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
                {this.state.isRegistrationOpen && <div className="popup-box popover">
                    <div className="box-lg">
                        <span className="close-icon-lg" onClick={this.handleRegistrationPopUp}>x</span>
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
                {this.state.isBookingOpen && <div className="popup-box popover">
                    <div className="box d-flex">
                        <span className="close-icon" onClick={this.handleBookingPopUp}>x</span>
                        <div>
                            <div>
                                Do you want to book this room?
                            </div>
                            <div>
                                {this.props.no_prepayment === 1 ? "" : "Payment information will be sent to email."}
                            </div>
                            <div>
                                <button className="btn btn-primary mr-2"
                                        onClick={this.reservationHandle}>{this.props.no_prepayment === 1 ? (typeof cookieUserID !== "undefined" ? "Book" : "Register & Book") : (typeof cookieUserID !== "undefined" ? "Book (pay " + this.calculatePrePrice() + " reservation fee)" : "Register & Book (pay " + this.calculatePrePrice() + " reservation fee)")}</button>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
}

RoomListItem.propTypes = {
    room: PropTypes.object.isRequired,
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
}


export default RoomListItem;

