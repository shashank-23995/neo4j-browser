import React, { useState, useEffect } from 'react'
import { BinIcon, TickMarkIcon } from 'browser-components/icons/Icons'
import { IconContainer } from 'browser-components/icons/IconContainer'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'
import { getStringValue } from './utils'
import { StyledValue } from '../DatabaseInfo/styled'
import { EditPropertiesInput } from './styled'
import PropTypes from 'prop-types'

const black = `
  color: #000000;
`
const warningRed = `
  color: #df4d3b;
`
export const BinIconBlack = props => (
  <IconContainer
    activeStyle={props.deleteAction ? warningRed : black}
    inactiveStyle={props.deleteAction ? warningRed : black}
    {...props}
    className='sl-bin'
  />
)
/**
 * Component to display the label of selected node
 * @param {*} props
 */
export const DisplayLabel = props => {
  let { label, labelKey, node, isDeletable } = props

  let previousLabelValue = label

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
      <EditPropertiesInput
        style={{ width: '80%' }}
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
          onConfirmed={() => {
            if (labelState.labelName[labelKey].length > 0) {
              props.editEntityAction(
                {
                  previousLabelValue: previousLabelValue,
                  labelName: labelState.labelName[labelKey],
                  nodeId: node.identity.toInt(),
                  entityType: props.entityType
                },
                'update',
                'nodeLabel'
              )
            } else {
              alert('plzz enter label')
            }
          }}
        />
      ) : null}

      {isDeletable && (
        <span style={{ float: 'right', marginTop: '5px' }}>
          <ConfirmationButton
            requestIcon={<BinIconBlack />}
            confirmIcon={<BinIconBlack deleteAction />}
            onConfirmed={() => {
              props.editEntityAction(
                {
                  labelName: labelState.labelName[labelKey],
                  nodeId: node.identity.toInt(),
                  entityType: props.entityType
                },
                'delete',
                'nodeLabel'
              )
            }}
          />
        </span>
      )}
    </React.Fragment>
  )
}

DisplayLabel.propTypes = {
  labelKey: PropTypes.number,
  label: PropTypes.string,
  editEntityAction: PropTypes.func
}
