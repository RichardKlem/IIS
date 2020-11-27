import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RoomListItem from "./RoomListItem";


class Rooms extends Component {

    render() {
        return this.props.rooms.map((room) => (
            this.showEditOptions(room)
        ))
    }

    showEditOptions(room) {
        if (window.location.pathname.startsWith("/hotel/")) {
            return (<RoomListItem
                key={room.id_room}
                no_prepayment={room.no_prepayment}
                hotel_id={room.hotel_id}
                start_date={this.props.start_date !== undefined ? this.props.start_date : ""}
                end_date={this.props.end_date !== undefined ? this.props.end_date : ""}
                adult_count={this.props.adult_count}
                room_count={Math.ceil((parseInt(this.props.adult_count)) / room.bed_count)}
                room={room}
            />)
        } else {
            return (<RoomListItem
                key={room.id_room}
                hotel_id={room.hotel_id}
                start_date={this.props.start_date}
                end_date={this.props.end_date}
                adult_count={this.props.adult_count}
                room={room}
            />)
        }
    }
}


Rooms.propTypes = {
    rooms: PropTypes.array.isRequired,
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
}


export default Rooms;
