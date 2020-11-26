import React, {Component} from 'react'
import {Form} from 'react-bootstrap';
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';
import axios from "axios";
import {Link} from "react-router-dom";


export class HotelListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            image: undefined,
        }
    }

    componentDidMount() {
        axios.post('/getHotelImage', {hotel_id: this.props.hotel.hotel_id})
            .then(res => {
                    this.setState({image: res.data});
                    this.setState({isLoading: false})
                }
            );
    }

    removeHotel = () => {
        axios.post('/removeHotel', {hotel_id: this.props.hotel.hotel_id})
            .then((res) => {
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
                <div className="card padding-10 card-width-700">
                    <div className="border d-flex">
                        <div className="item-list-style">
                            <Link to={{
                                pathname: `/hotel/${this.props.hotel.hotel_id}`,
                                searchProps: {
                                    hotel_id: this.props.hotel.hotel_id,
                                    start_date: this.props.start_date,
                                    end_date: this.props.end_date,
                                    adult_count: this.props.adult_count,
                                    child_count: this.props.child_count,
                                    room_count: this.props.room_count,
                                }
                            }}>
                                <img className="item-list-style-img" src={`data:image/*;base64,${this.state.image}`}
                                     alt="hotel"/>
                            </Link>
                        </div>
                        <div className="card-body">
                            <div className="d-flex">
                                <Link to={{
                                    pathname: `/hotel/${this.props.hotel.hotel_id}`,
                                    searchProps: {
                                        hotel_id: this.props.hotel.hotel_id,
                                        start_date: this.props.start_date,
                                        end_date: this.props.end_date,
                                        adult_count: this.props.adult_count,
                                        child_count: this.props.child_count,
                                        room_count: this.props.room_count,
                                    }
                                }}>
                                    <h3>{this.props.hotel.name}</h3>
                                </Link>
                                <div className="rating-padding">
                                    <StarRatings
                                        rating={this.props.hotel.rating}
                                        starDimension="20px"
                                        starSpacing="2px"
                                    />
                                </div>
                                <div className="width-auto padding-bottom-10 margin-top-5-neg">
                                    <select name="category"
                                            value={this.props.hotel.category}
                                            className="form-control select-disabled white-textarea"
                                            disabled>
                                        <option value="1">Standard Hotel</option>
                                        <option value="2">Business Hotel</option>
                                        <option value="3">Airport Hotel</option>
                                        <option value="4">B&B</option>
                                        <option value="5">Casino Hotel</option>
                                        <option value="6">Studio</option>
                                        <option value="7">Conference Hotel</option>
                                    </select>
                                </div>
                            </div>
                            <form>
                                <Form.Group>
                                    <p>{this.props.hotel.address}</p>
                                    <textarea value={this.props.hotel.description}
                                              className="form-control white-textarea" rows="4"
                                              readOnly>{this.props.hotel.description}</textarea>
                                </Form.Group>

                                <div className="d-flex justify-content-between">
                                    {this.getHotelInfo()}
                                    {this.setUrl()}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    };

    getHotelInfo() {
        if (window.location.pathname === "/") {
            return <div className="line-height-2">
                <p className="color-green">{this.props.hotel.no_prepayment === 1 ? "Offers rooms with no pre-payment" : ""}</p>
                <p className="color-green">{this.props.hotel.free_cancellation === 1 ? "Offers rooms with free cancellation" : ""}</p>
                <p>{this.props.searched !== false ? "Prices from:" + this.props.hotel.price_night + "Kč" : ""}</p>
            </div>;
        }
    }

    setUrl() {
        if (window.location.pathname === "/") {
            if (this.props.searched === false) {
                return (
                    <button className="align-self-center btn btn-primary btn-danger" disabled>Search to see
                        rooms</button>
                )
            } else {
                return (<Link
                    to={{
                        pathname: `/hotel/${this.props.hotel.hotel_id}`,
                        searchProps: {
                            hotel_id: this.props.hotel.hotel_id,
                            start_date: this.props.start_date,
                            end_date: this.props.end_date,
                            adult_count: this.props.adult_count,
                            child_count: this.props.child_count,
                            room_count: this.props.room_count,
                        }
                    }
                    }
                    className="align-self-center btn btn-primary">See Rooms</Link>)
            }
        } else {
            return (
                <div className="d-flex">
                    <Link to={{
                        pathname: `/editHotel/${this.props.hotel.hotel_id}`,
                        query: {hotel_id: this.props.hotel.hotel_id}
                    }} className="btn btn-block btn-primary">Edit Hotel</Link>
                    <div className="padding-10"/>
                    <button className="btn btn-block btn-danger" onClick={this.removeHotel}>Remove</button>
                </div>
            )
        }
    }
}

HotelListItem.propTypes = {
    hotel: PropTypes.object.isRequired,
}


export default HotelListItem;

