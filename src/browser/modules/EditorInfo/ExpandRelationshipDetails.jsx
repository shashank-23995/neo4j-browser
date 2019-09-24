import React from 'react'
import PropTypes from 'prop-types'
import { PropertiesSection } from './DisplayNodeDetails'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import { StyledFavFolderButtonSpan } from '../Sidebar/styled'

import DisplayRelationshipType from './DisplayRelationshipType'
import { ExpansionPanel } from './ExpansionPanel'
import { BinIconBlack } from './DisplayLabel'

/**
 * Component to Expand Relationship Details
 * @param {*} props
 */
export const ExpandRelationshipDetails = props => {
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
  const panelActions = (
    <StyledFavFolderButtonSpan>
      <ConfirmationButton
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
    </StyledFavFolderButtonSpan>
  )

  return (
    <div
      style={{
        marginLeft: 1,
        marginRight: 1,
        marginBottom: 5,
        backgroundColor: '#efeff4',
        padding: 5,
        borderRadius: 5
      }}
    >
      <ExpansionPanel title={title} panelActions={() => panelActions}>
        <DisplayRelationshipType
          {...props}
          relationshipType={props.value.segments[0].relationship.type}
          relationshipId={props.value.segments[0].relationship.identity.toInt()}
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
