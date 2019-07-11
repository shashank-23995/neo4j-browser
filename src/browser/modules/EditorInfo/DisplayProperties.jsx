import React, { useState, useEffect } from 'react'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'
import { getStringValue } from './utils'
import { BinIcon, TickMarkIcon } from 'browser-components/icons/Icons'
import { StyledValue } from '../DatabaseInfo/styled'
import { StyledKeyEditor, EditPropertiesInput } from './styled'
import PropTypes from 'prop-types'

/**
 * Component to display the properties of selected node
 * @param {*} props
 */

export const DisplayProperties = props => {
  let { displayPropertiesStateKey, value } = props
  const initState = {
    properties: { [displayPropertiesStateKey]: value },
    requested: false
  }

  const [propertiesState, updatePropertiesState] = useState(initState)

  /**
   * useEffect accepts a function that updates the state whenever the props change
   * @param updatePropertiesState — Function that returns an updated state everytime props change
   * @param deps —  Will activate when the props change
   */
  useEffect(
    () => {
      updatePropertiesState({
        properties: { [displayPropertiesStateKey]: value },
        requested: false
      })
    },
    [value]
  )

  const handleChange = (displayPropertiesStateKey, e) => {
    let newState = _.cloneDeep(propertiesState)
    updatePropertiesState({
      ...newState,
      properties: {
        ...newState.properties,
        [displayPropertiesStateKey]: getStringValue(e.target.value)
      },
      requested: true
    })
  }

  const onCanceled = () => {
    updatePropertiesState({
      properties: { [displayPropertiesStateKey]: value },
      requested: false
    })
  }

  return (
    <div>
      <StyledKeyEditor>{displayPropertiesStateKey}:</StyledKeyEditor>
      <StyledValue data-testid='user-details-username'>
        <EditPropertiesInput
          id='item'
          type='text'
          onChange={e => {
            handleChange(displayPropertiesStateKey, e)
          }}
          value={getStringValue(
            propertiesState.properties[displayPropertiesStateKey]
          )}
        />

        {propertiesState.requested ? (
          <PartialConfirmationButtons
            icon={<TickMarkIcon />}
            onCanceled={onCanceled}
          />
        ) : null}

        <ConfirmationButton
          requestIcon={<BinIcon />}
          confirmIcon={<BinIcon deleteAction />}
          onConfirmed={() => {
            props.editEntityAction(
              {
                [props.node ? 'nodeId' : 'relationshipId']: props.node
                  ? props.node.identity.toInt()
                  : props.relationship.identity.toInt(),
                [props.node ? 'label' : 'type']: props.node
                  ? props.node.labels[0]
                  : props.relationship.type,
                propertyKey: displayPropertiesStateKey
              },
              'delete',
              props.node ? 'nodeProperty' : 'relationshipProperty'
            )
          }}
        />
      </StyledValue>
    </div>
  )
}

DisplayProperties.propTypes = {
  displayPropertiesStateKey: PropTypes.string,
  value: PropTypes.any,
  node: PropTypes.object,
  relationship: PropTypes.object,
  editEntityAction: PropTypes.func
}
