/*
 * Copyright (c) 2002-2019 "Neo4j,"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withBus } from 'react-suber'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerSection,
  DrawerSectionBody,
  DrawerSubHeader
} from 'browser-components/drawer'

export class EditorInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      moreStep: 50,
      labelsMax: 50,
      relationshipsMax: 50,
      propertiesMax: 50
    }
  }
  onMoreClick (type) {
    return num => {
      withBus
      this.setState({ [type + 'Max']: this.state[type + 'Max'] + num })
    }
  }
  render () {
    console.log(this.props.itemEditor.selectedItem)

    return this.props.itemEditor.selectedItem.item.type ? (
      <Drawer id='db-drawer'>
        <DrawerHeader>Editor</DrawerHeader>
        <DrawerBody>
          <DrawerSection>
            <DrawerSectionBody>
              <DrawerSubHeader>
                {
                  <div>
                    {`${this.props.itemEditor.selectedItem.type.toUpperCase()}`}
                    <ul>
                      <li>
                        ID : {`${this.props.itemEditor.selectedItem.item.id}`}
                      </li>
                      <li>
                        Type :{' '}
                        {`${this.props.itemEditor.selectedItem.item.type}`}
                      </li>
                      {this.props.itemEditor.selectedItem.item.properties.map(
                        (item, index) => (
                          <p key={index}>
                            {' '}
                            <li>
                              Properties :
                              <ul>
                                <li>
                                  {item.key} : {item.value}
                                </li>
                              </ul>
                            </li>
                          </p>
                        )
                      )}
                    </ul>
                  </div>
                }
              </DrawerSubHeader>
            </DrawerSectionBody>
          </DrawerSection>
        </DrawerBody>
      </Drawer>
    ) : (
      <Drawer id='db-drawer'>
        <DrawerHeader>Editor</DrawerHeader>
        <DrawerBody>
          <DrawerSection>
            <DrawerSectionBody>
              <DrawerSubHeader>
                {
                  <div>
                    {`${this.props.itemEditor.selectedItem.type.toUpperCase()}`}
                    <ul>
                      <li>
                        ID : {`${this.props.itemEditor.selectedItem.item.id}`}
                      </li>
                      <li>
                        Label :{' '}
                        {`${this.props.itemEditor.selectedItem.item.labels}`}
                      </li>
                      <li>
                        Properties :
                        {this.props.itemEditor.selectedItem.item.properties.map(
                          (item, index) => (
                            <p key={index}>
                              {' '}
                              <ul>
                                <li>
                                  {item.key} : {item.value}
                                </li>
                              </ul>
                            </p>
                          )
                        )}
                      </li>
                    </ul>
                  </div>
                }
              </DrawerSubHeader>
            </DrawerSectionBody>
          </DrawerSection>
        </DrawerBody>
      </Drawer>
    )
  }
}

const mapStateToProps = state => {
  console.log(state)
  return {
    itemEditor: state.itemEditor
  }
}

export default withBus(connect(mapStateToProps)(EditorInfo))
