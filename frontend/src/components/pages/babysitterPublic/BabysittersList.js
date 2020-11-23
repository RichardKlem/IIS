import React, {Component} from 'react'
import axios from "axios";
import {Link} from "react-router-dom";
import moment from "moment";
import Babysitters from "./Babysitters";


export class BabysittersList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isLoadingError: false,
            babysitters: [],
            /* Date */
            start_date: "",
            end_date: "",
            /* Time */
            start_time: "",
            end_time: "",
        }
    }

    componentDidMount() {
        axios.get('/getBabysitters')
            .then(res => {
                    this.setState({babysitters: res.data});
                    this.setState({isLoading: false});
                }
            ).catch(() => {
            this.setState({status: "ERROR, please reload page", isLoadingError: true})
        });
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
                <div>
                    {this.showEditOptions()}
                </div>
            )
        }
    }

    showEditOptions = () => {
        if (window.location.pathname.startsWith("/adminBabysitters")) {
            return (
                <>
                    <div className="justify-content-between d-flex padding-top-40">
                        <h1>Babysitters List</h1>
                        <Link to={"/addBabysitter"}
                              className="btn btn-primary d-flex align-items-center border-0 margin-bottom-10"
                        >Add Babysitter</Link>
                    </div>
                    <div className="border border-gray">
                        {this.state.babysitters.length > 0 ?
                            <Babysitters babysitters={this.state.babysitters}
                                         start_date={this.state.start_date}
                                         start_time={this.state.start_time}
                                         end_date={this.state.end_date}
                                         end_time={this.state.end_time}/> : ""}
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className="hotels-list-padding">
                        <h1>Babysitters List</h1>
                        <div className="rooms-list">
                            <div className="d-flex">
                                <div className="padding-right-10">
                                    Start Date
                                </div>
                                <input name="start_date" defaultValue={this.state.start_date}
                                       placeholder="Start date"
                                       className="width-calc-100 text-center form-control form-control-sm"
                                       type="date"
                                       min={moment(this.props.location.state.res_start_date).format("YYYY-MM-DD")}
                                       max={this.state.end_date === "" ?
                                           moment(this.props.location.state.res_end_date).format("YYYY-MM-DD")
                                           :
                                           moment(this.state.end_date).format("YYYY-MM-DD")
                                       }
                                       onChange={this.onChange} required/>
                                <div className="padding-10"/>
                                <input name="start_time" defaultValue={this.state.start_time}
                                       placeholder="Start Time"
                                       className="width-calc-100 text-center form-control form-control-sm"
                                       type="time"
                                       step="3600000"
                                       onChange={this.onChange} required/>
                            </div>
                            <div className="d-flex padding-top-10">
                                <div className="padding-right-10">
                                    End Date
                                </div>
                                <input name="end_date" defaultValue={this.state.end_date}
                                       placeholder="End date"
                                       className="width-calc-100 text-center form-control form-control-sm"
                                       type="date"
                                       min={this.state.start_date === "" ?
                                           moment(this.props.location.state.res_start_date).format("YYYY-MM-DD")
                                           :
                                           moment(this.state.start_date).format("YYYY-MM-DD")
                                       }
                                       max={moment(this.props.location.state.res_end_date).format("YYYY-MM-DD")}
                                       onChange={this.onChange} required/>
                                <div className="padding-10"/>
                                <input name="end_time" defaultValue={this.state.end_time}
                                       placeholder="End time"
                                       className="width-calc-100 text-center form-control form-control-sm"
                                       type="time"
                                       step="3600000"
                                       onChange={this.onChange} required/>
                            </div>
                        </div>
                    </div>
                    <div className="border border-gray">
                        {this.state.babysitters.length > 0 ? <Babysitters babysitters={this.state.babysitters}
                                                                          start_date={this.state.start_date}
                                                                          start_time={this.state.start_time}
                                                                          end_date={this.state.end_date}
                                                                          end_time={this.state.end_time}
                                                                          id_reservation={this.props.location.state.id_reservation}/> : ""

                        }
                    </div>
                </>
            )
        }
    }

    onChange = (e) => this.setState({[e.target.name]: e.target.value});
}


export default BabysittersList;