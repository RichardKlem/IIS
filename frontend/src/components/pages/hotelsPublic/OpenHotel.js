import React, {Component} from 'react'
import axios from "axios";
import Cookies from "universal-cookie";
import RoomsList from "../roomsPublic/RoomsList";
import StarRatings from "react-star-ratings";

const cookies = new Cookies();
const cookieUserID = cookies.get('CookieUserID');

export class OpenHotel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            /* User data */
            name: undefined,
            address: undefined,
            description: "",
            phone_number: undefined,
            email: undefined,
            category: undefined,
            rating: undefined,
            hotel_id: undefined,
            free_cancellation: true,
            no_prepayment: true,
            free_wifi: true,
            gym: true,
            spa: true,
            swimming_pool: true,
            /* File upload variables */
            image: undefined,
            newImageWasUploaded: false,
            fileUploadErrMsg: undefined,
            hotelUploadAvailable: true,
            selectedFile: null,
            /* Status */
            status: "",
            /* User */
            role: 5,
        }
    }

    componentDidMount() {
        const id = window.location.pathname.replace("/hotel/", "");
        this.setState({hotel_id: id})
        if (typeof (cookieUserID) !== "undefined") {
            axios.post('/getUserRole', {CookieUserID: cookieUserID})
                .then(res => {
                    this.setState({role: res.data.role});
                });
        }

        axios.post('/getHotel', {hotel_id: id})
            .then((res) => {
                this.setState({
                    name: res.data.name,
                    address: res.data.address,
                    description: res.data.description,
                    phone_number: res.data.phone_number,
                    email: res.data.email,
                    category: res.data.category,
                    rating: res.data.rating,
                    free_cancellation: res.data.free_cancellation ? "true" : "false",
                    no_prepayment: res.data.no_prepayment ? "true" : "false",
                    free_wifi: res.data.free_wifi ? "true" : "false",
                    gym: res.data.gym ? "true" : "false",
                    spa: res.data.spa ? "true" : "false",
                    swimming_pool: res.data.swimming_pool ? "true" : "false"
                });
            });
        axios.post('/getHotelImage', {hotel_id: id})
            .then(res => {
                this.setState({image: res.data});
                this.setState({isLoading: false});
            });

    }

    render() {
        const {isLoading} = this.state;
        if (isLoading) {
            return (
                <div className="App">Loading...</div>
            );
        } else {
            return (
                <div className="d-flex align-items-center auth px-0 hotels-list-padding">
                    <div className="w-100 mx-0">
                        <div>
                            <div className="auth-form-light py-5 px-4 px-sm-5 border">
                                <div className="border">
                                    <div className="d-flex padding-left-10 padding-top-10">
                                        <h2>{this.state.name}</h2>
                                        <div className="rating-padding padding-top-5">
                                            <StarRatings
                                                rating={this.state.rating}
                                                starRatedColor="#FFD700"
                                                starDimension="20px"
                                                starSpacing="2px"
                                            />
                                        </div>
                                        <div className="width-auto">
                                            <select
                                                name="category" value={this.state.category}
                                                className="form-control select-disabled white-textarea" disabled>
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
                                    <div className="d-flex">
                                        <div className="padding-left-10 padding-right-10">
                                            <img className="item-list-style-img-200"
                                                 src={`data:image/*;base64,${this.state.image}`} alt=''/>
                                        </div>
                                        <div>
                                            <p className="font-weight-light">{this.state.address}</p>
                                            <p className="font-weight-light">{this.state.phone_number}</p>
                                            <p className="font-weight-light">{this.state.email}</p>
                                            <p className="font-weight-light">{this.state.description}</p>
                                            <div className="padding-bottom-20">
                                                <div className="form-group padding-bottom-20">
                                                    Offers:
                                                </div>
                                                <div className="other-input d-flex">
                                                    <div className="form-check padding-right-10">
                                                        <label className="form-check-label">
                                                            <input disabled="disabled" className="checkmark"
                                                                   name="no_prepayment"
                                                                   checked={this.state.no_prepayment === "true" ? true : null}
                                                                   value={this.state.no_prepayment} type="checkbox"/>
                                                            <span className="checkmark"> </span>
                                                            No prepayment
                                                        </label>
                                                    </div>
                                                    <div className="form-check padding-right-10">
                                                        <label className="form-check-label">
                                                            <input disabled="disabled" className="checkmark"
                                                                   name="free_cancellation"
                                                                   checked={this.state.free_cancellation === "true" ? true : null}
                                                                   value={this.state.free_cancellation}
                                                                   type="checkbox"/>
                                                            <span className="checkmark"> </span>
                                                            Free cancellation
                                                        </label>
                                                    </div>
                                                    <div className="form-check padding-right-10">
                                                        <label className="form-check-label">
                                                            <input disabled="disabled" className="checkmark"
                                                                   name="free_wifi"
                                                                   checked={this.state.free_wifi === "true" ? true : null}
                                                                   value={this.state.free_wifi} type="checkbox"/>
                                                            <span className="checkmark"> </span>
                                                            Free wifi
                                                        </label>
                                                    </div>
                                                    <div className="form-check padding-right-10">
                                                        <label className="form-check-label">
                                                            <input disabled="disabled" className="checkmark"
                                                                   name="spa"
                                                                   checked={this.state.spa === "true" ? true : null}
                                                                   value={this.state.spa} type="checkbox"/>
                                                            <span className="checkmark"> </span>
                                                            SPA
                                                        </label>
                                                    </div>
                                                    <div className="form-check padding-right-10">
                                                        <label className="form-check-label">
                                                            <input disabled="disabled" className="checkmark"
                                                                   name="gym"
                                                                   checked={this.state.gym === "true" ? true : null}
                                                                   value={this.state.gym} type="checkbox"/>
                                                            <span className="checkmark"> </span>
                                                            Gym
                                                        </label>
                                                    </div>
                                                    <div className="form-check padding-right-10">
                                                        <label className="form-check-label">
                                                            <input disabled="disabled" className="checkmark"
                                                                   name="swimming_pool"
                                                                   checked={this.state.swimming_pool === "true" ? true : null}
                                                                   value={this.state.swimming_pool} type="checkbox"/>
                                                            <span className="checkmark"> </span>
                                                            Swimming Pool
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center mt-4 font-weight-bold">
                                            {this.state.status}
                                        </div>
                                    </div>
                                </div>
                                {this.getRoomsList()}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    getRoomsList = () => {
        if (typeof (this.props.location.searchProps) !== "undefined") {
            return (<RoomsList hotel_id={this.state.hotel_id}
                               start_date={this.props.location.searchProps.start_date}
                               end_date={this.props.location.searchProps.end_date}
                               adult_count={this.props.location.searchProps.adult_count}
                               child_count={this.props.location.searchProps.child_count}
                               room_count={this.props.location.searchProps.room_count}/>)
        } else {
            return (<RoomsList hotel_id={this.state.hotel_id}
                               start_date={undefined}
                               end_date={undefined}
                               adult_count={"2"}
                               child_count={"0"}
                               room_count={"1"}/>)
        }

    }

}

export default OpenHotel
