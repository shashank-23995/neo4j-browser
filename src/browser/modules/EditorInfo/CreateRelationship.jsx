import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { StyledTable, StyledKey, StyledValue } from '../DatabaseInfo/styled'
import { CreateRelationshipSelectInput } from './styled'
import CreatableSelect from 'react-select/creatable'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import {
  PlusIcon,
  CancelIcon,
  TickMarkIcon
} from 'browser-components/icons/Icons'
import styled from 'styled-components'

const IconButton = styled.button`
  margin-left: 4px;
  border: 0;
  background: transparent;
  &:focus {
    outline: none;
  }
`
/**
 * Component to Create New Relationship
 */
export default class CreateRelationship extends Component {
  componentDidMount () {
    this.props.fetchSelectOptions('relationship', 'relationshipType')
    this.props.fetchSelectOptions('relationship', 'label')
  }

  state = {
    selectedType: null,
    selectedLabel: null,
    selectedNode: null
  }

  render () {
    const { selectedType, selectedLabel, selectedNode } = this.state
    return (
      <React.Fragment>
        <DrawerSection>
          <DrawerSectionBody>
            <StyledTable>
              <tbody>
                <tr>
                  <StyledKey>Direction:</StyledKey>
                  <StyledValue data-testid='user-details-username'>
                    <CreateRelationshipSelectInput>
                      <option value='---->'>{'---->'}</option>
                      <option value='<----'>{'<----'}</option>
                    </CreateRelationshipSelectInput>
                  </StyledValue>
                </tr>
                <tr>
                  <StyledKey>Type:</StyledKey>
                  <StyledValue
                    style={{ width: '100%' }}
                    data-testid='user-details-username'
                  >
                    <CreatableSelect
                      isClearable
                      value={selectedType}
                      onChange={selectedType => {
                        this.setState({ selectedType })
                      }}
                      options={this.props.relationshipTypeList}
                    />
                  </StyledValue>
                </tr>
                <tr>
                  <StyledKey>Label:</StyledKey>
                  <StyledValue
                    style={{ width: '100%' }}
                    data-testid='user-details-username'
                  >
                    <CreatableSelect
                      isClearable
                      value={selectedLabel}
                      onChange={selectedLabel => {
                        this.setState({ selectedLabel }, () => {
                          selectedLabel
                            ? this.props.fetchSelectOptions(
                              'Node',
                              selectedLabel.value
                            )
                            : ''
                        })
                      }}
                      options={this.props.labelList}
                    />
                  </StyledValue>
                </tr>
                <tr>
                  <StyledKey>Node:</StyledKey>
                  <StyledValue
                    style={{ width: '100%' }}
                    data-testid='user-details-username'
                  >
                    <CreatableSelect
                      isClearable
                      value={selectedNode}
                      onChange={selectedNode => {
                        this.setState({ selectedNode })
                      }}
                      options={this.props.nodeList}
                    />
                  </StyledValue>
                </tr>
              </tbody>
            </StyledTable>
            <ConfirmationButton
              requestIcon={
                <IconButton
                  onClick={() => {
                    console.log(this.props.node)
                  }}
                >
                  <PlusIcon />
                </IconButton>
              }
              cancelIcon={
                <IconButton onClick={() => {}}>
                  <CancelIcon />
                </IconButton>
              }
              confirmIcon={<TickMarkIcon />}
              onConfirmed={() => {
                console.log('start node', this.props.node.identity.toInt())
                console.log(
                  'end node',
                  this.state.selectedNode.value.identity.toInt()
                )
                this.props.editEntityAction(
                  {
                    direction: '',
                    startNode: this.props.node.identity.toInt(),
                    endeNode: '',
                    relationshipType: ''
                  },
                  'create',
                  'relationship'
                )
              }}
            />
          </DrawerSectionBody>
        </DrawerSection>
      </React.Fragment>
    )
  }
}

CreateRelationship.propTypes = {
  labelList: PropTypes.array,
  relationshipTypeList: PropTypes.array,
  nodeList: PropTypes.array
}
