import React, { Component } from "react";
import Synth from "./Synth";
import { StateProvider } from "../state";
import Transport from "./Transport";



export class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StateProvider>
                <Transport/>
                <Synth/>
            </StateProvider>
        );
    }
}
