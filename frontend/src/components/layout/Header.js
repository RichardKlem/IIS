import React, {Component} from 'react'
import { Link } from 'react-router-dom'

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
                <Link style={linkStyle} to="/login">Login</Link>
            </header>
        )
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

export default Header;