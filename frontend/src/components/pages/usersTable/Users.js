import React, { Component } from 'react';
import UserItem from './UserItem';
import PropTypes from 'prop-types';

class Users extends Component {

    render() {
        return this.props.users.map((user) => (
            <UserItem
                key={user.id_user}
                user={user}
            />
        ))
    }
}

Users.propTypes = {
    users: PropTypes.array.isRequired,
}

export default Users;
