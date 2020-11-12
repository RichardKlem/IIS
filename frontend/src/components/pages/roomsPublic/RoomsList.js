import React, {Component} from 'react'
import axios from "axios";
import {Link} from "react-router-dom";
import Rooms from "./Rooms";
import PropTypes from "prop-types";

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1)

export class RoomsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            no_prepayment: 0,
            hotel_id: undefined,
            rooms: [],
            /* Date */
            start_date: this.props.start_date !== undefined ? this.props.start_date : today.toISOString().substring(0, 10),
            end_date: this.props.end_date !== undefined ? this.props.end_date : tomorrow.toISOString().substring(0, 10),
            adult_count: this.props.adult_count,
            child_count: "0",
            room_count: this.props.room_count,
        }
    }

    componentDidMount() {
        axios.post('/getHotelRooms', {hotel_id: this.props.hotel_id})
            .then(res => {
                    this.setState({rooms: res.data});
                    this.setState({hotel_id: this.props.hotel_id})
                    this.setState({isLoading: false});
                }
            );
    }

    render() {
        const {isLoading} = this.state;
        if (isLoading) {
            return (
                <div className="App">Loading...</div>
            );
        } else {
            return (
                <div>
                    {this.showEditOptions()}
                </div>
            )
        }
    }

    showEditOptions = () => {
        if (window.location.pathname.startsWith("/editHotel")) {
            return (
                <>
                    <div className="justify-content-between" style={{display: 'flex'}}>
                        <h1>Rooms List</h1>
                        <Link to={"/addRoom/" + this.state.hotel_id}
                              className="btn btn-primary d-flex align-items-center border-0"
                              style={{marginBottom: '10px'}}>Add Room</Link>
                    </div>
                    <div className="border border-dark">
                        <Rooms rooms={this.state.rooms} hotel_id={this.state.hotel_id}
                               start_date={this.state.start_date} end_date={this.state.end_date}/>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div style={{paddingTop: '100px'}}>
                        <h1>Rooms List</h1>
                        <div className="" style={{paddingBottom: "10px", whiteSpace: "nowrap"}}>
                            <div>
                                Start Date<input name="start_date" defaultValue={this.state.start_date}
                                                 style={{minWidth: '100px', maxWidth: 'auto/5'}}
                                                 placeholder="Start date"
                                                 className="text-center form-control form-control-sm" type="date" id="1"
                                                 onChange={this.onChange} required/>
                            </div>
                            <div>
                                End Date<input name="end_date" defaultValue={this.state.end_date}
                                               style={{minWidth: '100px', maxWidth: 'auto/5'}} placeholder="End date"
                                               className="text-center form-control form-control-sm" type="date" id="2"
                                               onChange={this.onChange} required/>
                            </div>
                            <div>
                                Adults<input name="adult_count" defaultValue={this.state.adult_count}
                                             placeholder="Adults count"
                                             className="text-center form-control form-control-sm"
                                             type="number" min="1" max="10" onChange={this.onChange} required/>
                            </div>
                        </div>
                    </div>
                    <div className="border border-dark ">
                        <Rooms rooms={this.state.rooms} hotel_id={this.state.hotel_id}
                               start_date={this.state.start_date} end_date={this.state.end_date}
                               adult_count={this.state.adult_count} child_count={this.state.child_count}/>
                    </div>
                </>
            )
        }
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});
}

RoomsList.propTypes = {
    hotel_id: PropTypes.string.isRequired,
}


export default RoomsList;