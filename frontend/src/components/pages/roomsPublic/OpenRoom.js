import React, {Component} from 'react'
import {Link} from "react-router-dom";
import {Form} from 'react-bootstrap';
import axios from "axios";
import PropTypes from "prop-types";

export class OpenRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            /* room data */
            name: undefined,
            bed_count: undefined,
            description: undefined,
            phone_number: undefined,
            price_night: undefined,
            category: undefined,
            room_size: undefined,
            hotel_id: undefined,
            bed_type: "1",
            meal: " 1",
            free_breakfast: false,
            count: undefined,
            /* File upload variables */
            image: undefined,
            newImageWasUploaded: false,
            fileUploadErrMsg: '',
            selectedFile: null,
            /* User */
            role: 5,
        }
    }


    componentDidMount() {
        const id = this.props.id_room;
        this.setState({id_room: id})
        axios.post('/getRoom', {id_room: id})
            .then((res) => {
                this.setState({
                    hotel_id: res.data.hotel_id,
                    name: res.data.name,
                    description: res.data.description,
                    bed_count: res.data.bed_count,
                    category: res.data.category,
                    room_size: res.data.room_size,
                    price_night: res.data.price_night,
                    bed_type: res.data.bed_type,
                    meal: res.data.meal,
                    count: res.data.count,
                    free_breakfast: res.data.free_breakfast ? "true" : "false",
                });
                axios.post('/getRoomImage', {id_room: id, hotel_id: res.data.hotel_id})
                    .then(res => {
                            this.setState({image: res.data});
                            this.setState({isLoading: false});
                        }
                    );
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
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Room</h4>
                        <div className="d-flex padding-bottom-40">
                            <img src={`data:image/*;base64,${this.state.image}`} alt=''
                                 className="item-list-style-img-200"
                            />
                        </div>
                        <fieldset disabled>
                            <form className="forms-sample">
                                <Form.Group>
                                    <label htmlFor="exampleInputUsername1">Name</label>
                                    <Form.Control id="hotelInput"
                                                  defaultValue={this.state.name} name='name' type="text"
                                                  placeholder="Name" size="lg" readOnly/>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputUsername1">Description</label>
                                    <Form.Control id="hotelInput"
                                                  defaultValue={this.state.description} name='description' type="text"
                                                  placeholder="Description" size="lg" readOnly/>
                                </Form.Group>
                                <Form.Group>
                                    <label>Category</label>
                                    <Form.Control id="hotelInput"
                                                  defaultValue={this.state.category} name='category' type="number"
                                                  placeholder="Category" size="lg" readOnly/>
                                </Form.Group>
                                <Form.Group>
                                    <label>Bed Count</label>
                                    <Form.Control id="hotelInput"
                                                  defaultValue={this.state.bed_count} name='bed_count' type="number"
                                                  min="1"
                                                  placeholder="Bed Count" size="lg" readOnly/>
                                </Form.Group>
                                <Form.Group>
                                    <label>Room Size</label>
                                    <Form.Control id="hotelInput"
                                                  defaultValue={this.state.room_size} name='room_size' type="number"
                                                  placeholder="Room Size" size="lg" readOnly/>
                                </Form.Group>
                                <Form.Group>
                                    <label>Price per Night</label>
                                    <Form.Control id="hotelInput"
                                                  defaultValue={this.state.price_night} name='price_night' type="number"
                                                  placeholder="Price per Night" size="lg" readOnly/>
                                </Form.Group>
                                <div className="text-center mt-4 font-weight-bold">
                                    {this.state.status}
                                </div>
                            </form>
                        </fieldset>
                    </div>
                </div>
            )
        }
    }
}

OpenRoom.propTypes = {
    id_room: PropTypes.number.isRequired,
}

export default OpenRoom
