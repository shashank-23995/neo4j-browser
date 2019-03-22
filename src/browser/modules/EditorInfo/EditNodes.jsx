/*
 * This program depicts the behaviour of the edit drawer that displays
 * and edits the properties selected from the canvas. As this is used
 * for handling all the rendering and used as component in EditorInfo.
 * All the props are coming from the parent state of EditorInfo and
 * are passed on to the EditProperties component to render properties
 */
import React, { Component } from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerSection,
  DrawerSectionBody,
  DrawerSubHeader
} from 'browser-components/drawer'
import EditProperties from './EditProperties'
import * as _ from 'lodash'

export class EditNodes extends Component {
  /**
   * this method toggles the edit button
   *
   */
  handleEdit = () => {
    this.props.handleEdit()
  }

  /**
   * method for editing selected item
   * passes the the object of properties as param to the
   * function editSelectedItem(item) as props to parent
   * componet
   *  */

  editSelectedItem = () => {
    // let editedItem = _.cloneDeep(this.props.neo4jItem);
    this.props.editSelectedItem()
  }

  /**
   * handles the changes when edited and change the state by invoking
   * parent function setParentComponentState,
   * handleChange function has two params "key" and "e" where key is the index of
   * properties key and e is the event for the handlechange
   * */

  handleChange = (key, e) => {
    let newProperties = _.cloneDeep(this.props.properties.properties._fields[0])
    for (const i in newProperties) {
      if (key in newProperties[i]) {
        let obj = { [key]: e.target.value }
        Object.assign(newProperties[i], obj)
      }
    }
    this.props.setParentComponentState(newProperties)
  }

  render () {
    let content = null
    if (
      this.props.properties_state_data.neo4jItem &&
      this.props.properties_state_data.selectedItem.type !== 'canvas'
    ) {
      content = (
        <div>
          {`${this.props.properties_state_data.neo4jItem._fields[0].labels}`}
          <hr />
          <ul>
            <li>
              id:
              {`${
                this.props.properties_state_data.neo4jItem._fields[0].identity
              }`}
            </li>
            <li>
              Type : {`${this.props.properties_state_data.selectedItem.type}`}
            </li>
            <hr />
            <li>
              Properties :{' '}
              <EditProperties
                properties={this.props.properties}
                handleChange={this.handleChange}
                disabled={this.props.properties.disabled}
              />
            </li>
          </ul>
          <hr />

          <div
            data-testid='sidebarMetaItem'
            className='styled__chip-sc-1srdf8s-0 styled__StyledLabel-sc-1srdf8s-1 eGKpnH'
            onClick={() => {
              this.handleEdit()
            }}
          >
            {this.props.properties.disabled ? 'Edit' : 'Done'}
          </div>
          <div
            data-testid='sidebarMetaItem'
            className='styled__chip-sc-1srdf8s-0 styled__StyledLabel-sc-1srdf8s-1 eGKpnH'
            onClick={this.editSelectedItem}
          >
            update
          </div>
        </div>
      )
    }
    return (
      <Drawer id='db-drawer'>
        <DrawerHeader>Editor</DrawerHeader>
        <DrawerBody>
          <DrawerSection>
            <DrawerSectionBody>
              <DrawerSubHeader>{content}</DrawerSubHeader>
            </DrawerSectionBody>
          </DrawerSection>
        </DrawerBody>
      </Drawer>
    )
  }
}
