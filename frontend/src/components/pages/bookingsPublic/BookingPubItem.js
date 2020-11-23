import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Form} from "react-bootstrap";
import axios from "axios";
import {Redirect} from "react-router";
import moment from "moment";

export class BookingPubItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id_reservation: this.props.booking.id_reservation,
            name: this.props.booking.name,
            phone_number: this.props.booking.phone_number,
            email: this.props.booking.email,
            birth_date: this.props.booking.birth_date,
            address: this.props.booking.address,
            hotel_name: this.props.booking.hotel_name,
            room_name: this.props.booking.room_name,
            start_date: this.props.booking.start_date,
            end_date: this.props.booking.end_date,
            check_in: this.props.booking.check_in,
            check_out: this.props.booking.check_out,
            babysitters: [],
            isLoading: true,
            isBookingOpen: false
        }
    }

    componentDidMount() {
        axios.post('/getRoomImage', {id_room: this.props.booking.id_room, hotel_id: this.props.booking.hotel_id})
            .then(res => {
                    this.setState({image: res.data});
                    axios.post('/checkBabysitterOnBooking', {id_reservation: this.props.booking.id_reservation})
                        .then((res) => {
                                this.setState({babysitters: res.data})
                            }
                        );
                    this.setState({isLoading: false})
                }
            );
    }


    render() {
        if (this.state.isLoading === true) {
            return <div className="App">Loading...</div>;
        } else {
            return (
                <div className="card padding-10">
                    <div className="d-flex border">
                        <div className="item-list-style">
                            <img src={`data:image/*;base64,${this.state.image}`} alt="hotel"
                                 className="item-list-style-img"/>
                        </div>
                        <div className="card-body">
                            <div className="d-flex">
                                <h3>{this.props.booking.hotel_name}: {this.props.booking.room_name}</h3>
                            </div>
                            <form>
                                <div>
                                    <Form.Group>
                                        <div className="d-flex">
                                            <div className="padding-10">
                                                Start Date
                                                <input name="start_date" defaultValue={this.props.booking.start_date}
                                                       placeholder="Start date"
                                                       className="text-center form-control form-control-sm" type="date"
                                                       onChange={this.props.onChange}
                                                       disabled/>
                                            </div>
                                            <div className="padding-10">
                                                End Date
                                                <input name="end_date" defaultValue={this.props.booking.end_date}
                                                       placeholder="Start date"
                                                       className="text-center form-control form-control-sm" type="date"
                                                       onChange={this.props.onChange}
                                                       disabled/>
                                            </div>
                                        </div>
                                    </Form.Group>
                                </div>
                                <div>
                                    <div className="justify-content-between d-flex">
                                        <div className="padding-left-10 line-height-sm">
                                            <p>Status: {this.props.booking.approved === 1 ? "Approved" : "Waiting for approval"}</p>
                                            <p>Total price: {this.props.booking.total_price} Kč</p>
                                            <p>{this.props.booking.pre_price !== 0 && this.props.booking.approved === 0 ? "Needs to be paid:" + this.props.booking.pre_price + "Kč" : ""}</p>
                                            <div className="padding-10"/>
                                            <h3> {this.state.babysitters.length > 0 ? "Babysitting:" : ""}</h3>
                                            {this.state.babysitters.length > 0 ? this.babysitterList() : ""}
                                        </div>
                                        <div className="d-flex">
                                            <button className="align-self-center btn btn-success"
                                                    onClick={this.reserveBabysitterHandler}>Reserve Babysitter
                                            </button>
                                            <div className="padding-10"/>
                                            <button className="align-self-center btn btn-danger"
                                                    onClick={this.removeReservation}>{this.props.booking.free_cancellation === 1 ? "Cancel Booking (free)" : "Cancel Booking"}</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    {this.bookBabysitter()}
                </div>
            )
        }
    }

    removeReservation = (e) => {
        e.preventDefault();
        axios.post('/removeBooking', {id_reservation: this.props.booking.id_reservation})
            .then((res) => {
                    window.location.reload(false);
                }
            );
    }

    reserveBabysitterHandler = (e) => {
        e.preventDefault();
        this.setState({isBookingOpen: true})

    }


    bookBabysitter = () => {
        if (this.state.isBookingOpen) {
            return (
                <Redirect to={{
                    pathname: "/babysitters",
                    state: {
                        id_reservation: this.props.booking.id_reservation,
                        res_start_date: this.props.booking.start_date,
                        res_end_date: this.props.booking.end_date,
                    }
                }}/>
            )
        }
    }

    babysitterList = () => {
        return (this.state.babysitters.map((babysitter) => (
            this.renderList(babysitter)
        )));
    }

    renderList(babysitter) {
        return (<div className="card-description border border-light">
            <p className="padding-top-5"/>
            <p>Name: {babysitter.name}, Phone: {babysitter.phone_number}</p>
            <p>{"From: " + moment(babysitter.start_date).format("YYYY-MM-DD HH:mm") + " To: " + moment(babysitter.end_date).format("YYYY-MM-DD HH:mm ")}</p>
            <p>Total Price: {babysitter.total_price} Kč</p>
        </div>)
    }
}

BookingPubItem.propTypes = {
    booking: PropTypes.object.isRequired,
}


export default BookingPubItem

