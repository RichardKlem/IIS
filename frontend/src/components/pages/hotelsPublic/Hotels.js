import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HotelItemOwner from "../hotelsAdmin/HotelItemOwner";
import HotelItem from "./HotelItem";


class Hotels extends Component {

    render() {
        return this.props.hotels.map((hotel) => (
            this.showEditOptions(hotel)
        ))
    }

    showEditOptions = (hotel) => {
        if (window.location.pathname === "/account") {
            return(
                <HotelItemOwner
                    key={hotel.hotel_id}
                    hotel={hotel}
                />
            )
        } else {
            return(
                <HotelItem
                    key={hotel.hotel_id}
                    hotel={hotel}
                />
            )
        }
    }
}


Hotels.propTypes = {
    hotels: PropTypes.array.isRequired,
}



export default Hotels;
