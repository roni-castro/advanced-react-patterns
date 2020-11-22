// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {Switch} from '../switch'
import warning from 'warning'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  on: controlledOn,
  onChange,
  readOnly = false,
} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const onIsControlled = controlledOn != null
  const on = onIsControlled ? controlledOn : state.on

  const hasOnChange = Boolean(onChange)
  React.useEffect(() => {
    warning(
      !(onIsControlled && !hasOnChange && !readOnly),
      `An \`on\` props was passed to \`useToggle\` without an \`onChange\` handler. 
      This will render a read-only toggle. If you want it to be mutable, use \`initialOn\`.
      Otherwise, set either the \`onChange\` or \`readOnly\` to true`,
    )
  }, [onIsControlled, hasOnChange, readOnly])

  const {current: onWasControlled} = React.useRef(onIsControlled)
  React.useEffect(() => {
    warning(
      !(onWasControlled && !onIsControlled),
      `\`useToggle\` is changing from a controlled to be uncontrolled. 
      Component should not switch from uncontrolled to controlled (or vice versa). 
      Decide between using a controlled or uncontrolled \`useToggle\` for the lifetime of the component. Check the \`on\` prop.`,
    )
    warning(
      !(!onWasControlled.current && onIsControlled),
      `\`useToggle\` is changing from an uncontrolled to be controlled. 
      Component should not switch from uncontrolled to controlled (or vice versa). 
      Decide between using a controlled or uncontrolled \`useToggle\` for the lifetime of the component. Check the \`on\` prop.`,
    )
  }, [onIsControlled, onWasControlled])

  function dispatchWithOnChange(action) {
    if (!onIsControlled) {
      dispatch(action)
    }
    onChange?.(reducer({...state, on}, action), action)
  }

  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})

  const reset = () => dispatch({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, readOnly, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      'read-only': readOnly?.toString(),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({on: controlledOn, onChange, readOnly, initialOn}) {
  const {on, getTogglerProps} = useToggle({
    on: controlledOn,
    initialOn,
    onChange,
    readOnly,
  })
  const props = getTogglerProps({on, readOnly})
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        <Toggle on={bothOn} onChange={handleToggleChange} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args) =>
            console.info('Uncontrolled Toggle onChange', ...args)
          }
        />
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/
