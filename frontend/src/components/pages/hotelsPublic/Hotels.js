import React, {Component} from 'react';
import PropTypes from 'prop-types';
import HotelItem from "./HotelItem";


class Hotels extends Component {

    render() {
        return this.props.hotels.map((hotel) => (
            <HotelItem
                key={hotel.hotel_id}
                hotel={hotel}
                searched={this.props.searched}
                start_date={this.props.start_date}
                end_date={this.props.end_date}
                adult_count={this.props.adult_count}
                child_count={this.props.child_count}
                room_count={this.props.room_count}
            />
        ))
    }
}


Hotels.propTypes = {
    hotels: PropTypes.array.isRequired,
}


export default Hotels;
