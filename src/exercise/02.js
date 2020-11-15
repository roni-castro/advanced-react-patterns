// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {Switch} from '../switch'

function Toggle(props) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return React.Children.map(props.children, child => {
    if (typeof child.type === 'string') {
      return child
    }
    if (child.type.displayName === 'ToggleButton') {
      return React.cloneElement(child, {on, toggle})
    }
    return React.cloneElement(child, {on})
  })
}

const ToggleOn = ({on, children}) => (on ? children : null)

const ToggleOff = ({on, children}) => (on ? null : children)

const ToggleButton = ({on, toggle, ...props}) => (
  <Switch on={on} onClick={toggle} {...props} />
)
ToggleButton.displayName = 'ToggleButton'

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <span>Hello</span>
        <ToggleButton />
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
