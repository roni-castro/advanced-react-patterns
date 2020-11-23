import React from 'react'
import warning from 'warning'

export function useOnChangeReadOnlyWarning(
  controlledPropsValue,
  controlledPropsName,
  propsRequiredValue,
  propsRequiredName,
  componentName,
  defaultPropsName,
  readOnlyValue,
) {
  const isControlled = controlledPropsValue != null
  const hasRequireProps = Boolean(propsRequiredValue)
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        !(isControlled && !hasRequireProps && !readOnlyValue),
        `The \`${controlledPropsName}\` props was passed to \`${componentName}\` without an \`${propsRequiredName}\` handler. 
        This will render a read-only \`${controlledPropsName}\`. If you want it to be mutable, use \`${defaultPropsName}\`.
        Otherwise, set the \`${propsRequiredName}\` props or \`readOnly\` to true`,
      )
    }
  }, [
    componentName,
    defaultPropsName,
    controlledPropsName,
    propsRequiredName,
    hasRequireProps,
    isControlled,
    readOnlyValue,
  ])
}
