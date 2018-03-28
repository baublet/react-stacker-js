import { StackRenderer, RenderInStack } from "../src/index.js"
import { render } from "react-dom"
import React from "react"

class Demo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: "home"
        }
    }
    switchTo(page) {
        this.setState({ page })
    }
    render() {
        const switchTo = this.switchTo.bind(this),
              page = this.state.page
        return(
            <div className="layout">
                <div className="header"><h1>Demo</h1></div>
                <div className="main-bar">
                    <a href="#" onClick={() => switchTo("home")}>Home</a>
                    &nbsp;
                    <a href="#" onClick={() => switchTo("pageA")}>Page A</a>
                    &nbsp;
                    <a href="#" onClick={() => switchTo("pageB")}>Page B</a>
                </div>
                <div className="side-bar">
                    <div className="sidebar-navigator">
                        <a href="#" onClick={() => this.stackRenderer.goBack()}>Back</a>
                        &nbsp;
                        <a href="#" onClick={() => this.stackRenderer.goForward()}>Forward</a>
                    </div>
                    <StackRenderer currentId={page} ref={(stackRenderer) => this.stackRenderer = stackRenderer} />
                </div>
                <div className="content">
                    {page !== "home" ? false :
                        <div>
                            <h2>Home page</h2>
                            <p>This is our home page!</p>
                            <RenderInStack id="home">
                                <b>Home page sidebar</b>
                            </RenderInStack>
                        </div>
                    }
                    {page !== "pageA" ? false :
                        <div>
                            <h2>Page A</h2>
                            <RenderInStack id="pageA">
                                <b>Page A sidebar</b>
                            </RenderInStack>
                        </div>
                    }
                    {page !== "pageB" ? false :
                        <div>
                            <h2>Page B</h2>
                            <RenderInStack id="pageB">
                                <b>Page B sidebar</b>
                            </RenderInStack>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

render(
  <Demo />,
  document.getElementById('root')
)