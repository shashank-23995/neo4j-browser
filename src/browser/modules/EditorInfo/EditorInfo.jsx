import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withBus } from 'react-suber'
import DisplayNodeDetails from './DisplayNodeDetails'
import DisplayRelationshipDetails from './DisplayRelationshipDetails'
import {
  Drawer,
  DrawerHeader,
  DrawerBody
} from 'browser-components/drawer/index'

/**
 * The Editor drawer.
 * Based on selection, either provides node editor or relationship editor.
 * If nothing is selected then it prompts to do so.
 */
export class EditorInfo extends Component {
  render () {
    return (
      <div>
        <Drawer>
          <DrawerHeader>Editor</DrawerHeader>
          <DrawerBody>
            {this.props.selectedItem ? (
              this.props.entityType === 'node' ? (
                <DisplayNodeDetails node={this.props.selectedItem} />
              ) : (
                <div>
                  <DisplayRelationshipDetails
                    relationship={this.props.selectedItem}
                  />
                </div>
              )
            ) : null}
          </DrawerBody>
        </Drawer>
      </div>
    )
  }
}

/**
 * Get selected item from state.
 *
 * FIXME move it to selectors (Reselect)
 *
 * @param {*} state
 * @returns Either Node or Relationship or null
 */
const getSelectedItem = state => {
  if (
    state.itemEditor.entityType === 'node' &&
    state.itemEditor.record &&
    state.itemEditor.record.has &&
    state.itemEditor.record.has('a')
  ) {
    return (
      state.itemEditor.record &&
      state.itemEditor.record.get &&
      state.itemEditor.record.get('a')
    )
  } else if (
    state.itemEditor.entityType === 'relationship' &&
    state.itemEditor.record &&
    state.itemEditor.record.has &&
    state.itemEditor.record.has('r')
  ) {
    return (
      state.itemEditor.record &&
      state.itemEditor.record.get &&
      state.itemEditor.record.get('r')
    )
  }
  return null
}

const mapStateToProps = state => {
  return {
    selectedItem: getSelectedItem(state),
    entityType: state.itemEditor.entityType
  }
}

export default withBus(connect(mapStateToProps)(EditorInfo))
