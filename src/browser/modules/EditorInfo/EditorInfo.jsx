import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withBus } from 'react-suber'
import DisplayNodeDetails from './DisplayNodeDetails'
import {
  Drawer,
  DrawerHeader,
  DrawerBody
} from 'browser-components/drawer/index'
import { getSelectedItem } from 'shared/modules/selectors/itemEditor'
import AddNode from './AddNode'
import * as itemEditorActions from 'shared/modules/itemEditor/itemEditorDuck'
import { CONNECTED_STATE } from 'shared/modules/connections/connectionsDuck'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import { BinIcon } from 'browser-components/icons/Icons'
/**
 * The Editor drawer.
 * Based on selection, either provides node editor or relationship editor.
 * If nothing is selected then it prompts to do so.
 */
export class EditorInfo extends Component {
  render(props) {
    return (
      <div>
        <Drawer>
          <DrawerHeader>
            Editor
            {this.props.neo4jConnectionState === CONNECTED_STATE ? (
              <>
                {this.props.selectedItem ? (
                  <ConfirmationButton
                    requestIcon={<BinIcon />}
                    confirmIcon={<BinIcon deleteAction />}
                    onConfirmed={() => {
                      this.props.editEntityAction(
                        {
                          nodeId: this.props.selectedItem.node.identity.toInt(),
                          firstLabel: this.props.selectedItem.node.labels[0]
                        },
                        'delete',
                        'node'
                      )
                    }}
                  />
                ) : (
                  <AddNode editEntityAction={this.props.editEntityAction} />
                )}
              </>
            ) : null}
          </DrawerHeader>

          <DrawerBody>
            {this.props.selectedItem ? (
              this.props.entityType === 'node' ? (
                <DisplayNodeDetails
                  editEntityAction={this.props.editEntityAction}
                  node={this.props.selectedItem.node}
                  fromSelectedNode={this.props.selectedItem.fromSelectedNode}
                  toSelectedNode={this.props.selectedItem.toSelectedNode}
                  entityType={this.props.entityType}
                  fetchSelectOptions={this.props.fetchSelectOptions}
                  relationshipTypeList={this.props.relationshipTypeList}
                  labelList={this.props.labelList}
                  nodeList={this.props.nodeList}
                />
              ) : null
            ) : null}
          </DrawerBody>
        </Drawer>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    selectedItem: getSelectedItem(state),
    entityType: state.itemEditor.entityType,
    relationshipTypeList: state.itemEditor.relationshipTypeList,
    labelList: state.itemEditor.labelList,
    nodeList: state.itemEditor.nodeList,
    neo4jConnectionState: state.connections.connectionState
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    editEntityAction: (editPayload, editType, entityType) => {
      const action = itemEditorActions.editEntityAction(
        editPayload,
        editType,
        entityType
      )
      ownProps.bus.send(action.type, action)
    },
    fetchSelectOptions: (entityType, serachOperation) => {
      const action = itemEditorActions.fetchSelectOptions(
        entityType,
        serachOperation
      )
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
