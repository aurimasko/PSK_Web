import React from 'react';
import ReactLoading from "react-loading";

class Loading extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            type: this.props.type ? this.props.type : "bars",
            color: this.props.color ? this.props.color : "orange",
            height: this.props.height ? this.props.height : 300,
            width: this.props.width ? this.props.width : 300,
            text: this.props.text ? this.props.text : "Loading...",
            fontSize: this.props.fontSize ? this.props.fontSize : 40,
            showText: this.props.showText ? this.props.showText : false
        };
    }

    renderText() {
        if (this.state.showText === true) {
            return <b style={{ fontSize: this.state.fontSize, textAlign: "center" }}>{this.state.text}</b>;
        } else {
            return "";
        }
    }

    render() {
        return (
            <div style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
                <ReactLoading type={this.state.type} color={this.state.color} height={this.state.height} width={this.state.width} />
                {this.renderText()}
            </div>
        )
    }

}

export default Loading;