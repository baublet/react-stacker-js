// @flow

import React, { Component } from "react"
import { DEFAULT_INSTANCE_ID, globalContext } from "./index.js"

type propTypes = {
    currentId: string | number,
    instanceId?: string | number
}

type stateTypes = {
    currentId: string | number
}

export default class StackRenderer extends Component<propTypes, stateTypes> {
    idHistory: Array<number | string>
    currentIndex: number
    rerenderTimer: null | TimeoutID
    constructor(props: propTypes) {
        super(props)
        this.idHistory = []
        this.currentIndex = 0
        if(props.currentId) {
            this.idHistory.push(props.currentId)
            this.currentIndex = 0
            this.state = { currentId: props.currentId }
        }
        this.scheduleRerender()
    }
    
    scheduleRerender(poll: number = 10) {
        if(this.rerenderTimer) {
            return
        }
        this.rerenderTimer = setTimeout(() => {
            this.forceUpdate()
            this.rerenderTimer = null
        }, poll)
    }
    
    clearHistory() {
        this.idHistory = this.idHistory.slice(-1)
        this.currentIndex = 0
    }
    
    componentWillReceiveProps(nextProps: propTypes) {
        if(nextProps.currentId !== this.props.currentId) {
            this.idHistory.push(nextProps.currentId)
            this.currentIndex = this.idHistory.length - 1
            this.setState({ currentId: this.idHistory[this.currentIndex] }, () => {
                this.scheduleRerender()
            })
        }
    }
    
    goBack() {
        if(this.currentIndex > 0) {
            this.currentIndex = this.currentIndex - 1
            this.setState({ currentId: this.idHistory[this.currentIndex] })
        }
    }
    
    goForward() {
        if(this.currentIndex < this.idHistory.length - 1) {
            this.currentIndex = this.currentIndex + 1
            this.setState({ currentId: this.idHistory[this.currentIndex] })
        }
    }

    render() {
        const { instanceId = DEFAULT_INSTANCE_ID } = this.props,
              currentId = this.state ? this.state.currentId : false,
              childrenToRender = currentId && globalContext[instanceId] && globalContext[instanceId][currentId] ? globalContext[instanceId][currentId] : false
        return childrenToRender
    }
}
