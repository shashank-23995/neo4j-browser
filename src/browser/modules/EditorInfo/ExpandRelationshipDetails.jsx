import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { PropertiesSection } from './DisplayNodeDetails'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import DisplayRelationship from './DisplayRelationship'
import { ExpansionPanel } from './ExpansionPanel'
import { BinIconBlack } from './DisplayLabel'
import { BinIcon } from 'browser-components/icons/Icons'
import { ConfirmationButtonBlack } from './ConfirmationButtonBlack'

/**
 * Component to Expand Relationship Details
 * @param {*} props
 */
export const ExpandRelationshipDetails = props => {
  const [open, setOpen] = useState(false)
  let title = ''
  if (props.relationshipEndpoint === 'from') {
    title = `-- ${props.value.segments[0].relationship.type} --> 
    ${Object.values(props.value.end.properties)[0] ||
      props.value.end.identity.toInt()}`
  } else if (props.relationshipEndpoint === 'to') {
    title = `<--  ${
      props.value.segments[0].relationship.type
    }  -- ${Object.values(props.value.end.properties)[0] ||
      props.value.end.identity.toInt()}`
  }
  const panelActions = open ? (
    <ConfirmationButton
      requestIcon={<BinIcon />}
      confirmIcon={<BinIcon deleteAction />}
      onConfirmed={() => {
        // delete the relationship based on ID
        props.editEntityAction(
          {
            relationshipId: props.value.segments[0].relationship.identity.toInt(),
            nodeId: props.selectedNodeId
          },
          'delete',
          'relationship'
        )
      }}
    />
  ) : (
    <ConfirmationButtonBlack
      requestIcon={<BinIconBlack />}
      confirmIcon={<BinIconBlack deleteAction />}
      onConfirmed={() => {
        // delete the relationship based on ID
        props.editEntityAction(
          {
            relationshipId: props.value.segments[0].relationship.identity.toInt(),
            nodeId: props.selectedNodeId
          },
          'delete',
          'relationship'
        )
      }}
    />
  )

  return (
    <div
      style={{
        marginLeft: 1,
        marginRight: 1,
        marginBottom: 5,
        borderRadius: 5
      }}
    >
      <ExpansionPanel
        title={title}
        panelActions={() => panelActions}
        open={open}
        setOpen={setOpen}
      >
        <DisplayRelationship
          {...props}
          relationshipType={props.value.segments[0].relationship.type}
          relationshipId={props.value.segments[0].relationship.identity.toInt()}
          open={open}
          setOpen={setOpen}
        />
        {props.value.segments.map((item, index) => (
          <PropertiesSection
            key={index}
            properties={item.relationship ? item.relationship.properties : null}
            {...props}
            entityType='relationship'
            editEntityAction={props.editEntityAction}
            relationship={props.value.segments[0].relationship}
            relationshipId={props.value.segments[0].relationship.identity.toInt()}
          />
        ))}
      </ExpansionPanel>
    </div>
  )
}

ExpandRelationshipDetails.propTypes = {
  value: PropTypes.object,
  entityType: PropTypes.string,
  relationshipEndpoint: PropTypes.string,
  editEntityAction: PropTypes.func,
  selectedNodeId: PropTypes.number
}
