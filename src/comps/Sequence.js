import React, { Component } from "react";


export default class Sequence extends Component {

    on_button_click(e, index) {
        const { sequence } = this.props;
        e.stopPropagation();
        e.preventDefault();
        if (this.props.set_value) {
            this.props.set_value(index, 1 - sequence.values[index]);
        }
    }

    render() {
        const { sequence } = this.props;
        return (
            <div className={"sequence"}>
                {sequence.values.map(this.render_step)}
            </div>
        );
    }

    render_step = (value, index) => {
        const { sequence } = this.props;
        return (
            <div
                key={index}
                className={"button" + (value ? " on" : " off") + (sequence.index === index ? " tick" : "")}
                onClick={e => this.on_button_click(e, index)}
            />
        );
    };
}
