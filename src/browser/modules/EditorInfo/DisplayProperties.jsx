import React, { useState } from 'react'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import PropTypes from 'prop-types'
import Property from './Property'
import { ExpansionPanel } from './ExpansionPanel'
import { BinIconBlack } from './DisplayLabel'

/**
 * Component to display the properties of selected node
 * @param {*} props
 */

export const DisplayProperties = props => {
  const [open, setOpen] = useState(false)
  let { displayPropertiesStateKey } = props

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
      open={open}
      setOpen={setOpen}
    >
      <Property
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
