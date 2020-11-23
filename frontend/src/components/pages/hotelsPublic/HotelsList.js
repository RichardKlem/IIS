import React, {Component} from 'react'
import axios from "axios";
import Hotels from "./Hotels";
import {Link} from "react-router-dom";
import Sidebar from "../../sidebar/Sidebar";

export class HotelsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isLoadingError: false,
            hotels: [],
            orig_hotels: [],
            /* Filter */
            filter: '',
            start_date: '',
            end_date: '',
            adult_count: '2',
            child_count: "0",
            start_range: 0,
            end_range: 10000,
            standard_room: "true",
            standard_double_room: "1",
            standard_tripple_room: "1",
            business_room: "1",
            deluxe_room: "",
            studio_room: "",
            suite_room: "",
            standard_hotel: "true",
            business_hotel: "true",
            airport_hotel: "true",
            bb_hotel: "true",
            casino_hotel: "true",
            studio_hotel: "true",
            conference_hotel: "true",
            one_s: "true",
            two_s: "true",
            three_s: "true",
            four_s: "true",
            five_s: "true",
            no_prepayment: "false",
            free_cancellation: "false",
            separate_beds: "",
            double_bed: "",
            inc_breakfast: "",
            free_wifi: "false",
            gym: "false",
            spa: "false",
            swimming_pool: "false",
            searched: false,
            status: "",
        }
    }

    componentDidMount() {
        if (window.location.pathname === "/adminHotels") {
            axios.get('/getHotelsAdmin')
                .then(res => {
                        this.setState({hotels: res.data});
                        this.setState({orig_hotels: res.data})
                        this.setState({isLoading: false});
                    }
                ).catch(() => {
                this.setState({status: "ERROR, please reload page", isLoadingError: true})
            });
        } else {
            axios.get('/getHotels')
                .then(res => {
                        this.setState({hotels: res.data});
                        this.setState({orig_hotels: res.data})
                        this.setState({isLoading: false});
                    }
                ).catch(() => {
                this.setState({status: "ERROR, please reload page", isLoadingError: true})
            });
        }
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
                <div className="hotels-list-padding">
                    <h1 className="text-center">Hotels List</h1>
                    {this.showEditOptions()}

                </div>
            );
        }
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});


    searchHotel = async (e) => {
        e.preventDefault();
        let new_hotels;
        new_hotels = []
        for (const hotel of this.state.hotels) {
            let res = await axios.post('/searchHotels', {
                hotel_id: hotel.hotel_id,
                adult_count: this.state.adult_count,
                start_date: this.state.start_date,
                end_date: this.state.end_date
            })
            if (res.data.available === true) {
                if (this.state.filter !== '' && (hotel.name.toUpperCase().includes(this.state.filter.toUpperCase()) || hotel.address.toUpperCase().includes(this.state.filter.toUpperCase()))) {
                    new_hotels.push(hotel)
                } else if (this.state.filter === '') {
                    new_hotels.push(hotel)
                }
                this.setState({searched: true})
            }
        }
        this.setState({hotels: new_hotels});
        this.setState({orig_hotels: new_hotels});
    }


    filterHotel = (e) => {
        e.preventDefault();
        this.setState({
            hotels: [...this.state.orig_hotels]
                .filter(hotel => {
                    if ((this.state.one_s === true || this.state.one_s === "true") && hotel.rating === 1) {
                        return true;
                    } else if ((this.state.two_s === true || this.state.two_s === "true") && hotel.rating === 2) {
                        return true;
                    } else if ((this.state.three_s === true || this.state.three_s === "true") && hotel.rating === 3) {
                        return true;
                    } else if ((this.state.four_s === true || this.state.four_s === "true") && hotel.rating === 4) {
                        return true;
                    } else return (this.state.five_s === true || this.state.five_s === "true") && hotel.rating === 5;
                }).filter(hotel => {
                    if ((this.state.no_prepayment === true || this.state.no_prepayment === "true") && hotel.no_prepayment === 1) {
                        return true;
                    } else return this.state.no_prepayment === false || this.state.no_prepayment === "false";
                }).filter(hotel => {
                    if ((this.state.free_cancellation === true || this.state.free_cancellation === "true") && hotel.free_cancellation === 1) {
                        return true;
                    } else return this.state.free_cancellation === false || this.state.free_cancellation === "false";
                }).filter(hotel => {
                    if ((this.state.standard_hotel === true || this.state.standard_hotel === "true") && hotel.category === 1) {
                        return true;
                    } else if ((this.state.business_hotel === true || this.state.business_hotel === "true") && hotel.category === 2) {
                        return true;
                    } else if ((this.state.airport_hotel === true || this.state.airport_hotel === "true") && hotel.category === 3) {
                        return true;
                    } else if ((this.state.bb_hotel === true || this.state.bb_hotel === "true") && hotel.category === 4) {
                        return true;
                    } else if ((this.state.casino_hotel === true || this.state.casino_hotel === "true") && hotel.category === 5) {
                        return true;
                    } else if ((this.state.studio_hotel === true || this.state.studio_hotel === "true") && hotel.category === 6) {
                        return true;
                    } else return (this.state.conference_hotel === true || this.state.conference_hotel === "true") && hotel.category === 7;
                }).filter(hotel => {
                    if ((this.state.free_wifi === true || this.state.free_wifi === "true") && hotel.free_wifi === 1) {
                        return true;
                    } else return !((this.state.free_wifi === true || this.state.free_wifi === "true") && hotel.free_wifi === 0);
                }).filter(hotel => {
                    if ((this.state.gym === true || this.state.gym === "true") && hotel.gym === 1) {
                        return true;
                    } else return !((this.state.gym === true || this.state.gym === "true") && hotel.gym === 0);
                }).filter(hotel => {
                    if ((this.state.spa === true || this.state.spa === "true") && hotel.spa === 1) {
                        return true;
                    } else return !((this.state.spa === true || this.state.spa === "true") && hotel.spa === 0);
                }).filter(hotel => {
                    if ((this.state.swimming_pool === true || this.state.swimming_pool === "true") && hotel.swimming_pool === 1) {
                        return true;
                    } else return !((this.state.swimming_pool === true || this.state.swimming_pool === "true") && hotel.swimming_pool === 0);
                }).filter(hotel => {
                    return this.state.start_range <= Number(hotel.price_night) && this.state.end_range >= Number(hotel.price_night);
                })
        });
    }

    filterHotelName = () => {
        if (this.state.filter === '') {
            this.setState({hotels: this.state.orig_hotels})
        } else {
            this.setState({
                hotels: [...this.state.hotels]
                    .filter(hotel => hotel.name.toUpperCase().includes(this.state.filter.toUpperCase()))
            });
        }
    }

    onChangeCheckbox = (e) => {
        if (e.target.value === "false") {
            this.setState({[e.target.name]: true});
        } else {
            this.setState({[e.target.name]: false});
        }
    }

    showEditOptions = () => {
        if (window.location.pathname === "/adminHotels") {
            return (
                <div>
                    <div className="d-flex justify-content-between">
                        <div className="table-responsive table-no-border padding-bottom-10">
                            <table className="table table-no-border" id="myTable">
                                <thead className="thead-no-border">
                                <tr className="tr-no-border">
                                    <th className="th-no-border"><input name="filter" defaultValue={this.state.filter}
                                                                        placeholder="Search for hotel"
                                                                        className="input-width text-center form-control"
                                                                        type="text"
                                                                        onChange={this.onChange}
                                                                        onKeyUp={this.filterHotelName}/></th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div className="padding-left-10">
                            <Link to="/addHotel" className="btn btn-primary d-flex add-hotel text-center">Add
                                Hotel</Link>
                        </div>
                    </div>
                    <div className="border border-gray">
                        <Hotels
                            hotels={this.state.hotels}
                            searched={this.state.searched}
                            start_date={this.state.start_date}
                            end_date={this.state.end_date}
                            adult_count={this.state.adult_count}
                            child_count={this.state.child_count}
                            room_count={this.state.room_count}/>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="d-flex">
                    <Sidebar
                        state={this.state}
                        filter={this.state.filter}
                        searchHotel={this.searchHotel}
                        onChangeCheckbox={this.onChangeCheckbox}
                        filterHotel={this.filterHotel}
                        onChange={this.onChange}/>
                    <div className="main-panel border border-gray padding-top-0">
                        <Hotels hotels={this.state.hotels}
                                searched={this.state.searched}
                                start_date={this.state.start_date}
                                end_date={this.state.end_date}
                                adult_count={this.state.adult_count}
                                child_count={this.state.child_count}
                                room_count={this.state.room_count}/>
                    </div>
                </div>
            )
        }
    }

}

export default HotelsList;