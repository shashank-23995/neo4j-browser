import React from 'react'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import PropTypes from 'prop-types'

export const ConfirmationButtonBlack = props => {
  return (
    <ConfirmationButton
      requestIcon={props.requestIcon}
      confirmIcon={props.confirmIcon}
      onConfirmed={props.onConfirmed}
    />
  )
}

ConfirmationButtonBlack.propTypes = {
  requestIcon: PropTypes.element,
  confirmIcon: PropTypes.element,
  onConfirmed: PropTypes.func
}
