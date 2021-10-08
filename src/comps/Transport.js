import React, { Component, useContext } from "react";
import state_context from "../context";
import Clock from "./Clock";


/*export default class TransportX extends Component {

    on_button_click(e) {
        e.stopPropagation();
        e.preventDefault();
        const button_type = e.target.id;
        if (this.props.on_signal) {
            this.props.on_signal(button_type);
        }
    }

    render() {
        const { } = this.props;
        return (
            <div className={"transport"}>
                <button onClick={this.on_button_click} id={"stop"}>STOP</button>
                <button onClick={this.on_button_click} id={"play"}>PLAY</button>
            </div>
        );
    }

}*/

const Transport = (props) => {
    const { dispatcher } = useContext(state_context);

    return (
        <div className={"transport"} {...props}>
            <div>
                <Clock/>
            </div>

            <div>
                <button onClick={e => dispatcher({type: "TRANSPORT_SIGNAL", signal: "stop"})}>STOP</button>
                <button onClick={e => dispatcher({type: "TRANSPORT_SIGNAL", signal: "play"})}>PLAY</button>
            </div>
        </div>
    );
};

export default Transport;
