import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RoomItem from "./RoomItem";


class Rooms extends Component {

    render() {
        return this.props.rooms.map((room) => (
            this.showEditOptions(room)
        ))
    }

    showEditOptions(room) {
        if (window.location.pathname.startsWith("/hotel/")) {
            return (<RoomItem
                key={room.id_room}
                no_prepayment={room.no_prepayment}
                hotel_id={room.hotel_id}
                start_date={this.props.start_date !== undefined ? this.props.start_date : ""}
                end_date={this.props.end_date !== undefined ? this.props.end_date : ""}
                adult_count={this.props.adult_count}
                child_count={this.props.child_count}
                room_count={Math.ceil((parseInt(this.props.adult_count) + parseInt(this.props.child_count)) / room.bed_count)}
                room={room}
            />)
        } else {
            return (<RoomItem
                key={room.id_room}
                hotel_id={room.hotel_id}
                start_date={this.props.start_date}
                end_date={this.props.end_date}
                adult_count={this.props.adult_count}
                child_count={this.props.child_count}
                room={room}
            />)
        }
    }
}


Rooms.propTypes = {
    rooms: PropTypes.array.isRequired,
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
    adult_count: PropTypes.string.isRequired,
    child_count: PropTypes.string.isRequired,

}


export default Rooms;
