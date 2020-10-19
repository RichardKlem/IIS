import React, { Component } from 'react'
import {ToastContainer} from "react-toastify";
import {Link} from "react-router-dom";
import { Form } from 'react-bootstrap';
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export class OpenHotel extends Component {

    state = {
        name: '',
        address: '',
        description: '',
        phone_number: '',
        email: '',
        category: '',
        rating: '',
        hotel_id: '',
        role: 5,
        /* File upload variables */
        image: '',
        newImageWasUploaded: false,
        fileUploadErrMsg:'',
        hotelUploadAvailable: true,
        selectedFile: null
    }


    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({hotel_id: id})
        axios.post('/getHotel', { hotel_id: id })
            .then((res) => {
                    this.setState({name: res.data.name,
                        address: res.data.address,
                        description: res.data.description,
                        phone_number: res.data.phone_number,
                        email: res.data.email,
                        category: res.data.category,
                        rating: res.data.rating,
                    });
        });
        axios.post('/getHotelImage', {hotel_id: id})
            .then(res => {
                    this.setState({image : res.data});
                }
            );
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Edit hotel</h4>
                    <p className="card-description"> Please edit the form underneath </p>
                    <div style={{display:'flex', paddingBottom: '40px'}}>
                        {this.addHotelPhoto()}
                    </div>
                    <fieldset id="hotelInput" onLoad={this.getStyle}>
                    <form className="forms-sample" onSubmit={this.EditHotelHandler}>
                        <Form.Group>
                            <label htmlFor="exampleInputUsername1">Name</label>
                            <Form.Control id="hotelInput" onChange={this.onChange} defaultValue={this.state.name} name='name' type="text" placeholder="Name" size="lg" required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="exampleInputUsername1">Description</label>
                            <Form.Control id="hotelInput" onChange={this.onChange} defaultValue={this.state.description} name='description' type="text" placeholder="Description" size="lg" required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="exampleInputUsername1">Address</label>
                            <Form.Control id="hotelInput" onChange={this.onChange} defaultValue={this.state.address} name='address' type="text" placeholder="Address" size="lg" required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="exampleInputUsername1">Phone Number</label>
                            <Form.Control id="hotelInput" onChange={this.onChange} defaultValue={this.state.phone_number} name='phone_number' type="tel" placeholder="Phone Number" size="lg" required />
                        </Form.Group>
                        <Form.Group>
                            <label htmlFor="exampleInputUsername1">Email</label>
                            <Form.Control id="hotelInput" onChange={this.onChange} defaultValue={this.state.email} name='email' type="email" placeholder="Email" size="lg" required />
                        </Form.Group>
                        <Form.Group>
                            <label>Rating (0-5 Stars)</label>
                            <Form.Control id="hotelInput" onChange={this.onChange} defaultValue={this.state.rating} name='rating' type="number" min="0" max="5" placeholder="Rating (0-5 Stars)" size="lg" required />
                        </Form.Group>
                        <Form.Group>
                            <label>Category</label>
                            <Form.Control id="hotelInput" onChange={this.onChange} defaultValue={this.state.category} name='category' type="number" min="0" max="5" placeholder="Category" size="lg" required />
                        </Form.Group>
                        {this.getSubmitOption()}
                        <div className="text-center mt-4 font-weight-bold">
                            {this.state.status}
                        </div>
                    </form>
                    </fieldset>
                </div>
            </div>
        )
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    EditHotelHandler = (e) => {
        e.preventDefault();
        axios.post('/editHotel', {
            hotel_id: this.state.hotel_id,
            name: this.state.name,
            address: this.state.address,
            description: this.state.description,
            phone_number: this.state.phone_number,
            category: this.state.category,
            email: this.state.email,
            rating: this.state.rating})
            .then(res => {
                if (this.state.newImageWasUploaded) {
                    const data = new FormData()
                    data.append('file', this.state.selectedFile)
                    axios.post('/uploadHotelImg/'+this.state.hotel_id, data).then(res => { // then print response status
                    })
                        .catch(err => { // then print response status
                            console.log(err)
                        })
                }
            });
        this.props.history.push('/account');
    }

    getStyle = () => {
        const cookieUserID = cookies.get('CookieUserID');
        console.log(cookieUserID)
        if (cookieUserID !== null) {
            axios.post('/getUserRole', {CookieUserID: cookieUserID})
                .then(res => {
                        this.setState({role: res.data.role});
                        if (this.state.role > 3 || window.location.pathname.startsWith("/hotel/")) {
                            if (document.getElementById('hotelInput') !== null) {
                                document.getElementById('hotelInput').disabled = true;
                            }
                        }
                    }
                );
        } else {
            this.setState({role: 5});
                if (document.getElementById('hotelInput') !== null) {
                    document.getElementById('hotelInput').disabled = true;
                }
        }

    }

    getSubmitOption = () => {
        const cookieUserID = cookies.get('CookieUserID');
        axios.post('/getUserRole', {CookieUserID: cookieUserID})
            .then(res => { this.setState({role: res.data.role});});
        if (this.state.role < 4 && window.location.pathname.startsWith("/editHotel/")) {
            return(<div style={{display: 'flex'}}>
                <button style={this.getSubmitButtonStyle()} className="btn btn-block btn-primary btn-lg mr-2" type="submit">Submit changes</button>
                <Link to="/account" className="btn btn-block btn-primary btn-lg mr-2 btn-light font-weight-medium">Cancel</Link>
            </div>)
        }
    }

    addHotelPhoto() {
        return <>
            {this.getImg()}
            <div style={{paddingLeft: '20px'}}>
                <div className="row">
                    <div className="col-md-6">
                        <ToastContainer/>
                        <div style={{paddingBottom: '10px'}}>
                            <label>Upload your profile photo </label>
                            <input type="file" name="file" onChange={this.onChangeFileUploadHandler}/>
                        </div>
                        <div style={{display: 'flex'}}>
                            <p>{this.state.fileUploadErrMsg}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>;
    }


    getImg() {
        if (this.state.newImageWasUploaded === false){
            return <img src={`data:image/*;base64,${this.state.image}`} alt='' style={{width: '200px', height: '200px'}}/>;
        } else {
            return <img src={this.state.image} alt='' style={{width: '200px', height: '200px'}}/>;
        }
    }

    /* File Upload Functions */
    getSubmitButtonStyle = () => {
        return {
            display: this.state.hotelUploadAvailable ?
                'block' : 'none'
        }
    }

    onChangeFileUploadHandler = (e) => {
        var file = e.target.files[0];
        if (this.validateFileSize(e)) {
            this.setState({ selectedFile: file, fileUploadAvailable : true, fileUploadErrMsg: '' });

        }
    };

    validateFileSize = (e) => {
        let file = e.target.files[0];

        if (!file) {
            this.setState({selectedFile : null, fileUploadAvailable : false, fileUploadErrMsg : 'Please select a photo.'});
            return false;
        }

        if (file.type.split("/")[0] !== "image" ) {
            this.setState({selectedFile : null, fileUploadAvailable : false, fileUploadErrMsg : 'Please select a photo.'});
            return false;
        }
        this.setState({image : URL.createObjectURL(e.target.files[0]), newImageWasUploaded: true})
        return true;
    };
}

export default OpenHotel
