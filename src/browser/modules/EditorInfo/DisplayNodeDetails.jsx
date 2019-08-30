import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  DrawerSection,
  DrawerSubHeader,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import * as _ from 'lodash'
import classNames from 'classnames'
import styles from '../DatabaseInfo/style_meta.css'
import { StyledTable, StyledValue } from '../DatabaseInfo/styled'
import {
  BinIcon,
  PlusIcon,
  CancelIcon,
  TickMarkIcon
} from 'browser-components/icons/Icons'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import { DisplayProperties } from '../EditorInfo/DisplayProperties'
import { ExpandRelationshipDetails } from './ExpandRelationshipDetails'
import { EditPropertiesInput, RelationshipIconButton } from './styled'
import { DisplayLabel } from './DisplayLabel'
import AddProperty from './AddProperty'
import AddLabel from './AddLabel'
import CreateRelationship from './CreateRelationship'
/**
 * Creates items to display in chip format
 * @param {*} originalList Item list
 * @param {*} RenderType The render type
 */
const createItems = (originalList, RenderType) => {
  let items = [...originalList]

  return items.map((text, index) => {
    return (
      <RenderType.component data-testid='sidebarMetaItem' key={index}>
        {text}
      </RenderType.component>
    )
  })
}

/**
 * Label section
 * @param {*} props
 */
const LabelSection = props => {
  let { node } = props
  let labels = [...node.labels]
  let labelItems = <p>There are no labels for this node</p>
  if (node.labels.length) {
    labelItems = createItems(node.labels, { component: EditPropertiesInput })
  }
  return (
    <div>
      <DrawerSection>
        <DrawerSubHeader>
          Labels
          <AddLabel
            editEntityAction={props.editEntityAction}
            nodeId={props.node ? props.node.identity.toInt() : null}
          />
        </DrawerSubHeader>
        <DrawerSectionBody
          className={classNames({
            [styles['wrapper']]: true
          })}
        >
          <StyledValue data-testid='user-details-username'>
            {labels.map((label, labelKey) => {
              return (
                <div key={labelKey}>
                  <StyledTable>
                    <tbody>
                      <tr>
                        <DisplayLabel
                          isDeletable={labels.length > 1}
                          {...props}
                          label={label}
                          labelKey={labelKey}
                        />
                      </tr>
                    </tbody>
                  </StyledTable>
                </div>
              )
            })}
          </StyledValue>
        </DrawerSectionBody>
      </DrawerSection>
    </div>
  )
}
LabelSection.propTypes = {
  node: PropTypes.object
}

/**
 * Entity Section
 */
export const EntitySection = props => {
  return (
    <DrawerSection>
      <DrawerSubHeader>Entity</DrawerSubHeader>
      {props.type}
      {props.type === 'Node' && (
        <ConfirmationButton
          requestIcon={<BinIcon />}
          confirmIcon={<BinIcon deleteAction />}
          onConfirmed={() => {
            props.editEntityAction(
              {
                nodeId: props.node.identity.toInt(),
                firstLabel: props.node.labels[0]
              },
              'delete',
              'node'
            )
          }}
        />
      )}
    </DrawerSection>
  )
}
EntitySection.propTypes = {
  node: PropTypes.object,
  editEntityAction: PropTypes.func
}

/**
 * Properties section
 * @param {*} props
 */

export const PropertiesSection = props => {
  const initState = {
    properties: { ...props.properties }
  }

  const [propertiesState, updatePropertiesState] = useState(initState)

  /**
   * useEffect accepts a function that updates the state whenever the props change
   * @param updatePropertiesState — Function that returns an updated state everytime props change
   * @param deps —  Will activate when the props change
   */
  useEffect(
    () => {
      updatePropertiesState({
        ...propertiesState,
        properties: { ...props.properties }
      })
    },
    [props.properties]
  )

  let content = []
  if (propertiesState.properties) {
    content = _.map(propertiesState.properties, (value, key) => {
      return (
        <div key={key}>
          <StyledTable>
            <tbody>
              <tr>
                <DisplayProperties
                  {...props}
                  value={value}
                  displayPropertiesStateKey={key}
                />
              </tr>
            </tbody>
          </StyledTable>
        </div>
      )
    })
  }
  if (!content.length) {
    content.push(
      <p>{`There are no properties for this ${props.entityType}`}</p>
    )
  }
  return (
    <DrawerSection>
      <DrawerSubHeader>
        Properties
        <AddProperty
          editEntityAction={props.editEntityAction}
          id={props.node ? props.node.identity.toInt() : null}
        />
      </DrawerSubHeader>
      {content}
    </DrawerSection>
  )
}

