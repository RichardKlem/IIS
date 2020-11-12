import React, {Component} from 'react';
import BookingPublic from "./BookingPublic";
import axios from "axios";
import Cookies from 'universal-cookie';

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
            // Declare variables
            let input, filter, table, tr, td, i, txtValue;
            input = document.getElementById(key);
            if (input === null) {
                return
            }
            filter = input.value.toUpperCase();
            table = document.getElementById("myTable");
            tr = table.getElementsByTagName("tr");

            // Loop through all table rows, and hide those who don't match the search query
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
                                        <th>Reservation ID<input style={{minWidth: '100px', maxWidth: 'auto/5'}}
                                                                 className="text-center form-control form-control-sm"
                                                                 type="text" id="0"
                                                                 onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Name<input style={{width: 'auto'}}
                                                       className="text-center form-control form-control-sm" type="text"
                                                       id="1" onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Tel<input style={{width: 'auto'}}
                                                      className="text-center form-control form-control-sm" type="tel"
                                                      pattern="[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}" id="2"
                                                      onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Email<input style={{width: 'auto'}}
                                                        className="text-center form-control form-control-sm"
                                                        type="email" id="3" onKeyUp={this.filterTableColumnFunction}/>
                                        </th>
                                        <th>Birth Date<input style={{width: 'auto'}}
                                                             className="text-center form-control form-control-sm"
                                                             type="date" id="4"
                                                             onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Address<input style={{width: 'auto'}}
                                                          className="text-center form-control form-control-sm"
                                                          type="text" id="5" onKeyUp={this.filterTableColumnFunction}/>
                                        </th>
                                        <th>Hotel Name<input style={{minWidth: '40px', maxWidth: 'auto/5'}}
                                                             className="text-center form-control form-control-sm"
                                                             type="text" id="6"
                                                             onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Room Name<input style={{minWidth: '40px', maxWidth: 'auto/5'}}
                                                            className="text-center form-control form-control-sm"
                                                            type="text" id="7"
                                                            onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Start Date<input style={{minWidth: '40px', maxWidth: 'auto/5'}}
                                                             className="text-center form-control form-control-sm"
                                                             type="date" id="8"
                                                             onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>End Date<input style={{minWidth: '40px', maxWidth: 'auto/5'}}
                                                           className="text-center form-control form-control-sm"
                                                           type="date" id="9" onKeyUp={this.filterTableColumnFunction}/>
                                        </th>
                                        <th>Check-In<input style={{width: 'auto'}}
                                                           className="text-center form-control form-control-sm"
                                                           type="checkbox" id="10"
                                                           onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Check-Out<input style={{width: 'auto'}}
                                                            className="text-center form-control form-control-sm"
                                                            type="checkbox" id="11"
                                                            onKeyUp={this.filterTableColumnFunction}/></th>
                                        <th>Submit<input style={{width: 'auto'}}
                                                         className="text-center form-control form-control-sm"
                                                         type="text" id="12" readOnly/></th>
                                        <th>Status<input style={{width: 'auto'}}
                                                         className="text-center form-control form-control-sm"
                                                         type="text" id="13" readOnly/></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <BookingPublic bookings={this.state.bookings}/>
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
