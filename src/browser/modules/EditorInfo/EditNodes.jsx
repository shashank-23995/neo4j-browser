import React, { Component } from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerSection,
  DrawerSectionBody,
  DrawerSubHeader
} from 'browser-components/drawer'

export class EditNodes extends Component {
  handleEdit = () => {
    this.props.handleEdit()
  }
  editSelectedItem = item => {
    this.props.editSelectedItem(item)
  }

  handleChange = (key, e) => {
    let newProperties = [...this.props.properties.properties]
    for (let i in newProperties) {
      if (newProperties[i].key === key) {
        newProperties[i].value = e.target.value
      }
    }
    this.setState({ properties: newProperties })
    console.log(this.state)
  }

  render () {
    // console.log(this.props.p);
    let props_p = this.props.properties.properties
    let propes = null
    console.log(this.props.properties)
    if (this.props.properties.properties) {
      propes = props_p.map((item, index) => (
        <p key={index}>
          {' '}
          <li>
            {item.key} :{' '}
            {this.props.properties.disabled ? (
              item.value
            ) : (
              <input
                id='properties'
                style={{ color: 'black' }}
                type='text'
                value={item.value}
                onChange={e => {
                  this.handleChange(item.key, e)
                }}
              />
            )}
          </li>
        </p>
      ))
    }

    let content = null
    if (
      this.props.properties_state_data.selectedItem &&
      this.props.properties_state_data.selectedItem.type !== 'canvas'
    ) {
      content = (
        <div>
          {`${this.props.properties_state_data.selectedItem.type.toUpperCase()}`}
          <ul>
            <li>
              ID : {`${this.props.properties_state_data.selectedItem.item.id}`}
            </li>
            <li>
              Type : {`${this.props.properties_state_data.selectedItem.type}`}
            </li>
            <li>Properties : {propes}</li>
          </ul>

          <div
            data-testid='sidebarMetaItem'
            class='styled__chip-sc-1srdf8s-0 styled__StyledLabel-sc-1srdf8s-1 eGKpnH'
            onClick={() => {
              console.log('####')
              this.handleEdit()
            }}
          >
            {this.props.properties.disabled ? 'Edit' : 'Done'}
          </div>
          <div
            data-testid='sidebarMetaItem'
            class='styled__chip-sc-1srdf8s-0 styled__StyledLabel-sc-1srdf8s-1 eGKpnH'
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
