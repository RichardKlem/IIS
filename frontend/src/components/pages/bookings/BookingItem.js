import React, {Component} from 'react'
import PropTypes from 'prop-types';
import axios from "axios";

export class BookingItem extends Component {

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
            total_price: this.props.booking.total_price,
            pre_price: this.props.booking.pre_price,
            end_date: this.props.booking.end_date,
            approved: this.props.booking.approved === 1 ? "1" : "0",
            check_in: this.props.booking.check_in === 1 ? "1" : "0",
            check_out: this.props.booking.check_out === 1 ? "1" : "0",
            status: '',
        }
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});

    onChangeCheckbox = (e) => {
        if (e.target.value === "0") {
            this.setState({[e.target.name]: "1"});
        } else {
            this.setState({[e.target.name]: "0"});
        }
    }

    UserInfoUpdateHandler = () => {
        axios.post('/updateBooking', {
            id_reservation: this.state.id_reservation,
            approved: this.state.approved,
            check_in: this.state.check_in,
            check_out: this.state.check_out,
        }).then(res => {
                this.setState({status: res.data});
            }
        );
    }

    RemoveBookingHandler = () => {
        axios.post('/removeBooking', {
            id_reservation: this.state.id_reservation,
        }).then(res => {
                this.setState({status: res.data});
            }
        );
    }

    render() {
        return (
            <tr>
                <td><input
                    style={{width: 'auto/5'}}
                    className="text-center form-control form-control-sm"
                    type='text'
                    name='id_reservation'
                    placeholder='Reservation ID'
                    value={this.state.id_reservation}
                    onChange={this.onChange}
                    readOnly
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='text'
                    name='name'
                    placeholder='User Name'
                    value={this.state.name}
                    onChange={this.onChange}
                    readOnly
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='text'
                    name='phone_number'
                    placeholder='Phone Number'
                    pattern="[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}"
                    value={this.state.phone_number}
                    onChange={this.onChange}
                    readOnly
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='email'
                    name='email'
                    placeholder='Email'
                    value={this.state.email}
                    onChange={this.onChange}
                    readOnly
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='date'
                    name='birth_date'
                    placeholder='Birth Date'
                    value={this.state.birth_date}
                    onChange={this.onChange}
                    readOnly
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='text'
                    name='address'
                    placeholder='Address'
                    value={this.state.address}
                    onChange={this.onChange}
                    readOnly
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='text'
                    name='hotel_name'
                    placeholder='Hotel Name'
                    value={this.state.hotel_name}
                    onChange={this.onChange}
                    readOnly
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='text'
                    name='room_name'
                    placeholder='Room Name'
                    value={this.state.room_name}
                    onChange={this.onChange}
                    readOnly
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='date'
                    name='start_date'
                    placeholder='Start Date'
                    value={this.state.start_date}
                    onChange={this.onChange}
                    readOnly
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='date'
                    name='end_date'
                    placeholder='End Date'
                    value={this.state.end_date}
                    onChange={this.onChange}
                    readOnly
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='number'
                    name='total_price'
                    placeholder='Total price'
                    value={this.state.total_price}
                    onChange={this.onChange}
                    readOnly
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='number'
                    name='pre_price'
                    placeholder='Pre price'
                    value={this.state.pre_price}
                    onChange={this.onChange}
                    readOnly
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='checkbox'
                    name='approved'
                    placeholder='Approved'
                    checked={this.state.approved === "1" ? true : null}
                    value={this.state.approved}
                    onChange={this.onChangeCheckbox}
                    required
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='checkbox'
                    name='check_in'
                    placeholder='Check-In'
                    checked={this.state.check_in === "1" ? true : null}
                    value={this.state.check_in}
                    onChange={this.onChangeCheckbox}
                    required
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='checkbox'
                    name='check_out'
                    placeholder='Check-Out'
                    checked={this.state.check_out === "1" ? true : null}
                    value={this.state.check_out}
                    onChange={this.onChangeCheckbox}
                    required
                /></td>
                <td><input
                    type="submit"
                    value="Submit"
                    onClick={this.UserInfoUpdateHandler}
                    className="btn btn-block btn-primary btn-sm font-weight-medium auth-form-btn "
                /></td>
                <td><input
                    type="submit"
                    value="Remove"
                    onClick={this.RemoveBookingHandler}
                    className="btn btn-block btn-danger btn-primary btn-sm font-weight-medium auth-form-btn "
                /></td>
                <td><p>{this.state.status}</p></td>
            </tr>
        )
    }
}

BookingItem.propTypes = {
    booking: PropTypes.object.isRequired,
}


export default BookingItem

