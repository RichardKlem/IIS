import React, {Component} from 'react'


export class Required extends Component {
    render() {
        if (this.props.end !== "true") {
            return (
                <div className="d-flex required-margin">
                    {this.props.text}
                    <p className="required-color">*</p>
                </div>)
        } else {
            return (
                <div className="d-flex required-margin-indicator">
                    <p className="required-color">*</p>
                    required field
                </div>
            )
        }

    }
}

export default Required;