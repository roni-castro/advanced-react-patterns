// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {Switch} from '../switch'

const callAllFn = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  function getTogglerProps({onClick, ...otherProps} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAllFn(onClick, toggle),
      ...otherProps,
    }
  }

  return {on, toggle, getTogglerProps}
}

function App() {
  const {on, getTogglerProps} = useToggle()
  return (
    <div>
      <Switch {...getTogglerProps({on})} />
      <hr />
      <button {...getTogglerProps()}>{on ? 'on' : 'off'}</button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
