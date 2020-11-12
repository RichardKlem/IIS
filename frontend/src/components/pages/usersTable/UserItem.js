import React, {Component} from 'react'
import PropTypes from 'prop-types';
import axios from "axios";

export class UserItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id_user: this.props.user.id_user,
            name: this.props.user.name,
            phone_number: this.props.user.phone_number,
            birth_date: this.props.user.birth_date,
            email: this.props.user.email,
            address: this.props.user.address,
            role: this.props.user.role,
            status: '',
        }
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});

    UserInfoUpdateHandler = () => {
        axios.post('/updateUser', {
            id_user: this.state.id_user,
            name: this.state.name,
            birth_date: this.state.birth_date,
            email: this.state.email,
            address: this.state.address,
            phone_number: this.state.phone_number,
        }).then(res => {
                this.setState({status: res.data});
            }
        );
    }

    UserInfoRemoveHandler = () => {
        axios.post('/removeUser', {
            id_user: this.state.id_user,
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
                    name='id_user'
                    placeholder='User ID'
                    value={this.state.id_user}
                    onChange={this.onChange}
                    readOnly
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='text'
                    name='name'
                    placeholder='Full Name'
                    value={this.state.name}
                    onChange={this.onChange}
                    required
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
                    required
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='email'
                    name='email'
                    placeholder='Email'
                    value={this.state.email}
                    onChange={this.onChange}
                    required
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='date'
                    name='birth_date'
                    placeholder='Birth Date'
                    value={this.state.birth_date}
                    onChange={this.onChange}
                    required
                /></td>
                <td><input
                    style={{width: 'auto'}}
                    className="text-center form-control form-control-lg"
                    type='text'
                    name='address'
                    placeholder='Address'
                    value={this.state.address}
                    onChange={this.onChange}
                    required
                /></td>
                <td><input
                    style={{width: 'auto/5'}}
                    className="text-center form-control form-control-sm"
                    type='text'
                    name='role'
                    size="1"
                    placeholder='Role'
                    value={this.state.role}
                    onChange={this.onChange}
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
                    onClick={this.UserInfoRemoveHandler}
                    className="btn btn-danger btn-block btn-primary btn-sm font-weight-medium auth-form-btn "
                /></td>
                <td><p>{this.state.status}</p></td>
            </tr>
        )
    }
}

UserItem.propTypes = {
    user: PropTypes.object.isRequired,
}


export default UserItem

