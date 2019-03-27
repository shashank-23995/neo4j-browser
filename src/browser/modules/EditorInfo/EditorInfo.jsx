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
      item: props.itemEditor.neo4jItem
        ? _.cloneDeep(props.itemEditor.neo4jItem)
        : undefined
    }
  }

  /**
   * this method is used to dispatch action in reducer
   */

  setEditSelectedItem = () => {
    this.props.setEditSelectedItem(this.state.item)
  }

  /**
   *
   * Changes the props to local state
   */
  componentWillReceiveProps (nextProps) {
    this.setState({
      item: _.cloneDeep(nextProps.itemEditor.neo4jItem),
      disabled: true
    })
  }

  /**
   *  This function is used to set item of the state
   * when changes are done while  child component changes data
   *
   */

  setParentItemState = newProperties => {
    let newstate = _.cloneDeep(this.state)

    Object.keys(newstate).forEach(function (k) {
      if (newstate[k]) {
        newstate[k]._fields[0] = newProperties
      }
    })
    this.setState(newstate)
  }

  /**
   *  This function is used to set new added or deleted propeties
   * to the component state.
   *
   */

  setNewPropsToState = newProperties => {
    let newstate = _.cloneDeep(this.state)
    newstate.item._fields[0].properties = newProperties
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
            item={this.state}
            handleEdit={this.handleEdit}
            setEditSelectedItem={this.setEditSelectedItem}
            setParentItemState={this.setParentItemState}
            setNewPropsToState={this.setNewPropsToState}
            deleteProperty={this.props.deleteProperty}
            invertDelete={this.props.invertDelete}
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
const mapDispatchToProps = dispatch => {
  return {
    setEditSelectedItem: item => {
      dispatch(itemEditorActions.setEditSelectedItem(item))
    },
    deleteProperty: property => {
      dispatch(itemEditorActions.deleteProperty(property))
    },
    invertDelete: property => {
      dispatch(itemEditorActions.invertDelete(property))
    }
  }
}

export default withBus(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditorInfo)
)
