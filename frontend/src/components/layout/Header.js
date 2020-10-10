import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import Cookies from "universal-cookie";

export class Header extends Component {
    render() {
        return (
            <header style={headerStyle}>
                <h1>Test App</h1>
                <Link style={linkStyle} to="/">Todos | </Link>
                <Link style={linkStyle} to="/about">About | </Link>
                <Link style={linkStyle} to="/dateTime">DateTime | </Link>
                <Link style={linkStyle} to="/tableData">TableData | </Link>
                <Link style={linkStyle} to="/registration">Register | </Link>
                <Link style={linkStyle} to="/account">Manage Account | </Link>
                <Link style={linkStyle} to="/login">Login | </Link>
                <button style={buttonStyle} onClick={ this.logoutHandler }>Logout</button>
            </header>
        )
    }

    logoutHandler = () => {
        const cookies = new Cookies();
        cookies.remove('CookieUserID');
        this.setState({ status : "Logged out successfully" });
    }

}

const headerStyle = {
    background: '#263238',
    color: '#fff',
    textAlign: 'left',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '10px',
}

const linkStyle = {
    color: '#fff',
    textDecoration: 'none'
}

const buttonStyle = {
    color: '#fff',
    backgroundColor: 'transparent',
    textDecoration: 'none'
}

export default Header;