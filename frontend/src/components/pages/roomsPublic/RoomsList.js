import React, {Component} from 'react'
import axios from "axios";
import {Link} from "react-router-dom";
import Rooms from "./Rooms";
import PropTypes from "prop-types";
import moment from "moment";

export class RoomsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isLoadingError: false,
            no_prepayment: 0,
            hotel_id: undefined,
            rooms: [],
            /* Date */
            start_date: this.props.start_date !== undefined ? this.props.start_date : moment().format("YYYY-MM-DD"),
            end_date: this.props.end_date !== undefined ? this.props.end_date : moment().add(1, "day").format("YYYY-MM-DD"),
            adult_count: this.props.adult_count,
            child_count: "0",
            room_count: this.props.room_count,
        }
    }

    componentDidMount() {
        let url = '/getHotelRooms';
        if (window.location.pathname.startsWith("/editHotel/")) {
            url = '/getHotelRoomsAdmin';
        }
        axios.post(url, {hotel_id: this.props.hotel_id})
            .then(res => {
                    this.setState({rooms: res.data});
                    this.setState({hotel_id: this.props.hotel_id})
                    this.setState({isLoading: false});
                }
            ).catch(() => {
            this.setState({status: "ERROR, please reload page", isLoadingError: true})
        });
    }

    render() {
        const {isLoading} = this.state;
        if (isLoading) {
            return (
                <div className="App">Loading...</div>
            );
        } else if (this.state.isLoadingError) {
            return (
                <div className="App">ERROR, please log-out and log-in</div>
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
                    <div className="justify-content-between d-flex padding-top-40">
                        <h1>Rooms List</h1>
                        <Link to={"/addRoom/" + this.state.hotel_id}
                              className="btn btn-primary d-flex align-items-center border-0 margin-bottom-10"
                        >Add Room</Link>
                    </div>
                    <div className="border border-gray">
                        {this.state.rooms.length > 0 ? <Rooms rooms={this.state.rooms} hotel_id={this.state.hotel_id}
                                                              start_date={this.state.start_date}
                                                              end_date={this.state.end_date}/> : ""}
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className="hotels-list-padding">
                        <h1>Rooms List</h1>
                        <div className="rooms-list">
                            <div>
                                Start Date<input name="start_date" value={this.state.start_date}
                                                 placeholder="Start date"
                                                 className="width-calc-100 text-center form-control form-control-sm"
                                                 type="date" id="1"
                                                 min={moment().format("YYYY-MM-DD")}
                                                 onChange={this.onChange} required/>
                            </div>
                            <div>
                                End Date<input name="end_date"
                                               value={moment(this.state.end_date) <= moment(this.state.start_date) ? "" : this.state.end_date}
                                               placeholder="End date"
                                               className="width-calc-100 text-center form-control form-control-sm"
                                               type="date" id="2"
                                               max={this.state.start_date !== "" ?
                                                   moment(this.state.start_date).add(1, "day").add(1, "year").format("YYYY-MM-DD")
                                                   : moment().add(1, "year").format("YYYY-MM-DD")}
                                               min={this.state.start_date !== "" ?
                                                   moment(this.state.start_date).add(1, "day").format("YYYY-MM-DD")
                                                   : moment().add(1, "day").format("YYYY-MM-DD")}
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
                    <div className="border border-gray ">
                        {this.state.rooms.length > 0 ? <Rooms rooms={this.state.rooms} hotel_id={this.state.hotel_id}
                                                              start_date={this.state.start_date}
                                                              end_date={this.state.end_date}
                                                              adult_count={this.state.adult_count}
                                                              child_count={this.state.child_count}/> : ""}
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