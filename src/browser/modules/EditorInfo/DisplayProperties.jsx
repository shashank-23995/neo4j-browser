import React, { useState, useEffect } from 'react'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import { getStringValue } from './utils'
import { BinIcon } from 'browser-components/icons/Icons'
import PropTypes from 'prop-types'
import AddProperty from './AddProperty'

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
      <AddProperty
        ToDisplay='view'
        properties={propertiesState.properties}
        editEntityAction={props.editEntityAction}
        nodeId={props.node.identity.toInt()}
      />

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
