import React, { useState, useEffect } from 'react'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import { getStringValue } from './utils'
import PropTypes from 'prop-types'
import AddProperty from './AddProperty'
import { ExpansionPanel } from './ExpansionPanel'
import { BinIconBlack } from './DisplayLabel'

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

  const panelActions = (
    <ConfirmationButton
      requestIcon={<BinIconBlack />}
      confirmIcon={<BinIconBlack deleteAction />}
      onConfirmed={() => {
        props.editEntityAction(
          {
            [props.node ? 'nodeId' : 'relationshipId']: props.node
              ? props.node.identity.toInt()
              : props.relationship.identity.toInt(),
            [props.node ? 'label' : 'type']: props.node
              ? props.node.labels[0]
              : props.relationship.type,
            propertyKey: displayPropertiesStateKey,
            selectedNodeId: props.node
              ? props.node.identity.toInt()
              : props.selectedNodeId
          },
          'delete',
          props.node ? 'nodeProperty' : 'relationshipProperty'
        )
      }}
    />
  )

  return (
    <ExpansionPanel
      title={`${props.displayPropertiesStateKey}: ${props.value}`}
      panelActions={() => panelActions}
    >
      <AddProperty
        ToDisplay='view'
        p={{ key: props.displayPropertiesStateKey, value: props.value }}
        editEntityAction={props.editEntityAction}
        nodeId={
          (props.node && props.node.identity.toInt()) || props.selectedNodeId
        }
        relationshipId={props.relationshipId ? props.relationshipId : null}
      />
    </ExpansionPanel>
  )
}

DisplayProperties.propTypes = {
  displayPropertiesStateKey: PropTypes.string,
  value: PropTypes.any,
  node: PropTypes.object,
  relationship: PropTypes.object,
  editEntityAction: PropTypes.func
}
