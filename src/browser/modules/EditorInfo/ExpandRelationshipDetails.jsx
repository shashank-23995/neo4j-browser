import React from 'react'
import PropTypes from 'prop-types'
import { PropertiesSection } from './DisplayNodeDetails'
import { DrawerSubHeader } from 'browser-components/drawer/index'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import { BinIcon } from 'browser-components/icons/Icons'
import {
  StyledList,
  StyledListHeaderItem,
  StyledFavFolderButtonSpan
} from '../Sidebar/styled'

import DisplayRelationshipType from './DisplayRelationshipType'
import DisplayRelationshipDirection from './DisplayRelationshipDirection'
import { ExpansionPanel } from './ExpansionPanel'

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
    </StyledFavFolderButtonSpan>
  )

  return (
    <div>
      <StyledList>
        <StyledListHeaderItem>
          <ExpansionPanel title={title} panelActions={() => panelActions}>
            <DrawerSubHeader>Relationship Type</DrawerSubHeader>

            <DisplayRelationshipType
              {...props}
              relationshipType={props.value.segments[0].relationship.type}
              relationshipId={props.value.segments[0].relationship.identity.toInt()}
            />

            <DrawerSubHeader>Relationship Direction</DrawerSubHeader>
            <DisplayRelationshipDirection
              {...props}
              relationshipType={props.value.segments[0].relationship.type}
              relationshipId={props.value.segments[0].relationship.identity.toInt()}
            />

            {props.value.segments.map((item, index) => (
              <PropertiesSection
                properties={
                  item.relationship ? item.relationship.properties : null
                }
                {...props}
                entityType='relationship'
                editEntityAction={props.editEntityAction}
                relationship={props.value.segments[0].relationship}
                relationshipId={props.value.segments[0].relationship.identity.toInt()}
              />
            ))}
          </ExpansionPanel>
        </StyledListHeaderItem>
      </StyledList>
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
