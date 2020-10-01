import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
    return (
        <header style={headerStyle}>
            <h1>Test App</h1>
            <Link style={linkStyle} to="/">Home</Link> | <Link style={linkStyle} to="/about">About</Link> | <Link style={linkStyle} to="/dateTime">DateTime</Link> |  <Link style={linkStyle} to="/tableData">TableData</Link>
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
const header = {
    float: 'left',
    width: '33.33333%',
    textAlign: 'left'
}

const linkStyle = {
    color: '#fff',
    textDecoration: 'none'
}

const dropdownBasicButton = {
    display: 'inline-block',
    border: 'none',
    background: '#555',
    color: '#fff',
    padding: '7px 20px',
    cursor: 'pointer',
    textDecoration: 'none'
}

const dropdownBasicMenu = {
    float: 'left',
    width: '33.33333%',
    textAlign: 'right',
}


export default Header;