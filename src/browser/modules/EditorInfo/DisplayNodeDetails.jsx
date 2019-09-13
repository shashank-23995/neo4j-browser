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
import styled from 'styled-components'
import { StyledFavFolderButtonSpan } from '../Sidebar/styled'
const IconButton = styled.button`
  margin-left: 4px;
  border: 0;
  background: transparent;
  &:focus {
    outline: none;
  }
`
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
          id={props.node ? props.node.identity.toInt() : props.selectedNodeId}
          relationshipId={props.relationshipId ? props.relationshipId : null}
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
  selectedNodeId,
  fetchSelectOptions,
  relationshipTypeList
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
          fetchSelectOptions={fetchSelectOptions}
          relationshipTypeList={relationshipTypeList}
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
  const [direction, setDirection] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [selectedLabel, setSelectedLabel] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  useEffect(
    () => {
      props.fetchSelectOptions('relationship', 'relationshipType')
      props.fetchSelectOptions('relationship', 'label')
      selectedLabel ? props.fetchSelectOptions('Node', selectedLabel.value) : ''
    },
    [selectedLabel, relationshipRequest]
  )

  return (
    <DrawerSection>
      <DrawerSubHeader>
        Relationships
        <React.Fragment>
          <StyledFavFolderButtonSpan>
            <ConfirmationButton
              requestIcon={
                <IconButton
                  onClick={() => {
                    setRelationshipRequest(!relationshipRequest)
                  }}
                >
                  <PlusIcon />
                </IconButton>
              }
              cancelIcon={
                <IconButton
                  onClick={() => {
                    setRelationshipRequest(relationshipRequest)
                    setDirection(null)
                    setSelectedType(null)
                    setSelectedLabel(null)
                    setSelectedNode(null)
                  }}
                >
                  <CancelIcon />
                </IconButton>
              }
              confirmIcon={<TickMarkIcon />}
              onConfirmed={() => {
                if (
                  direction &&
                  selectedType &&
                  selectedLabel &&
                  selectedNode
                ) {
                  props.editEntityAction(
                    {
                      direction: direction,
                      startNodeId: props.node.identity.toInt(),
                      startNodeLabel: props.node.labels[0],
                      endNodeId: selectedNode.value.identity.toInt(),
                      endNodeLabel: selectedNode.value.labels[0],
                      relationshipType: selectedType.value
                    },
                    'create',
                    'relationship'
                  )
                }
                setRelationshipRequest(!relationshipRequest)
              }}
            />
          </StyledFavFolderButtonSpan>
          {relationshipRequest ? (
            <CreateRelationship
              fetchSelectOptions={props.fetchSelectOptions}
              relationshipTypeList={props.relationshipTypeList}
              labelList={props.labelList}
              nodeList={props.nodeList}
              editEntityAction={props.editEntityAction}
              node={props.node}
              direction={direction}
              setDirection={setDirection}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedLabel={selectedLabel}
              setSelectedLabel={setSelectedLabel}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          ) : null}
        </React.Fragment>
      </DrawerSubHeader>
      {showRelationshipDetails(
        props.fromSelectedNode,
        props.entityType,
        'from',
        props.editEntityAction,
        props.node.identity.toInt(),
        props.fetchSelectOptions,
        props.relationshipTypeList
      )}
      {showRelationshipDetails(
        props.toSelectedNode,
        props.entityType,
        'to',
        props.editEntityAction,
        props.node.identity.toInt(),
        props.fetchSelectOptions,
        props.relationshipTypeList
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
