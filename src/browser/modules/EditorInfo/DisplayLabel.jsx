import React, { useState, useEffect } from 'react'
import { BinIcon, TickMarkIcon } from 'browser-components/icons/Icons'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'
import { getStringValue } from './utils'
import { StyledValue } from '../DatabaseInfo/styled'
import { StyledKeyEditor, EditPropertiesInput } from './styled'
import PropTypes from 'prop-types'

/**
 * Component to display the label of selected node
 * @param {*} props
 */

export const DisplayLabel = props => {
  let { label, labelKey } = props

  const initialState = {
    labelName: { [labelKey]: label },
    requested: false
  }
  const [labelState, setToInitialState] = useState(initialState)

  useEffect(() => {
    setToInitialState({
      labelName: { [labelKey]: label },
      requested: false
    })
  }, [label])

  const handleChange = (event, labelKey) => {
    let newState = _.cloneDeep(labelState)
    setToInitialState({
      ...newState,
      labelName: {
        ...newState.labelName,
        [labelKey]: getStringValue(event.target.value)
      },
      requested: true
    })
  }

  const onCanceled = () => {
    setToInitialState({
      labelName: { [labelKey]: label },
      requested: false
    })
  }

  return (
    <React.Fragment>
      <StyledKeyEditor>{labelKey}:</StyledKeyEditor>
      <StyledValue data-testid='user-details-username'>
        <EditPropertiesInput
          type='text'
          value={getStringValue(labelState.labelName[labelKey])}
          onChange={event => {
            handleChange(event, labelKey)
          }}
        />
        {labelState.requested ? (
          <PartialConfirmationButtons
            icon={<TickMarkIcon />}
            onCanceled={onCanceled}
          />
        ) : null}
        <ConfirmationButton
          requestIcon={<BinIcon />}
          confirmIcon={<BinIcon deleteAction />}
          //  onConfirmed={onCanceled}
        />
      </StyledValue>
    </React.Fragment>
  )
}

DisplayLabel.propTypes = {
  labelKey: PropTypes.string,
  label: PropTypes.string
}
