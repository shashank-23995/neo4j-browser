/*
 * This program depicts the behaviour of the edit drawer that displays
 * and edits the properties selected from the canvas. As this is used
 * for handling all the rendering and used as component in EditorInfo.
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
import AddProperty from './AddProperty'

export class EditNodes extends Component {
  state = {
    addedProps: {
      key: '',
      value: ''
    }
  }

  /**
   * this method toggles the edit button
   *
   */

  handleEdit = () => {
    this.props.handleEdit()
  }

  /**
   * method for editing selected item
   * function setEditSelectedItem() as props to parent
   * componet
   *
   */

  setEditSelectedItem = () => {
    this.props.setEditSelectedItem()
  }
  /** the function is used for check for typeof properties and allow user to enter only valid property type */

  handleChange = (key, e, type) => {
    this.props.changePropertyValue(key, e.target.value, type)
  }

  /**
   * new property is added to the items property in state and
   * function is used for invoking the parent function to
   * setState.
   * */

  saveNewProperty = () => {
    let newProperties = _.cloneDeep(
      this.props.properties_state_data.neo4jItem._fields[0].properties
    )
    let obj = { [this.state.addedProps.key]: this.state.addedProps.value }
    _.assign(newProperties, obj)
    this.props.setNewPropsToState(newProperties)
    // this.props.closeAddProperty();
  }

  deleteProperties = (key, e) => {
    this.props.deletedProperty(key)
  }

  /**
   * this function is involed on onChange event of child input
   * component and values are updated to component state
   * */

  addProperty = e => {
    let newstate = _.assign(this.state)
    for (const i in newstate) {
      if (i === 'addedProps') {
        newstate[i][e.target.id] = e.target.value
      }
    }
    this.setState(newstate)
  }

  render () {
    let content = null
    if (
      this.props.properties_state_data.neo4jItem &&
      this.props.properties_state_data.selectedItem.type !== 'canvas'
    ) {
      content = (
        <div>
          {`${this.props.properties_state_data.selectedItem.type.toUpperCase()}`}
          <hr />
          <ul>
            <li>
              Type : {`${this.props.properties_state_data.selectedItem.type}`}
            </li>
            <hr />
            <div>
              <li
                style={{
                  float: 'left'
                }}
              >
                Properties :
              </li>
              <div
                data-testid='sidebarMetaItem'
                className='styled__chip-sc-1srdf8s-0 styled__StyledLabel-sc-1srdf8s-1 eGKpnH'
                style={{
                  width: '100px',
                  height: '30px',
                  float: 'right'
                }}
                onClick={() => {
                  this.props.showAddProperty()
                }}
              >
                <p
                  style={{
                    marginTop: '-5px',
                    marginLeft: '5px'
                  }}
                >
                  Add Property
                </p>
              </div>
            </div>
            <br />
            {this.props.item.toggleAddProp ? (
              <AddProperty
                closeAddProperty={this.props.closeAddProperty}
                addProperty={this.addProperty}
                saveNewProperty={this.saveNewProperty}
              />
            ) : null}
            <div>
              <EditProperties
                deletedProperties={
                  this.props.properties_state_data.deletedProperties
                }
                itemProperties={
                  this.props.properties_state_data.neo4jItem._fields[0]
                    .properties
                }
                item={this.props.item}
                handleChange={this.handleChange}
                disabled={this.props.item.disabled}
                deleteProperty={this.props.deleteProperty}
                invertDelete={this.props.invertDelete}
              />
            </div>
            <hr />
          </ul>
          <div
            data-testid='sidebarMetaItem'
            className='styled__chip-sc-1srdf8s-0 styled__StyledLabel-sc-1srdf8s-1 eGKpnH'
            onClick={() => {
              this.handleEdit()
            }}
          >
            {this.props.item.disabled ? 'Edit' : 'Done'}
          </div>
          <div
            data-testid='sidebarMetaItem'
            className='styled__chip-sc-1srdf8s-0 styled__StyledLabel-sc-1srdf8s-1 eGKpnH'
            onClick={this.setEditSelectedItem}
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
