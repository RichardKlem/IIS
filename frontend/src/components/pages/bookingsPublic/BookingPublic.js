import React, {Component} from 'react';
import BookingPubItem from './BookingPubItem';
import PropTypes from 'prop-types';

class BookingPublic extends Component {

    render() {
        return this.props.bookings.map((booking) => (
            <BookingPubItem
                key={booking.id_reservation}
                booking={booking}
            />
        ))
    }
}

BookingPublic.propTypes = {
    bookings: PropTypes.array.isRequired,
}

export default BookingPublic;
