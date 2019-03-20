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
      disabled: true,
      properties: props.itemEditor.neo4jItem
        ? _.cloneDeep(props.itemEditor.neo4jItem._fields)
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
      properties: _.cloneDeep(nextProps.itemEditor.neo4jItem)
    })
  }

  setParentComponentState = newProperties => {
    let newstate = _.cloneDeep(this.state)

    Object.keys(newstate).forEach(function (k, i) {
      if (newstate[k]) {
        newstate[k]._fields[0] = newProperties
      }
    })
    this.setState(newstate)
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
            selectedItem={this.props.itemEditor.selectedItem}
            setParentComponentState={this.setParentComponentState}
            neo4jItem={this.props.itemEditor.neo4jItem}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    itemEditor: state.itemEditor,
    neo4jItem: state.itemEditor.neo4jItem,
    requests: state.requests
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
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
