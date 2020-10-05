import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
    return (
        <header style={headerStyle}>
            <h1>Test App</h1>
            <Link style={linkStyle} to="/">Home</Link> | <Link style={linkStyle} to="/about">About</Link> | <Link style={linkStyle} to="/dateTime">DateTime</Link> |  <Link style={linkStyle} to="/tableData">TableData</Link> |  <Link style={linkStyle} to="/login">Login</Link>
        </header>
    )
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