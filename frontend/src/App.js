import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import Header from './components/layout/Header.js';
import Account from './components/pages/account/Account.js';
import LoginPage from './components/pages/loginRegPage/LoginPage.js';
import RegistrationPage from './components/pages/loginRegPage/RegistrationPage.js';
import AddHotel from "./components/pages/hotelsAdmin/AddHotel";
import EditHotel from "./components/pages/hotelsPublic/EditHotel";
import HotelsList from "./components/pages/hotelsPublic/HotelsList";
import EditRoom from "./components/pages/roomsPublic/EditRoom";
import AddRoom from "./components/pages/roomsAdmin/AddRoom";
import BookingTable from "./components/pages/bookings/BookingTable";
import OpenHotel from "./components/pages/hotelsPublic/OpenHotel";
import OpenRoom from "./components/pages/roomsPublic/OpenRoom";
import BookingPubList from "./components/pages/bookingsPublic/BookingPubList";
import UsersListPage from "./components/pages/usersTable/UsersListPage";

class App extends Component {

    render() {
        return (
            <Router>
                <div className="App">
                    <div className="container">
                        <Header/>
                        <Switch>
                            <Route exact path="/" component={HotelsList}/>
                            <Route exact path="/login" component={LoginPage}/>
                            <Route exact path="/registration" component={RegistrationPage}/>
                            <Route exact path="/account" component={Account}/>
                            <Route exact path="/admin" component={UsersListPage}/>
                            <Route exact path="/adminHotels" component={HotelsList}/>
                            <Route exact path="/adminBookings" component={BookingTable}/>
                            <Route exact path="/addHotel" component={AddHotel}/>
                            <Route exact path="/editHotel/:id" component={EditHotel}/>
                            <Route exact path="/hotel/:id" component={OpenHotel}/>
                            <Route exact path="/addRoom/:id" component={AddRoom}/>
                            <Route exact path="/editRoom/:id" component={EditRoom}/>
                            <Route exact path="/room/:id" component={OpenRoom}/>
                            <Route exact path="/bookings" component={BookingPubList}/>
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
