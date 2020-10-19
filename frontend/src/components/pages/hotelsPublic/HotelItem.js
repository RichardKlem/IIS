import React, { Component } from 'react'
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';
import axios from "axios";
import {Link} from "react-router-dom";

export class HotelItem extends Component {
    state = {
        image : null
    }
    componentDidMount() {
        axios.post('/getHotelImage', {hotel_id: this.props.hotel.hotel_id})
            .then(res => {
                    this.setState({image : res.data});
                }
            );
    }

    render() {
        return (
            <div className="card">
                <div style={{display:'flex'}}>
                    <div style={{display:'block', margin:'auto', marginLeft:'20px'}}>
                <img src={`data:image/*;base64,${this.state.image}`} alt="hotel" style={{ width:'200px', height:'200px'}}/>
                    </div>
                <div className="card-body">
                    <h3>{this.props.hotel.name}</h3>
                    <form className="forms-sample">
                        <Form.Group>
                            <StarRatings
                                rating={this.props.hotel.rating}
                                starDimension="20px"
                                starSpacing="2px"
                            />

                            <p>{this.props.hotel.address}</p>
                            <textarea value={this.props.hotel.description} className="form-control" rows="4" readOnly>{this.props.hotel.description}</textarea>
                        </Form.Group>
                        <Link to={{pathname:`/hotel/${this.props.hotel.hotel_id}`, query: { hotel_id: this.props.hotel.hotel_id }}} className="btn btn-primary mr-2" onClick={this.openHotelEditPage}>See Rooms</Link>
                    </form>
                </div>
                </div>
                <hr style={{borderTop: '3px solid #bbb', borderRadius: '5px', marginTop: '5px'}}></hr>
            </div>
        )
    }
}

HotelItem.propTypes = {
    hotel: PropTypes.object.isRequired,
}


export default HotelItem

