import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {Form} from "react-bootstrap";
import axios from "axios";

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
            isLoading: true,
        }
    }

    componentDidMount() {
        axios.post('/getRoomImage', {id_room: this.props.booking.id_room, hotel_id: this.props.booking.hotel_id})
            .then(res => {
                    this.setState({image: res.data});
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
                                        </div>
                                        <div>
                                            <button className="align-self-center btn btn-danger"
                                                    onClick={this.removeReservation}>{this.props.booking.free_cancellation === 1 ? "Cancel Reservation (free)" : "Cancel Reservation"}</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
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
}

BookingPubItem.propTypes = {
    booking: PropTypes.object.isRequired,
}


export default BookingPubItem

