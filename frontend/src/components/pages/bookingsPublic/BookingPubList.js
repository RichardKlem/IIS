import React, {Component} from 'react';
import BookingPublic from "./BookingPublic";
import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class BookingPubList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            bookings: [],
        }
    }

    componentDidMount() {
        const cookieUserID = cookies.get('CookieUserID');
        if (typeof (cookieUserID) === "undefined") {
            this.props.history.push('/login');
        } else {
            if (window.location.pathname === "/bookings") {
                axios.post('/getBookings', {CookieUserID: cookieUserID})
                    .then(res => {
                            this.setState({bookings: res.data});
                            this.setState({isLoading: false})
                        }
                    );
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
                <div className="hotels-list-padding">
                    <h1 className="text-center">Bookings List</h1>
                    <div className="border">
                        <BookingPublic
                            bookings={this.state.bookings}/>
                    </div>
                </div>
            );
        }
    }
}

export default BookingPubList;
