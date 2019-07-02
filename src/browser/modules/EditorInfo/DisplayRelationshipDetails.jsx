/*
 * This module maps the props received from EditorInfo and
 * displays the properties,type and entity type of the selected relationship.
 */

import React from 'react'
import {
  Drawer,
  DrawerHeader,
  DrawerSection,
  DrawerSubHeader,
  DrawerSectionBody,
  DrawerBody
} from 'browser-components/drawer/index'
import { getStringValue } from './utils'
import * as _ from 'lodash'
import { StyledTable, StyledValue } from '../DatabaseInfo/styled'
import { StyledKeyEditor } from './styled'

function DisplayRelationshipDetails (props) {
  let content = <p>There are no properties in database</p>
  if (content) {
    content = _.map(props.relationshipProperties, (value, key) => {
      return (
        <div key={key}>
          <StyledTable>
            <tbody>
              <tr>
                <StyledKeyEditor>{key}:</StyledKeyEditor>
                <StyledValue data-testid='user-details-username'>
                  {getStringValue(value)}
                </StyledValue>
              </tr>
            </tbody>
          </StyledTable>
        </div>
      )
    })
  }
  return (
    <div>
      <DrawerSection>
        <DrawerSubHeader>Entity</DrawerSubHeader>
        <DrawerSectionBody>{props.entityType}</DrawerSectionBody>
      </DrawerSection>
      <DrawerSection>
        <DrawerSubHeader>Relationship Types</DrawerSubHeader>
        <DrawerSectionBody>{props.relationshipType}</DrawerSectionBody>
      </DrawerSection>
    </div>
  )
}

export default DisplayRelationshipDetails
