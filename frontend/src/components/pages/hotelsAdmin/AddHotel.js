import React, { Component } from 'react'
import {ToastContainer} from "react-toastify";
import axios from "axios";

export class AddHotel extends Component {

    state = {
        name: '',
        address: '',
        description: '',
        phone_number: '',
        email: '',
        category: '',
        rating: '',
        hotel_id: '',
        /* File upload variables */
        image: '',
        fileUploadErrMsg:'',
        hotelUploadAvailable: true,
        selectedFile: null
    }
    
    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    AddHotelHandler = (e) => {
        e.preventDefault();
        let id_hotel = null;
        axios.post('/addHotel', {
            name: this.state.name,
            address: this.state.address,
            description: this.state.description,
            phone_number: this.state.phone_number,
            category: this.state.category,
            email: this.state.email,
            rating: this.state.rating})
            .then(res => {
                    id_hotel = res.data
                    if (this.state.image !== '' || id_hotel !== null) {
                        console.log(this.state.hotel_id)
                        const data = new FormData()
                        data.append('file', this.state.selectedFile)
                        axios.post('/uploadHotelImg/'+id_hotel, data).then(res => { // then print response status
                        })
                            .catch(err => { // then print response status
                                console.log(err)
                            })
                    }
        });
        this.props.history.push('/account');
    }

    render() {
        return (
            <div>
                <div className="d-flex align-items-center auth px-0">
                    <div className="w-100 mx-0">
                        <div>
                            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                <h4>Add new hotel.</h4>
                                <h6 className="font-weight-light">Please fill the form underneath </h6>
                                <form className="pt-3" onSubmit={this.AddHotelHandler} >
                                    <div className="form-group">
                                        <input type="text" className="form-control form-control-lg" name='name' placeholder='Name' defaultValue={this.state.name} onChange={this.onChange} required />
                                    </div>
                                    <div className="form-group">
                                        <textarea value={this.state.description} className="form-control" name='description' placeholder='Description' rows="4" onChange={this.onChange} required>{this.state.description}</textarea>
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control form-control-lg" name='address' placeholder='Address' defaultValue={this.state.address} onChange={this.onChange} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="tel" className="form-control form-control-lg" name='phone_number' placeholder='Phone Number' pattern="[+][0-9]{1,3}[0-9]{3}[0-9]{3}[0-9]{3,4}" defaultValue={this.state.phone_number}  onChange={this.onChange} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="tel" className="form-control form-control-lg" name='email' placeholder="Email" defaultValue={this.state.email} onChange={this.onChange} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="number" className="form-control form-control-lg" name='rating' placeholder='Rating (0-5 stars)' min="0" max="5" defaultValue={this.state.rating} onChange={this.onChange} required />
                                    </div>
                                    <div className="form-group">
                                        <input type="number" className="form-control form-control-lg" name='category' placeholder='Category (0-5)' min="0" max="5" defaultValue={this.state.category} onChange={this.onChange} required />
                                    </div>
                                    <div style={{display:'flex', paddingBottom: '40px'}}>
                                        {this.addHotelPhoto()}
                                    </div>
                                    <div className="form-group">
                                        <input
                                            style={this.getUploadButtonStyle()}
                                            type="submit"
                                            value="Add hotel"
                                            className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                                        />
                                    </div>
                                    <div className="text-center mt-4 font-weight-bold">
                                        {this.state.status}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    addHotelPhoto() {
        return <>
            <img src={this.state.image} alt='' style={{ width:'200px', height:'200px' }}/>
            <div style={{ paddingLeft:'20px' }}>
                <div className="row">
                    <div className="col-md-6">
                        <ToastContainer/>
                            <div style={{ paddingBottom:'10px' }}>
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


    /* File Upload Functions */
    getUploadButtonStyle = () => {
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
        this.setState({image : URL.createObjectURL(e.target.files[0])})
        return true;
    };
}

export default AddHotel
