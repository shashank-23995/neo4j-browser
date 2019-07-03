import React from 'react'
import {
  DrawerSection,
  DrawerSubHeader,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import PropTypes from 'prop-types'
import { PropertiesSection, EntitySection } from './DisplayNodeDetails'

/**
 * Relation ship type section
 * @param {*} props
 */
const RelationShipTypeSection = props => {
  const { relationship } = props
  return (
    <DrawerSection>
      <DrawerSubHeader>Relationship Type</DrawerSubHeader>
      <DrawerSectionBody>{relationship.type}</DrawerSectionBody>
    </DrawerSection>
  )
}

RelationShipTypeSection.propTypes = {
  relationship: PropTypes.object
}

/**
 * Relationship editor
 * @param {*} props
 */
function DisplayRelationshipDetails (props) {
  return (
    <div>
      <EntitySection type='Relationship' />
      <RelationShipTypeSection {...props} />
      <PropertiesSection
        properties={props.relationship ? props.relationship.properties : null}
        entityType='relationship'
      />
    </div>
  )
}

DisplayRelationshipDetails.propTypes = {
  relationship: PropTypes.object
}

export default DisplayRelationshipDetails
