import React, {Component} from 'react'
import { Dropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
const cookies = new Cookies();

export class Header extends Component {
    //todo change password site

    state = {
        image: null,
        userName: '',
    }

    signOut = () => {
        cookies.remove('CookieUserID');
        this.setState({ status : "Logged out successfully" });
    }

    userLoginAction = () => {
        const cookieUserID = cookies.get('CookieUserID');
        if (typeof cookieUserID === 'undefined') {
            return(
                <li className="nav-item nav-profile border-0" style={{display:'flex'}}>
                    <div className="navbar-toggler align-self-center">
                        <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/login">Login</Link>
                    </div>
                    <div className="navbar-toggler align-self-center">
                        <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/registration">Register</Link>
                    </div>
                </li>)
        } else {
            if (this.state.image === null) {
                axios.post('/getProfileImage', { CookieUserID: cookies.get('CookieUserID')})
                    .then(res => {
                            this.setState({image : res.data});
                        }
                    );
            }
            if (this.state.userName === '') {
                axios.post('/getUserName', { CookieUserID: cookies.get('CookieUserID')})
                    .then(res => {
                            this.setState({userName : res.data.name});
                        }
                    );
            }
            return(
                <li className="nav-item nav-profile border-0">
                    <Dropdown>
                        <Dropdown.Toggle className="nav-link bg-transparent" style={{display:'flex'}}>
                            <div style={{display:'flex', textAlign: 'bottom'}}>
                            <h4 className="align-self-center " style={{color:'#000', marginBottom: '-0.1rem', marginLeft:'10px', marginRight:'10px'}}>{this.state.userName}</h4>
                            <img className="img-xs rounded-circle" src={`data:image/*;base64,${this.state.image}`} alt="Profile" />
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="preview-list navbar-dropdown pb-3">
                            <Dropdown.Item as={Link} to={'/account'} className="dropdown-item preview-item d-flex align-items-center border-0 mt-2">
                                Manage Account
                            </Dropdown.Item>
                            <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0" onClick={evt =>evt.preventDefault()}>
                                Change Password
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to={'/'} onClick={this.signOut} className="dropdown-item preview-item d-flex align-items-center border-0">
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
    render () {
        return (
            <header style={headerStyle}>
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

    renderLinks() {
        if (window.innerWidth > 600) {
            return <>
                <div className="navbar-nav navbar-nav-left" style={{flexDirection:'row'}}>
                <Dropdown>
                    <Dropdown.Toggle variant="navbar-toggler align-self-center">
                        <i className="mdi mdi-menu"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to={'/'}>Home Page</Dropdown.Item>
                        <Dropdown.Item as={Link} to={'/about'}>About Us</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <div style={{display:'flex'}}>
                    <div className="navbar-toggler">
                        <Link to="/">Home Page</Link>
                    </div>
                    <div className="navbar-toggler">
                        <Link to="/about">About Us</Link>
                    </div>
                </div>
                </div>
            </>;
        } else {
            return <>
            <Dropdown>
                <Dropdown.Toggle variant="navbar-toggler align-self-center">
                    <i className="mdi mdi-menu"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={'/'}>Home Page</Dropdown.Item>
                    <Dropdown.Item as={Link} to={'/about'}>About Us</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            </>;
        }
    }
}

const headerStyle = {
    paddingBottom: '63px',
}

export default Header;