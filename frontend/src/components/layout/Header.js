import React, {Component} from 'react'
import {Dropdown} from 'react-bootstrap';
import {Link} from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import HomeIcon from "mdi-react/HomeIcon";
import {Redirect} from "react-router";

const cookies = new Cookies();
let cookieUserID = cookies.get('CookieUserID');

export class Header extends Component {
    state = {
        isLoading: true,
        image: null,
        userName: '',
        isOpenLogin: false,
        role: 5,
        isOpenRegistration: false,
    }

    componentDidMount() {
        if (typeof (cookieUserID) !== 'undefined') {
            axios.post('/account', {CookieUserID: cookieUserID})
                .then(res => {
                        this.setState({role: res.data.role});
                        this.setState({isLoading: false})
                    }
                );
        } else {
            this.setState({isLoading: false})
        }
    }

    render() {
        const {isLoading} = this.state;
        if (isLoading) {
            return (
                <div className="App">Loading...</div>
            );
        } else {
            return (
                <header className="header-offset">
                    <nav
                        className="navbar border border-dark width-calc-100 align-items-center justify-content-between d-flex fixed-top">
                        <div className="width-calc-100 align-items-center justify-content-between d-flex">
                            {this.renderLinks()}
                            <ul className="navbar-nav">
                                {this.userLoginAction()}
                            </ul>
                        </div>
                    </nav>
                </header>
            );
        }
    }

    signOut = () => {
        cookies.remove('CookieUserID');
        this.setState({status: "Logged out successfully"});
        cookieUserID = undefined;
        return <Redirect to="/"/>
    }

    userLoginAction = () => {
        if (typeof cookieUserID === 'undefined') {
            return (
                <li className="d-flex">
                    <div className="padding-left-10 padding-right-10">
                        <Link className="btn btn-primary"
                              to="/login">Login</Link>
                    </div>
                    <div className="padding-left-10 padding-right-10">
                        <Link className="btn btn-primary"
                              to="/registration">Register</Link>
                    </div>
                </li>)
        } else {
            if (this.state.image === null) {
                axios.post('/getProfileImage', {CookieUserID: cookies.get('CookieUserID')})
                    .then(res => {
                            this.setState({image: res.data});
                        }
                    );
            }
            if (this.state.userName === '') {
                axios.post('/getUserName', {CookieUserID: cookies.get('CookieUserID')})
                    .then(res => {
                            this.setState({userName: res.data.name});
                        }
                    );
            }
            return (
                <li>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="toggle-arrow-hide navbar-toggler align-self-center border border-blue">
                            <div className="d-flex">
                                <h4 className="profile-name align-self-center">
                                    {this.state.userName}
                                </h4>
                                <div className="padding-right-10">
                                    <img className="img-xs"
                                         src={`data:image/*;base64,${this.state.image}`}
                                         alt="Profile"/>
                                </div>
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={'/account'}>
                                Manage Account
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to={'/bookings'}>
                                Bookings
                            </Dropdown.Item>
                            {this.adminSettings()}
                            <Dropdown.Item as={Link} to={'/'} onClick={this.signOut}>
                                Sign Out
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            )
        }
    }

    toggleRightSidebar() {
        document.querySelector('.right-sidebar').classList.toggle('open');
    }

    renderLinks() {
        if (window.innerWidth > 600) {
            return <>
                <div className="navbar-nav navbar-nav-link">
                    <Dropdown>
                        <Dropdown.Toggle variant="toggle-arrow-hide navbar-toggler align-self-center">
                            <HomeIcon className="mdi mdi-menu"/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={'/'}>Home Page</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <div className="d-flex">
                        <div className="navbar-toggler link-padding">
                            <Link to="/">Home Page</Link>
                        </div>
                    </div>
                </div>
            </>;
        } else {
            return <>
                <Dropdown>
                    <Dropdown.Toggle variant="toggle-arrow-hide navbar-toggler align-self-center">
                        <HomeIcon className="mdi mdi-menu"/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to={'/'}>Home Page</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </>;
        }
    }

    adminSettings = () => {
        if (this.state.role === 0) {
            return (
                <>
                    <Dropdown.Item as={Link} to={'/admin'}>
                        Manage Users
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={'/adminHotels'}>
                        Manage Hotels
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={'/adminBookings'}>
                        Manage Bookings
                    </Dropdown.Item>
                </>
            )

        } else if (this.state.role === 1) {
            return (
                <>
                    <Dropdown.Item as={Link} to={'/adminHotels'}>
                        Manage Hotels
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={'/adminBookings'}>
                        Manage Bookings
                    </Dropdown.Item>
                </>
            )

        } else if (this.state.role === 2) {
            return (
                <Dropdown.Item as={Link} to={'/adminBookings'}>
                    Manage Bookings
                </Dropdown.Item>)
        }
    }
}

export default Header;