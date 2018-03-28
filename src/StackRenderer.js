import React, { Component } from "react"
import { DEFAULT_INSTANCE_ID, globalContext } from "./index.js"

export default class StackRenderer extends Component {
    constructor(props) {
        super(props)
        this.idHistory = []
        this.currentId = null
        if(props.currentId) {
            this.idHistory.push(props.currentId)
            this.currentId = 0
            this.state = { currentId: props.currentId }
        }
        this.scheduleRerender()
    }
    
    scheduleRerender(poll = 10) {
        if(this.rerenderTimer) {
            return
        }
        this.rerenderTimer = setTimeout(() => {
            this.forceUpdate()
            this.rerenderTimer = null
        }, poll)
    }
    
    clearHistory() {
        this.idHistory = this.idHistory.slide(-1)
        this.currentId = 0
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.currentId !== this.props.currentId) {
            this.idHistory.push(nextProps.currentId)
            this.currentId = this.idHistory.length - 1
            console.log(this.idHistory)
            this.setState({ currentId: this.idHistory[this.currentId] }, () => {
                this.scheduleRerender()
            })
        }
    }
    
    goBack() {
        if(this.currentId > 0) {
            this.currentId = this.currentId - 1
            this.setState({ currentId: this.idHistory[this.currentId] })
        }
    }
    
    goForward() {
        if(this.currentId < this.idHistory.length - 1) {
            this.currentId = this.currentId + 1
            this.setState({ currentId: this.idHistory[this.currentId] })
        }
    }

    render() {
        const { instanceId = DEFAULT_INSTANCE_ID } = this.props,
              currentId = this.state ? this.state.currentId : false,
              childrenToRender = currentId && globalContext[instanceId] && globalContext[instanceId][currentId] ? globalContext[instanceId][currentId] : false
        return childrenToRender
    }
}
