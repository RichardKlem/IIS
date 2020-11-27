import React, {Component} from 'react';
import BookingPublic from "./BookingPublic";
import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let cookieUserID = cookies.get('CookieUserID');

class BookingPubList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isLoadingError: false,
            bookings: [],
        }
    }

    componentDidMount() {
        cookieUserID = cookies.get('CookieUserID');
        if (typeof (cookieUserID) === "undefined") {
            this.props.history.push('/login');
        } else {
            if (window.location.pathname === "/bookings") {
                axios.post('/getBookings', {CookieUserID: cookieUserID})
                    .then(res => {
                            this.setState({bookings: res.data});
                            this.setState({isLoading: false})
                        }
                    ).catch(() => {
                    this.setState({status: "ERROR, please reload page", isLoadingError: true})
                });
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        cookieUserID = cookies.get('CookieUserID');
        if (typeof (cookieUserID) === "undefined") {
            this.props.history.push('/login');
        }
    }


    render() {
        if (this.state.isLoadingError) {
            return (
                <div className="App">ERROR, please log-out and log-in</div>
            );
        } else if (this.state.isLoading) {
            return (
                <div className="App">Loading...</div>
            );
        } else {
            return (
                <div className="hotels-list-padding">
                    <h1 className="text-center padding-bottom-10">My Bookings</h1>
                    <div>
                        {this.state.bookings.length === 0 ? "No bookings" :
                        <BookingPublic
                            bookings={this.state.bookings}/>}
                    </div>
                </div>
            );
        }
    }
}

export default BookingPubList;
