import React from 'react'
import warning from 'warning'

export function useControlledSwitchWarning(
  controlPropValue,
  controlPropName,
  componentName,
) {
  /*
   * Determine whether or not the component is controlled and warn the developer
   * if this changes unexpectedly.
   */
  const isControlled = controlPropValue != null
  const {current: wasControlled} = React.useRef(isControlled)
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        !(!wasControlled && isControlled),
        `\`${componentName}\` is changing from uncontrolled to be controlled. Components should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled \`${componentName}\` for the lifetime of the component. Check the \`${controlPropName}\` prop.`,
      )
      warning(
        !(wasControlled && !isControlled),
        `\`${componentName}\` is changing from controlled to be uncontrolled. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled \`${componentName}\` for the lifetime of the component. Check the \`${controlPropName}\` prop.`,
      )
    }
  }, [componentName, controlPropName, wasControlled, isControlled])
}
