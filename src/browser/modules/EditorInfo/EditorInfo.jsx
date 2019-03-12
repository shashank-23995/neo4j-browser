/*
 * This program depicts the behaviour of the edit drawer that displays
 * and edits the properties selected from the canvas.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withBus } from 'react-suber'
import * as itemEditorActions from 'shared/modules/itemEditor/itemEditorDuck'
import * as _ from 'lodash'
import { EditNodes } from './EditNodes'

export class EditorInfo extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isEditing: false,
      disabled: true,
      properties: props.itemEditor.selectedItem
        ? _.cloneDeep(props.itemEditor.selectedItem.item.properties)
        : undefined
    }
  }

  /**
   * this method is used to dispatch action in reducer
   * by passing the param (object properties of selected Items)
   */

  editSelectedItem = item => {
    this.props.editSelectedItem(item)
  }

  /**
   *
   * Changes the props to local state
   */
  componentWillReceiveProps (nextProps) {
    this.setState({
      properties: _.cloneDeep(nextProps.itemEditor.selectedItem.item.properties)
    })

    if (
      !this.props.itemEditor.selectedItem ||
      (nextProps.itemEditor.selectedItem.item.id &&
        nextProps.itemEditor.selectedItem.item.id !==
          this.props.itemEditor.selectedItem.item.id)
    ) {
      this.props.fetchData(nextProps.itemEditor.selectedItem.item.id)
    }
  }

  /**
   *
   * Toggle the disable state to handle
   * the edit button
   */
  handleEdit = () => {
    this.setState({
      disabled: !this.state.disabled
    })
  }

  render () {
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
    itemEditor: state.itemEditor,
    requests: state.requests
  }
}

const mapDispatchToProps = (_, ownProps) => {
  return {
    // editSelectedItem: item => {
    //   dispatch(itemEditorActions.editSelectedItem(item))
    // },
    fetchData: id => {
      const action = itemEditorActions.fetchData(id)
      ownProps.bus.send(action.type, action)
    }
  }
}

export default withBus(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditorInfo)
)
