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
            <div className="padding-right-10">
                <div className="sidebar border border-gray">
                    <div className="border border-info rounded">
                    <form className="padding-10" onSubmit={this.props.searchHotel}>
                        <h4 className="text-center padding-top-10 padding-bottom-10">Search</h4>
                        <div className="form-group font-weight-light">
                            <Required text="Hotel name or location:"/>
                            <input name="filter" defaultValue={this.props.state.filter}
                                   placeholder="Search hotel name or location"
                                   className="text-center form-control form-control-sm input-width" type="text"
                                   required
                                   onChange={this.props.onChange}/>
                        </div>
                        <div className="form-group font-weight-light">
                            <Required text="Check-in date:"/>
                            <input name="start_date" defaultValue={this.props.state.start_date} placeholder="Start date"
                                   className="text-center form-control form-control-sm input-width" type="date"
                                   min={moment().format("YYYY-MM-DD")}
                                   required
                                   onChange={this.props.onChangeDate}/>
                        </div>
                        <div className="form-group font-weight-light">
                            <Required text="Check-out date:"/>
                            <input name="end_date" defaultValue={this.props.state.end_date}
                                   placeholder="End date"
                                   className="text-center form-control form-control-sm input-width" type="date"
                                   max={this.props.state.start_date !== "" ?
                                       moment(this.props.state.start_date).add(1, "day").add(1, "year").format("YYYY-MM-DD")
                                       : moment().add(1, "year").format("YYYY-MM-DD")}
                                   min={this.props.state.start_date !== "" ?
                                       moment(this.props.state.start_date).add(1, "day").format("YYYY-MM-DD")
                                       : moment().add(1, "day").format("YYYY-MM-DD")}
                                   required
                                   onChange={this.props.onChangeDate}/>
                        </div>
                        <div className="form-group font-weight-light">
                            <Required text="Adults:"/>
                            <input name="adult_count" defaultValue={this.props.state.adult_count}
                                   placeholder="Adults count"
                                   className="text-center form-control form-control-sm input-width" type="number"
                                   max="10" min="1"
                                   required
                                   onChange={this.props.onChange}/>
                        </div>
                        <div>
                            <input
                                type="submit"
                                onSubmit={this.props.searchHotel}
                                value="Search"
                                className="btn btn-block btn-primary"
                            />
                        </div>
                    </form>
                        </div>
                    <hr className="horizontal-space"/>
                    {this.props.searched === true ?
                        <div className="border border-info rounded">
                    <form className="padding-10" onSubmit={this.props.filterHotel}>
                        <h4 className="text-center padding-top-10 padding-bottom-10">Filter</h4>
                        <div className="form-group font-weight-light">
                            Price per night:
                            <div className="d-flex padding-left-5">
                                <input name="start_range" defaultValue={this.props.state.start_range}
                                       placeholder="Min"
                                       className="text-center form-control form-control-sm input-width-filter padding-left-10" type="number"
                                       onChange={this.props.onChange}/>
                                <div className="filter-price-other">
                                    -
                                </div>
                                <input name="end_range" defaultValue={this.props.state.end_range}
                                       placeholder="Max"
                                       className="text-center form-control form-control-sm input-width-filter padding-left-10" type="number"
                                       onChange={this.props.onChange}/>
                                <div className="filter-price-other">
                                    Kč
                                </div>
                            </div>
                        </div>
                        <div className="form-group font-weight-light">
                            Hotel types:
                            <div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="checkmark" name="standard_hotel"
                                               defaultValue={this.props.state.standard_hotel} type="checkbox"
                                               checked={(this.props.state.standard_hotel === "true") ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Standard Hotel
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="checkmark" name="business_hotel"
                                               defaultValue={this.props.state.business_hotel} type="checkbox"
                                               checked={this.props.state.business_hotel === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Business Hotel
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="checkmark" name="airport_hotel"
                                               defaultValue={this.props.state.airport_hotel} type="checkbox"
                                               checked={this.props.state.airport_hotel === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Airport Hotel
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="checkmark" name="bb_hotel"
                                               defaultValue={this.props.state.bb_hotel} type="checkbox"
                                               checked={this.props.state.bb_hotel === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        B&B
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="checkmark" name="casino_hotel"
                                               defaultValue={this.props.state.casino_hotel} type="checkbox"
                                               checked={this.props.state.casino_hotel === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Casino Hotel
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="checkmark" name="studio_hotel"
                                               defaultValue={this.props.state.studio_hotel} type="checkbox"
                                               checked={this.props.state.studio_hotel === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Studio
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="checkmark" name="conference_hotel"
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
                                        <input className="checkmark" name="one_s"
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
                                        <input className="checkmark" name="two_s"
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
                                        <input className="checkmark" name="three_s"
                                               defaultValue={this.props.state.three_s} type="checkbox"
                                               checked={this.props.state.three_s === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        3 star
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="checkmark" name="four_s"
                                               defaultValue={this.props.state.four_s} type="checkbox"
                                               checked={this.props.state.four_s === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        4 star
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="checkmark" name="five_s"
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
                                        <input className="checkmark" name="no_prepayment"
                                               defaultValue={this.props.state.no_prepayment} type="checkbox"
                                               checked={this.props.state.no_prepayment === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        No prepayment
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="checkmark" name="free_cancellation"
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
                                        <input className="checkmark" name="free_wifi"
                                               defaultValue={this.props.state.free_wifi} type="checkbox"
                                               checked={this.props.state.free_wifi === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Free wifi
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="checkmark" name="gym"
                                               defaultValue={this.props.state.gym} type="checkbox"
                                               checked={this.props.state.gym === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        Gym
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="checkmark" name="spa"
                                               defaultValue={this.props.state.spa} type="checkbox"
                                               checked={this.props.state.spa === "true" ? true : null}
                                               onChange={this.props.onChangeCheckbox}/>
                                        <span className="checkmark"/>
                                        SPA
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input className="checkmark" name="swimming_pool"
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
                                type="submit"
                                onSubmit={this.props.filterHotel}
                                value="Filter"
                                className="btn btn-block btn-primary"
                            />
                        </div>
                    </form></div> : <></> }
                </div>
            </div>
        )
    }
}

export default Sidebar;