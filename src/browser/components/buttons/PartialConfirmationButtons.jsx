import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CancelIcon, TickMarkIcon } from 'browser-components/icons/Icons'

const IconButton = styled.button`
  margin-left: 4px;
  border: 0;
  background: transparent;
  &:focus {
    outline: none;
  }
`

/**
 * This component displays the partial confirmation state where
 * we can confirm or cancel the action performed
 * @param {*} props
 */

function PartialConfirmationButtons (props) {
  return (
    <div>
      <IconButton
        onClick={() => {
          props.onConfirmed && props.onConfirmed()
        }}
      >
        {props.icon ? props.icon : <TickMarkIcon />}
      </IconButton>
      <IconButton
        onClick={() => {
          props.onCanceled && props.onCanceled()
        }}
      >
        <CancelIcon />
      </IconButton>
    </div>
  )
}

PartialConfirmationButtons.propTypes = {
  icon: PropTypes.element,
  onConfirmed: PropTypes.func,
  onCanceled: PropTypes.func
}

export default PartialConfirmationButtons
