import React, { Component } from "react"
import { DEFAULT_INSTANCE_ID, globalContext } from "./index.js"

export default class RenderInStack extends Component {
    constructor(props) {
        super(props)
        const { id, instanceId = DEFAULT_INSTANCE_ID } = props
        if(!globalContext[instanceId]) {
            globalContext[instanceId] = {}
        }
        globalContext[instanceId][id] = props.children
    }
    render() {
       return false
    }
}