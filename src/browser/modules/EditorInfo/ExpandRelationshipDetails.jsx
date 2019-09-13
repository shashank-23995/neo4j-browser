import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { PropertiesSection } from './DisplayNodeDetails'
import {
  DrawerSubHeader,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import {
  BinIcon,
  ExpandMenuIcon,
  CollapseMenuIcon
} from 'browser-components/icons/Icons'
import {
  FoldersButton,
  StyledList,
  StyledListHeaderItem,
  StyledFavFolderButtonSpan,
  FolderButtonContainer,
  StyledFolderLabel
} from '../Sidebar/styled'

import classNames from 'classnames'
import styles from '../DatabaseInfo/style_meta.css'
import DisplayRelationshipType from './DisplayRelationshipType'
import DisplayRelationshipDirection from './DisplayRelationshipDirection'

/**
 * Component to Expand Relationship Details
 * @param {*} props
 */
export const ExpandRelationshipDetails = props => {
  const [active, setFlag] = useState(false)

  return (
    <div>
      <StyledList>
        <StyledListHeaderItem>
          <StyledFolderLabel>
            <DrawerSectionBody
              className={classNames({
                [styles['wrapper']]: true
              })}
            >
              {props.relationshipEndpoint === 'from' &&
                `-- ${props.value.segments[0].relationship.type} --> 
                  ${Object.values(props.value.end.properties)[0] ||
                    props.value.end.identity.toInt()}`}
              {props.relationshipEndpoint === 'to' &&
                `<-- 
                  ${
    props.value.segments[0].relationship.type
    }  -- ${Object.values(props.value.end.properties)[0] ||
                  props.value.end.identity.toInt()}`}
            </DrawerSectionBody>
          </StyledFolderLabel>
          <FolderButtonContainer>
            <FoldersButton onClick={() => setFlag(!active)}>
              {active === true ? <CollapseMenuIcon /> : <ExpandMenuIcon />}
            </FoldersButton>
            &nbsp;
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
          </FolderButtonContainer>
          {active === true && (
            <div style={{ marginLeft: 30 }}>
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
                  relationshipId={props.value.segments[0].relationship.identity.toInt()}
                />
              ))}
            </div>
          )}
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
