import React, {Component} from 'react'
import axios from "axios";
import Hotels from "./Hotels";
import {Link} from "react-router-dom";

export class RoomsList extends Component {
    state = {
        hotels: [],
    }

    componentDidMount() {
        axios.get('/getHotels' )
            .then(res => {
                this.setState({hotels : res.data});
                }
            );
    }

    render () {
        return (
            <React.Fragment>
                {this.showEditOptions()}
                <div className="border border-dark">
                <Hotels hotels={this.state.hotels}/>
                </div>
            </React.Fragment>
        )
    }

    showEditOptions = () => {
        if (window.location.pathname === "/account") {
            return(
                <div className="justify-content-between" style={{display:'flex'}}>
                    <h1>Rooms List</h1>
                    <Link to="/addHotel" className="btn btn-primary d-flex align-items-center border-0" style={{marginBottom:'10px'}}>Add Hotel</Link>
                </div>
            )
        } else {
            return(
                <div style={{paddingTop:'100px'}}>
                    <h1>Rooms List</h1>
                </div>
            )
        }
    }

}

export default RoomsList;