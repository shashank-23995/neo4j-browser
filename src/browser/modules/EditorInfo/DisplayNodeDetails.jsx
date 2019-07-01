/*
 * This module maps the props received from EditorInfo and
 * displays the properties of the selected node.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
  Drawer,
  DrawerHeader,
  DrawerSection,
  DrawerSubHeader,
  DrawerBody
} from 'browser-components/drawer/index'
import { getStringValue } from './utils'
import * as _ from 'lodash'

function DisplayNodeDetails (props) {
  let content = null
  content = _.map(props.selectedItem, (value, key) => {
    return (
      <div key={key}>
        {key}: {getStringValue(value)}
      </div>
    )
  })
  return (
    <div>
      <Drawer>
        <DrawerHeader>Editor</DrawerHeader>
        <DrawerBody>
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
