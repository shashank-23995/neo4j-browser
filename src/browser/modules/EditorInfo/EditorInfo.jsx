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
import * as itemEditorActions from 'shared/modules/itemEditor/itemEditorDuck'
import * as _ from 'lodash'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerSection,
  DrawerSectionBody,
  DrawerSubHeader
} from 'browser-components/drawer'
import { EditProperties } from './EditProperties'
import { EditNodes } from './EditNodes'

export class EditorInfo extends Component {
  constructor (props) {
    console.log('from constructor', props)
    super(props)

    this.state = {
      isEditing: false,
      disabled: true,
      properties: props.itemEditor.selectedItem
        ? _.cloneDeep(props.itemEditor.selectedItem.item.properties)
        : undefined
    }
    console.log(this.state)
  }

  editSelectedItem = item => {
    console.log('helloo', this.props)
    this.props.editSelectedItem(item)
  }

  componentWillReceiveProps (nextProps) {
    // nextProps will receive all the props of the store....
    this.setState({
      // type: nextProps.itemEditor.selectedItem.type,
      properties: _.cloneDeep(nextProps.itemEditor.selectedItem.item.properties)
    })
  }

  handleEdit = () => {
    this.setState({
      'disabled': !this.state.disabled
    })
  }

  toggleEdit () {
    this.setState({ isEditing: !this.state.isEditing })
  }

  render () {
    console.log(this.state)
    if (this.state.isEditing) {
      return <div>edit</div>
    }
    return (
      <div>
        <div>
          <EditNodes
            properties_state_data={this.props.itemEditor}
            properties={this.state}
            handleEdit={this.handleEdit}
            editSelectedItem={this.editSelectedItem}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    itemEditor: state.itemEditor
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editSelectedItem: item => {
      dispatch(itemEditorActions.editSelectedItem(item))
    }
  }
}

export default withBus(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditorInfo)
)
