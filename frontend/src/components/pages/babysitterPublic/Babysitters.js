import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BabysitterListItem from "./BabysitterListItem";


class Babysitters extends Component {

    render() {
        return this.props.babysitters.map((babysitter) => (
            this.showEditOptions(babysitter)
        ))
    }

    showEditOptions(babysitter) {
        return (<BabysitterListItem
            key={babysitter.id_babysitter}
            babysitter={babysitter}
            start_date={this.props.start_date}
            start_time={this.props.start_time}
            end_date={this.props.end_date}
            end_time={this.props.end_time}
            id_reservation={this.props.id_reservation === undefined ? "" : this.props.id_reservation}
        />)
    }
}


Babysitters.propTypes = {
    babysitters: PropTypes.array.isRequired,
}


export default Babysitters;
