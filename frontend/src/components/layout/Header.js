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
    //todo change password site

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

    signOut = () => {
        cookies.remove('CookieUserID');
        this.setState({status: "Logged out successfully"});
        cookieUserID = undefined;
        return <Redirect to="/"/>
    }

    userLoginAction = () => {
        if (typeof cookieUserID === 'undefined') {
            return (
                <li className="nav-item nav-profile border-0" style={{display: 'flex'}}>
                    <div className="navbar-toggler align-self-center">
                        <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                              to="/login">Login</Link>
                    </div>
                    <div className="navbar-toggler align-self-center">
                        <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
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
                <li className="nav-item nav-profile border-0">
                    <Dropdown>
                        <Dropdown.Toggle className="nav-link bg-transparent" style={{display: 'flex'}}>
                            <div style={{display: 'flex', textAlign: 'bottom'}}>
                                <h4 className="align-self-center " style={{
                                    color: '#000',
                                    marginBottom: '-0.1rem',
                                    marginLeft: '10px',
                                    marginRight: '10px'
                                }}>{this.state.userName}</h4>
                                <div style={{paddingRight: "10px"}}>
                                    <img className="img-xs rounded-circle"
                                         src={`data:image/*;base64,${this.state.image}`}
                                         alt="Profile"/>
                                </div>
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="preview-list navbar-dropdown pb-3">
                            <Dropdown.Item as={Link} to={'/account'}
                                           className="dropdown-item preview-item d-flex align-items-center border-0 mt-2">
                                Manage Account
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to={'/bookings'}
                                           className="dropdown-item preview-item d-flex align-items-center border-0 mt-2">
                                Bookings
                            </Dropdown.Item>
                            {this.adminSettings()}
                            <Dropdown.Item as={Link} to={'/'} onClick={this.signOut}
                                           className="dropdown-item preview-item d-flex align-items-center border-0  mt-2">
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

    render() {
        const {isLoading} = this.state;
        if (isLoading) {
            return (
                <div className="App">Loading...</div>
            );
        } else {
            return (
                <header style={{paddingBottom: '63px'}}>
                    <nav className="navbarCustom col-lg-12 col-12 p-lg-0 fixed-top d-flex flex-row border">
                        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-between">
                            {this.renderLinks()}
                            <ul className="navbar-nav navbar-nav-right">
                                {this.userLoginAction()}
                            </ul>
                        </div>
                    </nav>
                </header>
            );
        }
    }

    renderLinks() {
        if (window.innerWidth > 600) {
            return <>
                <div className="navbar-nav navbar-nav-left" style={{flexDirection: 'row'}}>
                    <Dropdown>
                        <Dropdown.Toggle variant="toggle-arrow-hide navbar-toggler align-self-center">
                            <HomeIcon className="mdi mdi-menu"/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to={'/'}>Home Page</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <div style={{display: 'flex'}}>
                        <div className="navbar-toggler">
                            <Link to="/">Home Page</Link>
                        </div>
                    </div>
                </div>
            </>;
        } else {
            return <>
                <Dropdown>
                    <Dropdown.Toggle variant="navbar-toggler align-self-center">
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
                    <Dropdown.Item as={Link} to={'/admin'}
                                   className="dropdown-item preview-item d-flex align-items-center border-0 mt-2">
                        Manage Users
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={'/adminHotels'}
                                   className="dropdown-item preview-item d-flex align-items-center border-0 mt-2">
                        Manage Hotels
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={'/adminBookings'}
                                   className="dropdown-item preview-item d-flex align-items-center border-0 mt-2">
                        Manage Bookings
                    </Dropdown.Item>
                </>
            )

        } else if (this.state.role === 1) {
            return (
                <>
                    <Dropdown.Item as={Link} to={'/adminHotels'}
                                   className="dropdown-item preview-item d-flex align-items-center border-0 mt-2">
                        Manage Hotels
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to={'/adminBookings'}
                                   className="dropdown-item preview-item d-flex align-items-center border-0 mt-2">
                        Manage Bookings
                    </Dropdown.Item>
                </>
            )

        } else if (this.state.role === 2) {
            return (
                <Dropdown.Item as={Link} to={'/adminBookigs'}
                               className="dropdown-item preview-item d-flex align-items-center border-0 mt-2">
                    Manage Bookings
                </Dropdown.Item>)
        }
    }
}

export default Header;