PropertiesSection.propTypes = {
  properties: PropTypes.object,
  editEntityAction: PropTypes.func
}

/**
 * Node editor.
 * Provides editing capabilities for node labels and properties
 * @param {*} props
 */
const DisplayNodeDetails = props => {
  return (
    <React.Fragment>
      <EntitySection {...props} type='Node' />
      <LabelSection {...props} />
      <PropertiesSection
        {...props}
        properties={props.node ? props.node.properties : null}
        editEntityAction={props.editEntityAction}
        entityType='node'
      />
      <RelationshipSection
        fromSelectedNode={props.fromSelectedNode}
        toSelectedNode={props.toSelectedNode}
        entityType={props.entityType}
        editEntityAction={props.editEntityAction}
        {...props}
      />
    </React.Fragment>
  )
}

DisplayNodeDetails.propTypes = {
  node: PropTypes.object,
  editEntityAction: PropTypes.func,
  entityType: PropTypes.string,
  fromSelectedNode: PropTypes.array,
  toSelectedNode: PropTypes.array
}

/**
 * Method to show the relationship details for the selected node
 * @param {array} selectedNodeRelationship array containing the relationship details
 * @param {string} entityType entity type, either node or relationship
 * @param {string} relationshipEndpoint relationship endpoint, either from or to
 * @param {function} editEntityAction action to dispatch parameter to delete relationship
 * @param {Integer} selectedNodeId nodeID of selected node
 */
const showRelationshipDetails = (
  selectedNodeRelationship,
  entityType,
  relationshipEndpoint,
  editEntityAction,
  selectedNodeId
) => {
  let relationShipArray = []
  if (selectedNodeRelationship) {
    relationShipArray = _.map(selectedNodeRelationship, (value, key) => {
      return (
        <ExpandRelationshipDetails
          key={key}
          value={value}
          entityType={entityType}
          relationshipEndpoint={relationshipEndpoint}
          editEntityAction={editEntityAction}
          selectedNodeId={selectedNodeId}
        />
      )
    })
  }
  return relationShipArray
}

/**
 * Relationship Section
 */
export const RelationshipSection = props => {
  let noRelationshipMessage = null
  if (!props.toSelectedNode.length && !props.fromSelectedNode.length) {
    noRelationshipMessage = <p>{`There are no relationships for this node`}</p>
  }
  const [relationshipRequest, setRelationshipRequest] = useState(false)
  return (
    <DrawerSection>
      <DrawerSubHeader>
        Relationships
        {relationshipRequest ? (
          <React.Fragment>
            <RelationshipIconButton
              onClick={() => setRelationshipRequest(!relationshipRequest)}
            >
              <CancelIcon />
            </RelationshipIconButton>
            <RelationshipIconButton
              onClick={() => console.log('tick icon clicked')}
            >
              <TickMarkIcon />
            </RelationshipIconButton>
            <CreateRelationship
              fetchSelectOptions={props.fetchSelectOptions}
              relationshipTypeList={props.relationshipTypeList}
              labelList={props.labelList}
              nodeList={props.nodeList}
              editEntityAction={props.editEntityAction}
              node={props.node}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <RelationshipIconButton
              onClick={() => setRelationshipRequest(!relationshipRequest)}
            >
              <PlusIcon />
            </RelationshipIconButton>
          </React.Fragment>
        )}
      </DrawerSubHeader>
      {showRelationshipDetails(
        props.fromSelectedNode,
        props.entityType,
        'from',
        props.editEntityAction,
        props.node.identity.toInt()
      )}
      {showRelationshipDetails(
        props.toSelectedNode,
        props.entityType,
        'to',
        props.editEntityAction,
        props.node.identity.toInt()
      )}
      {noRelationshipMessage}
    </DrawerSection>
  )
}

RelationshipSection.propTypes = {
  entityType: PropTypes.string,
  fromSelectedNode: PropTypes.array,
  toSelectedNode: PropTypes.array,
  editEntityAction: PropTypes.func,
  identity: PropTypes.number
}

export default DisplayNodeDetails
