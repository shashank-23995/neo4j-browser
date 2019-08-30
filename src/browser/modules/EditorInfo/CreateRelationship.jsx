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
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

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
    direction: null,
    selectedType: null,
    selectedLabel: null,
    selectedNode: null
  }

  render () {
    const { direction, selectedType, selectedLabel, selectedNode } = this.state
    return (
      <React.Fragment>
        <DrawerSection>
          <DrawerSectionBody>
            <StyledTable>
              <tbody>
                <tr>
                  <StyledKey> Direction:</StyledKey>
                  <StyledValue>
                    <FormControl
                      style={{
                        marginTop: 16,
                        marginBottom: 16,
                        minWidth: 120
                      }}
                      variant='outlined'
                    >
                      <Select
                        name='datatype'
                        style={{
                          background: '#fff',
                          fontSize: '14px',
                          textAlign: '-webkit-center',
                          height: '34px',
                          color: '#555',
                          borderTop: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                        value={direction}
                        onChange={e => {
                          this.setState({ direction: e.target.value })
                        }}
                      >
                        <MenuItem value='<----'>{'<---- (Incoming)'}</MenuItem>
                        <MenuItem value='---->'>{'----> (Outgoing)'}</MenuItem>
                      </Select>
                    </FormControl>
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
                <IconButton>
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
                this.props.editEntityAction(
                  {
                    direction: this.state.direction,
                    startNodeId: this.props.node.identity.toInt(),
                    startNodeLabel: this.props.node.labels[0],
                    endNodeId: this.state.selectedNode.value.identity.toInt(),
                    endNodeLabel: this.state.selectedNode.value.labels[0],
                    relationshipType: this.state.selectedType.value
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
