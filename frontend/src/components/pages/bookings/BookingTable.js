import React, {Component} from 'react';
import Booking from "./Booking";
import axios from "axios";
import Cookies from 'universal-cookie';
import moment from "moment";

const cookies = new Cookies();

class BookingTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            bookings: [],
            orig_bookings: []
        }
    }

    componentDidMount() {
        const cookieUserID = cookies.get('CookieUserID');
        if (typeof (cookieUserID) !== "undefined") {
            if (window.location.pathname === "/bookings") {
                axios.post('/getBookings', {CookieUserID: cookieUserID})
                    .then(res => {
                            this.setState({bookings: res.data});
                            this.setState({orig_hotels: res.data})
                            this.setState({isLoading: false})
                        }
                    );
            } else if (window.location.pathname === "/adminBookings") {
                axios.post('/getAllBookings', {CookieUserID: cookieUserID})
                    .then(res => {

                            this.setState({bookings: res.data});
                            this.setState({orig_hotels: res.data})
                            this.setState({isLoading: false})
                        }
                    );
            }
        }
    }

    filterTableColumnFunction = () => {
        let rowWasHidden = false;
        const keys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
        for (let key of keys) {
            let input, filter, table, tr, td, i, txtValue;
            input = document.getElementById(key);
            if (input === null) {
                return
            }
            filter = input.value.toUpperCase();
            table = document.getElementById("bookingTable");
            tr = table.getElementsByTagName("tr");

            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[key];
                if (typeof (td) !== 'undefined') {
                    td = td.getElementsByTagName("input")[0];
                    if (td) {
                        txtValue = td.value;
                        if (txtValue.toUpperCase().indexOf(filter) > -1 && (tr[i].style.display !== "none" || rowWasHidden === false)) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                            rowWasHidden = true;
                        }
                    }
                }
            }
        }
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
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title">Bookings</h2>
                            <h4 className="card-description"> Bookings table:</h4>
                            <div className="table-responsive">
                                <table className="table table-hover" id="bookingTable">
                                    <thead>
                                    <tr>
                                        <th>
                                            <div className="padding-bottom-5">
                                                Reservation ID
                                            </div>
                                            <input
                                                className="input-width text-center form-control form-control-sm"
                                                type="text" id="0"
                                                onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>
                                            <div className="padding-bottom-5">
                                                Name
                                            </div>
                                            <input
                                                className="input-width text-center form-control form-control-sm"
                                                type="text"
                                                id="1" onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>
                                            <div className="padding-bottom-5">
                                                Tel
                                            </div>
                                            <input
                                                className="input-width text-center form-control form-control-sm"
                                                type="tel"
                                                pattern="[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}" id="2"
                                                onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>
                                            <div className="padding-bottom-5">
                                                Email
                                            </div>
                                            <input
                                                className="input-width text-center form-control form-control-sm"
                                                type="email" id="3" onKeyUp={this.filterTableColumnFunction}/>
                                        </th>
                                        <th>
                                            <div className="padding-bottom-5">
                                                Birth Date
                                            </div>
                                            <input
                                                className="input-width text-center form-control form-control-sm"
                                                type="date" id="4"
                                                max={moment().add(-18, "year").format("YYYY-MM-DD")}
                                                min={moment().format("1900-01-01")}
                                                onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>
                                            <div className="padding-bottom-5">
                                                Address
                                            </div>
                                            <input
                                                className="input-width text-center form-control form-control-sm"
                                                type="text" id="5" onKeyUp={this.filterTableColumnFunction}/>
                                        </th>
                                        <th>
                                            <div className="padding-bottom-5">
                                                Hotel Name
                                            </div>
                                            <input
                                                className="input-width text-center form-control form-control-sm"
                                                type="text" id="6"
                                                onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>
                                            <div className="padding-bottom-5">
                                                Room Name
                                            </div>
                                            <input
                                                className="input-width text-center form-control form-control-sm"
                                                type="text" id="7"
                                                onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>
                                            <div className="padding-bottom-5">
                                                Start Date
                                            </div>
                                            <input
                                                className="input-width text-center form-control form-control-sm"
                                                type="date" id="8"
                                                onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>
                                            <div className="padding-bottom-5">
                                                End Date
                                            </div>
                                            <input
                                                className="input-width text-center form-control form-control-sm"
                                                type="date" id="9" onKeyUp={this.filterTableColumnFunction}/>
                                        </th>
                                        <th>
                                            <div className="padding-bottom-5">
                                                Total price
                                            </div>
                                            <input
                                                className="input-width text-center form-control form-control-sm"
                                                type="number" id="10"
                                                onKeyUp={this.filterTableColumnFunction}/>
                                        </th>
                                        <th>
                                            <div className="padding-bottom-5">
                                                Paid price
                                            </div>
                                            <input
                                                className="input-width text-center form-control form-control-sm"
                                                type="number" id="11"
                                                onKeyUp={this.filterTableColumnFunction}/>
                                        </th>
                                        <th className="input-width" style={{paddingBottom:"45px"}}>Approved</th>
                                        <th className="input-width" style={{paddingBottom:"45px"}}>Check-In</th>
                                        <th style={{paddingBottom:"45px", minWidth: "120px"}}>Check-Out</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <Booking bookings={this.state.bookings}/>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default BookingTable;
