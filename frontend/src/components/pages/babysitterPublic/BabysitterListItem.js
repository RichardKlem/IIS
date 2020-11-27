import React, {Component} from 'react'
import {Form} from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from "axios";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";


export class BabysitterListItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isAvailable: true,
            isBooked: false,
            image: null,
            id_babysitter: undefined
        }
    }

    componentDidMount() {
        axios.post('/getBabysitterImg', {id_babysitter: this.props.babysitter.id_babysitter})
            .then(res => {
                    this.setState({image: res.data});
                    if (window.location.pathname.startsWith("/babysitters")) {
                        this.checkAvailability();
                    }
                    this.setState({isLoading: false})
                }
            );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.start_date !== this.props.start_date || prevProps.end_date !== this.props.end_date ||
            prevProps.start_time !== this.props.start_time || prevProps.end_time !== this.props.end_time) {
            this.checkAvailability();
        }
    }


    render() {
        if (this.state.isBooked === true) {
            return <div className="App">
                Booked successfully,
                <Redirect to={"/bookings"}/>
            </div>;
        }
        if (this.state.isLoading === true) {
            return <div className="App">Loading...</div>;
        } else {
            if (this.state.isAvailable === false) {
                return <div>Not available</div>;
            } else {
                return (
                    <div className="card padding-10">
                        <div className="border border-light d-flex">
                            <div className="item-list-style-round">
                                <img src={`data:image/*;base64,${this.state.image}`} alt="babysitter"
                                     className="item-list-style-img img-xl"/>
                            </div>
                            <div className="card-body">
                                <div className="d-flex padding-top-10">
                                    <h3>{this.props.babysitter.name}</h3>
                                </div>
                                <form>
                                    <Form.Group>
                                        <textarea value={this.props.babysitter.description}
                                                  className="form-control white-textarea" rows="4"
                                                  readOnly>{this.state.description}</textarea>
                                    </Form.Group>
                                    <div className="d-flex justify-content-between">
                                        <div className="line-height-sm">
                                            <p>{(this.props.start_date !== "" && this.props.end_date !== "") ? "Price per hour: " + this.props.babysitter.price_hour + "Kč" : ""}</p>
                                        </div>
                                        {this.setUrl()}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    };

    setUrl() {
        if (window.location.pathname === "/babysitters") {
            if (this.calculateHours() < 1) {
                return (
                    <button className="align-self-center btn btn-primary btn-danger" disabled>Please select VALID dates
                        and times</button>)
            } else if (this.calculateHours() > 24) {
                return (
                    <button className="align-self-center btn btn-primary btn-danger" disabled>Maximum babysitting time
                        (24 Hours) exceeded</button>)
            } else if (this.props.start_date === "" || this.props.start_time === "" ||
                this.props.end_date === "" || this.props.end_time === "") {
                return (
                    <button className="align-self-center btn btn-primary btn-warning" disabled>Please choose dates and
                        times</button>)
            } else {
                return (
                    <button className="align-self-center btn btn-primary" onClick={this.reserveBabysitter}>Reserve
                        babysitter for {this.calculateHours()} hour(s) for {this.calculatePrice()} </button>)
            }

        } else {
            return (
                <div className="d-flex">
                    <Link to={{
                        pathname: `/editBabysitter/${this.props.babysitter.id_babysitter}`,
                        query: {id_babysitter: this.props.babysitter.id_babysitter}
                    }} className="btn btn-block btn-primary">Edit Babysitter</Link>
                    <div className="padding-10"/>
                    {this.getButton()}
                </div>
            )
        }
    }


    getButton() {
        if (this.props.babysitter.isReserved === true) {
            return <button className="btn btn-block bg-transparent disabled border" disabled>This babysitter is reserved and cannot be removed.</button>;
        } else {
            return <button className="btn btn-block btn-danger" onClick={this.removeBabysitter}>Remove</button>;
        }
    }

    calculatePrice() {
        const hours = this.calculateHours();
        const price = hours * this.props.babysitter.price_hour;
        return price.toString() + "Kč";
    }


    calculateHours() {
        const start_date = new Date(this.props.start_date + " " + this.props.start_time);
        const end_date = new Date(this.props.end_date + " " + this.props.end_time);
        return Math.ceil((end_date.getTime() - start_date.getTime()) / (100000 * 36))
    }

    checkAvailability() {
        if (window.location.pathname.startsWith("/babysitters") && (this.props.room_count !== 0 || this.props.room_count !== undefined)) {
            axios.post('/checkDatesBabysitters', {
                id_babysitter: this.props.babysitter.id_babysitter,
                start_date: this.props.start_date + " " + this.props.start_time + ":00",
                end_date: this.props.end_date + " " + this.props.end_date + ":00",
            })
                .then(res => {
                    this.setState({isAvailable: res.data.available})
                });
        }
    }

    removeBabysitter = () => {
        axios.post('/removeBabysitter', {id_babysitter: this.props.babysitter.id_babysitter})
            .then((res) => {
                }
            );
    }

    reserveBabysitter = (e) => {
        e.preventDefault();
        if (this.props.id_reservation !== "") {
            axios.post('/bookBabysitter',
                {
                    babysitter: this.props.babysitter.id_babysitter,
                    reservation: this.props.id_reservation,
                    start_date: this.props.start_date + " " + this.props.start_time + ":00",
                    end_date: this.props.end_date + " " + this.props.end_time + ":00",
                    total_price: this.calculateHours() * this.props.babysitter.price_hour,
                }
            ).then(res => {
                this.setState({isBooked: true})
            });
        }
    }
}

BabysitterListItem.propTypes = {
    babysitter: PropTypes.object.isRequired,
}


export default BabysitterListItem;

