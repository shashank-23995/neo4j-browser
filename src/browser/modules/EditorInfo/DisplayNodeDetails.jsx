/*
 * This module maps the props received from EditorInfo and
 * displays the labels and properties of the selected node.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
  Drawer,
  DrawerHeader,
  DrawerSection,
  DrawerSubHeader,
  DrawerBody,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { getStringValue } from './utils'
import * as _ from 'lodash'
import classNames from 'classnames'
import styles from '../DatabaseInfo/style_meta.css'
import { chip, StyledKeyEditor } from './styled'
import { StyledTable, StyledValue } from '../DatabaseInfo/styled'

const createItems = (originalList, RenderType) => {
  let items = [...originalList]

  return items.map((text, index) => {
    return (
      <RenderType.component data-testid='sidebarMetaItem' key={index}>
        {text}
      </RenderType.component>
    )
  })
}
function DisplayNodeDetails (props) {
  let { labels } = props
  let labelItems = <p>There are no labels in database</p>
  if (labels.length) {
    labelItems = createItems(labels, { component: chip })
  }

  let content = <p>There are no properties in database</p>
  if (content) {
    content = _.map(props.selectedItem, (value, key) => {
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
      <Drawer>
        <DrawerHeader>Editor</DrawerHeader>
        <DrawerBody>
          <DrawerSection>
            <DrawerSubHeader>Labels</DrawerSubHeader>
            <DrawerSectionBody
              className={classNames({
                [styles['wrapper']]: true
              })}
            >
              {labelItems}
            </DrawerSectionBody>
          </DrawerSection>
          <DrawerSection>
            <DrawerSubHeader>Properties</DrawerSubHeader>
            {content}
          </DrawerSection>
        </DrawerBody>
      </Drawer>
    </div>
  )
}

DisplayNodeDetails.propTypes = {
  selectedItem: PropTypes.object
}

export default DisplayNodeDetails
