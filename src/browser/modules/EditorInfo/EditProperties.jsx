import React, { Component } from 'react'

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerSection,
  DrawerSectionBody,
  DrawerSubHeader
} from 'browser-components/drawer'

export class EditProperties extends Component {
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
    let pp = this.props.properties.properties
    console.log(pp)
    let propes = null
    console.log(this.props.properties)
    if (this.props.properties.properties) {
      propes = pp.map((item, index) => (
        <p key={index}>
          {' '}
          <li>
            {item.key} :{' '}
            {this.props.disabled ? (
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

    return (
      <Drawer id='db-drawer'>
        <DrawerHeader>Editor</DrawerHeader>
        <DrawerBody>
          <DrawerSection>
            <DrawerSectionBody>
              <DrawerSubHeader>{propes}</DrawerSubHeader>
            </DrawerSectionBody>
          </DrawerSection>
        </DrawerBody>
      </Drawer>
    )
  }
}
