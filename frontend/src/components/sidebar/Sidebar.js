import React, {Component} from 'react';
import Required from "../other/Required";
import moment from "moment";

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div style={{paddingRight: "10px"}}>
                <div className="sidebar border auth-form-light text-left" id="sidebar"
                     style={{background: "none", padding: "10px"}}>
                    <form className="auth-form-light" onSubmit={this.props.searchHotel}>
                        <h4 className="text-center">Search</h4>
                        <div className="form-group font-weight-light">
                            <Required text="Hotel name or location:"/>
                            <input name="filter" defaultValue={this.props.state.filter}
                                   style={{minWidth: '100px', maxWidth: 'auto/5'}}
                                   placeholder="Search for hotel name or location"
                                   className="text-center form-control form-control-sm" type="text"
                                   required
                                   onChange={this.props.onChange}/>
                        </div>
                        <div className="form-group font-weight-light">
                            <Required text="Check-in date:"/>
                            <input name="start_date" defaultValue={this.props.state.start_date}
                                   style={{minWidth: '100px', maxWidth: 'auto/5'}} placeholder="Start date"
                                   className="text-center form-control form-control-sm" type="date"
                                   max={moment().add(1, "year").format("YYYY-MM-DD")}
                                   min={moment().format("YYYY-MM-DD")}
                                   required
                                   onChange={this.props.onChange}/>
                        </div>
                        <div className="form-group font-weight-light">
                            <Required text="Check-out date:"/>
                            <input name="end_date" defaultValue={this.props.state.end_date}
                                   style={{minWidth: '100px', maxWidth: 'auto/5'}} placeholder="End date"
                                   className="text-center form-control form-control-sm" type="date"
                                   max={ this.props.state.start_date !== "" ?
                                       moment(this.props.state.start_date).add(1, "day").add(1, "year").format("YYYY-MM-DD")
                                   : moment().add(1, "year").format("YYYY-MM-DD")}
                                   min={ this.props.state.start_date !== "" ?
                                       moment(this.props.state.start_date).add(1, "day").format("YYYY-MM-DD")
                                   : moment().add(1, "day").format("YYYY-MM-DD")}
                                   required
                                   onChange={this.props.onChange}/>
                        </div>
                        <div className="form-group font-weight-light">
                            <Required text="Adults:"/>
                            <input name="adult_count" defaultValue={this.props.state.adult_count}
                                   style={{minWidth: '100px', maxWidth: 'auto/5'}} placeholder="Adults count"
                                   className="text-center form-control form-control-sm" type="number" max="10" min="1"
                                   required
                                   onChange={this.props.onChange}/>
                        </div>
                        <div>
                            <input
                                style={{display: 'block'}}
                                type="submit"
                                onSubmit={this.props.searchHotel}
                                value="Search"
                                className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                            />
                        </div>
                    </form>
                    <hr style={{
                        borderTop: '3px solid #bbb',
                        borderRadius: '-5px',
                        marginTop: '5px',
                        paddingTop: "10px"
                    }}/>
                    <form className="auth-form-light" onSubmit={this.props.filterHotel}>
                        <h4 className="text-center">Filter</h4>
                        <div className="form-group font-weight-light">
                            Price per night:
                            <div style={{display: "flex", paddingTop: "5px"}}>
                                <input name="start_range" defaultValue={this.props.state.start_range}
                                       style={{minWidth: '100px', maxWidth: 'auto/5'}} placeholder="Min"
                                       className="text-center form-control form-control-sm" type="number"
                                       onChange={this.props.onChange}/>
                                <div style={{paddingLeft: "5px", paddingRight: "5px", paddingTop: "2.5px"}}>
                                    -
                                </div>
                                <input name="end_range" defaultValue={this.props.state.end_range}
                                       style={{minWidth: '100px', maxWidth: 'auto/5'}} placeholder="Max"
                                       className="text-center form-control form-control-sm" type="number"
                                       onChange={this.props.onChange}/>
                                <div style={{paddingLeft: "5px", paddingRight: "5px", paddingTop: "2.5px"}}>
                                    Kč
                                </div>
                            </div>
                        </div>
                        <div className="form-group font-weight-light">
                            Hotel types:
                            <div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="standard_hotel"
                                               defaultValue={this.props.state.standard_hotel} type="checkbox"
                                               checked={(this.props.state.standard_hotel === "true") ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Standard Hotel
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="business_hotel"
                                               defaultValue={this.props.state.business_hotel} type="checkbox"
                                               checked={this.props.state.business_hotel === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Business Hotel
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="airport_hotel"
                                               defaultValue={this.props.state.airport_hotel} type="checkbox"
                                               checked={this.props.state.airport_hotel === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Airport Hotel
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="bb_hotel"
                                               defaultValue={this.props.state.bb_hotel} type="checkbox"
                                               checked={this.props.state.bb_hotel === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        B&B
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="casino_hotel"
                                               defaultValue={this.props.state.casino_hotel} type="checkbox"
                                               checked={this.props.state.casino_hotel === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Casino Hotel
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="studio_hotel"
                                               defaultValue={this.props.state.studio_hotel} type="checkbox"
                                               checked={this.props.state.studio_hotel === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Studio
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="conference_hotel"
                                               defaultValue={this.props.state.conference_hotel} type="checkbox"
                                               checked={this.props.state.conference_hotel === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Conference Hotel
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group font-weight-light">
                            Stars rating:
                            <div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="one_s"
                                               checked={this.props.state.one_s === "true" ? true : null}
                                               defaultValue={this.props.state.one_s}
                                               type="checkbox" onChange={this.props.onChangeCheckbox}
                                        />
                                        <span className="checkmark"/>
                                        1 star
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="two_s"
                                               defaultValue={this.props.state.two_s}
                                               checked={this.props.state.two_s === "true" ? true : null}
                                               type="checkbox" onChange={this.props.onChangeCheckbox}
                                        />
                                        <span className="checkmark"/>
                                        2 star
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="three_s"
                                               defaultValue={this.props.state.three_s} type="checkbox"
                                               checked={this.props.state.three_s === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        3 star
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="four_s"
                                               defaultValue={this.props.state.four_s} type="checkbox"
                                               checked={this.props.state.four_s === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        4 star
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="five_s"
                                               defaultValue={this.props.state.five_s} type="checkbox"
                                               checked={this.props.state.five_s === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        5 star
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group font-weight-light">
                            Payment:
                            <div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="no_prepayment"
                                               defaultValue={this.props.state.no_prepayment} type="checkbox"
                                               checked={this.props.state.no_prepayment === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        No prepayment
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="free_cancellation"
                                               defaultValue={this.props.state.free_cancellation} type="checkbox"
                                               checked={this.props.state.free_cancellation === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Free cancellation
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group font-weight-light">
                            Others:
                            <div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="free_wifi"
                                               defaultValue={this.props.state.free_wifi} type="checkbox"
                                               checked={this.props.state.free_wifi === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Free wifi
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="gym"
                                               defaultValue={this.props.state.gym} type="checkbox"
                                               checked={this.props.state.gym === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Gym
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="spa"
                                               defaultValue={this.props.state.spa} type="checkbox"
                                               checked={this.props.state.spa === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        SPA
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="form-check-input" name="swimming_pool"
                                               defaultValue={this.props.state.swimming_pool} type="checkbox"
                                               checked={this.props.state.swimming_pool === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Swimming Pool
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <input
                                style={{display: 'block'}}
                                type="submit"
                                onSubmit={this.props.filterHotel}
                                value="Filter"
                                className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                            />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Sidebar;