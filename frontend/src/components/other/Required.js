import React, {Component} from 'react'


export class Required extends Component {
    render() {
        if (this.props.end !== "true") {
            return (
                <div className="d-flex" style={{marginBottom: "-10px"}}>
                    {this.props.text}
                    <p style={{color: "rgb(255, 99, 71)", marginLeft: ".15rem"}}>*</p>
                </div>)
        } else {
            return (
                <div style={{display: "flex", marginTop: "15px"}}>
                    <p style={{color: "rgb(255, 99, 71)", marginRight: ".15rem"}}>*</p>
                    required field
                </div>
            )
        }

    }
}

export default Required;