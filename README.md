# React Stacker Component

React Stacker is a means of declaratively describing parts of your UI that need to be rendered
in an area outside of its immediate component tree. It does this without using React's Portal
features (useable only if you're using ReactDOM).

It works a lot like a router, but with no need to specify routes up front, so that developers
can declaratively hoist pieces of UI to certain parts of their component tree.

**Terminology**
* Stack -- a first-in, last-out list of component trees to be rendered in arbitrary locations via the `StackRenderer` component
* Stack Item (or just item) -- a stack is made out of stack items, which are the component trees defined under the `RenderInStack` component

## How does it work?

There are two main components.

* StackRenderer
  * The component you want content rendered **to**
* RenderInStack
  * The component you use throughout your application to render components through the above component

So, for example, with React Stacker, one may write:

```jsx
    // Some React component
    render() {
        const currentStack = this.state.currentStack || "navigation"
        return (
            <SidebarDrawerWrapper>
                <SidebarDrawerContent>
                    {/* You may decide to wrap this component in a higher order component that lets you set "currentId" via global state */}
                    <StackRenderer currentId={currentStack} />
                </SidebarDrawerContent>
                <MainLayout>
                    <Header />
                    <Content>
                        <Product id="12" onClick={this.setState({ currentStack: "product-12" })}>
                            {/* Here would be normal product card stuff that's always shown. */}
                            <RenderInStack id="product-12">
                                {/* This is rendered in the stack. An example here might be to show
                                    a slide-in drawer as a product details pane, rather than take
                                    customers to a new route. */}
                            </RenderInStack>
                        </Product>
                    </Content>
                </MainLayout>
            </SidebarDrawerWrapper>
        )
    }
```

This component attaches to a global squishy-state object to decide what to render. When you define a
`RenderInStack` component, it can be anywhere in the component tree, so `StackRenderer` is designed
to take that into account and render as lazily as possible.

## API

### `<StackRenderer />`

```jsx
    <StackRenderer
        instanceId="myStackDrawer"      // (optional)  Unique ID for each stacker instance you want to maintain
        currentId=null                  // The ID of the stack in the current instance you want to render
    />
```

### `<RenderInStack />`

```jsx
    <RenderInStack
        instanceId="myStackDrawer"      // (optional)  ID of the stacker instance you to render this in
        id="unique-id-for-this-stack"   // Unique ID for this stack
    >
        {/* Children to render in the target StackRenderer */}
    </RenderInStack>
```

## Example

```jsx
import { StackRenderer, RenderInStack } from "react-stacker-js"
import { render } from "react-dom"
import React, { Component } from "react"

class Demo extends Component {
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
```

## Tips and Tricks

### Loading Stacks

Sometimes, you may want be declaring components that don't properly render without
some sort of asyncronous request or method -- typically an XHR request. If you don't
want to change the behavior of your component, it may be useful to setup a loading
stack ID for your stack renderer:

```jsx
    <RenderInStack id="loading">
        <MyLoadingIndicator />
    </RenderInStack>
    <StackRenderer currentId={this.state.currentId />
```

Then, when you need to load your asyncronous component, just call
`this.setState({ currentId: "loading" })` until the component is done loading,
then set the current stack ID to the new one to render.

### Back and Forth on the Stack

It's not a stack without the ability to go back and forth through it! To gain
more granular control over your stack renderer, snag a reference to it via the
React Refs API:

```jsx
    // In some component
    <StackRenderer ref={stackRenderer => this.stackRenderer = stackRenderer} />
```

Now you have access to the public methods of the StackRenderer:

```
    goBack()        // Goes to the previous stack item, if possible
    goForward()     // Goes to the next stack item, if possible
    clearHistory()  // Clears the history of the stack, leaving only the current stack shown
```