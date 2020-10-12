import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Cookies from "universal-cookie";
import axios from "axios";

export class UserItem extends Component {
    state = {
        id_user : this.props.user.id_user,
        name : this.props.user.name,
        phone_number : this.props.user.phone_number,
        birth_date: this.props.user.birth_date,
        email: this.props.user.email,
        role: this.props.user.role,
        status: '',
    }



    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    UserInfoUpdateHandler = (e) => {
        e.preventDefault();
        const cookies = new Cookies();
        axios.post('/updateAccount', {
            CookieUserID: cookies.get('CookieUserID'),
            name: this.state.name,
            birth_date: this.state.birth_date,
            email: this.state.email,
            phone_number: this.state.phone_number,
        }).then(res => {
                this.setState({ status : res.data});
            }
        );
    }

    render() {
        return (
            <form onSubmit={this.UserInfoUpdateHandler} style={{ display: 'block'}}>
                <div style={{ display: 'flex', paddingTop: '5px', paddingBottom: '5px'  }}>
                    <p style={{ paddingRight : '10px' }}>ID:</p>
                    <input
                        style={{display: 'block'}}
                        type='text'
                        name='id_user'
                        placeholder='User ID'
                        value={this.state.id_user}
                        onChange={this.onChange}
                        readOnly
                    />
                </div>
                <div style={{ display: 'flex', paddingTop: '5px', paddingBottom: '5px'  }}>
                    <p style={{ paddingRight : '10px' }}>Name:</p>
                    <input
                        style={{display: 'block'}}
                        type='text'
                        name='name'
                        placeholder='Name'
                        value={this.state.name}
                        onChange={this.onChange}
                        required
                    />
                </div>
                <div style={{ display: 'flex', paddingTop: '5px', paddingBottom: '5px'  }}>
                    <p style={{ paddingRight : '10px' }}>Phone number:</p>
                    <input
                        style={{display: 'block'}}
                        type='text'
                        name='phone_number'
                        placeholder='Phone Number'
                        pattern="[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}"
                        value={this.state.phone_number}
                        onChange={this.onChange}
                        required
                    />
                </div>
                <div style={{ display: 'flex', paddingTop: '5px', paddingBottom: '5px'  }}>
                    <p style={{ paddingRight : '10px' }}>Birth date:</p>
                    <input
                        style={{display: 'block'}}
                        type='date'
                        name='birth_date'
                        placeholder='Birth date'
                        value={this.state.birth_date}
                        onChange={this.onChange}
                        required
                    />
                </div>
                <div style={{ display: 'flex', paddingTop: '5px', paddingBottom: '5px'  }}>
                    <p style={{ paddingRight : '10px' }}>Email:</p>
                    <input
                        style={{display: 'block'}}
                        type='email'
                        name='email'
                        placeholder='e-mail'
                        value={this.state.email}
                        onChange={this.onChange}
                        required
                    />
                </div>
                <div style={{ display: 'flex', paddingTop: '5px', paddingBottom: '5px'  }}>
                    <p style={{ paddingRight : '10px' }}>Role:</p>
                    <input
                        style={{display: 'block'}}
                        type='text'
                        name='role'
                        placeholder='Role'
                        value={this.state.role}
                        onChange={this.onChange}
                        required
                    />
                </div>
                <input
                    style={{display: 'block'}}
                    type="submit"
                    value="Submit Changes"
                    className="btn"
                />
                <p>{this.state.status}</p>
                <hr style={{ borderTop: '3px solid #bbb', marginTop : '5px' }}></hr>
            </form>
        )
    }
}

UserItem.propTypes = {
    user: PropTypes.object.isRequired,
}


export default UserItem

