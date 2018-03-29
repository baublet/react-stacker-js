// @flow

import React, { Component } from "react"
import { DEFAULT_INSTANCE_ID, globalContext } from "./index.js"

type propTypes = {
    id: string | number,
    instanceId?: string | number,
    children?: any
}

export default class RenderInStack extends Component<propTypes> {
    constructor(props: propTypes) {
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