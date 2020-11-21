import React, {Component} from 'react';
import BookingItem from './BookingItem';
import PropTypes from 'prop-types';

class Booking extends Component {

    render() {
        return this.props.bookings.map((booking) => (
            <BookingItem
                key={booking.id_reservation}
                booking={booking}
            />
        ))
    }
}

Booking.propTypes = {
    bookings: PropTypes.array.isRequired,
}

export default Booking;
