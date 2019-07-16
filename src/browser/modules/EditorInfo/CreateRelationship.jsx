import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { StyledTable, StyledKey, StyledValue } from '../DatabaseInfo/styled'
import { CreateRelationshipSelectInput } from './styled'
import CreatableSelect from 'react-select/creatable'

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
    selectedLabel: null
  }

  render () {
    const { selectedType, selectedLabel } = this.state
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
                        this.setState({ selectedLabel })
                      }}
                      options={this.props.labelList}
                    />
                  </StyledValue>
                </tr>
              </tbody>
            </StyledTable>
          </DrawerSectionBody>
        </DrawerSection>
      </React.Fragment>
    )
  }
}

CreateRelationship.propTypes = {
  labelList: PropTypes.array,
  relationshipTypeList: PropTypes.array
}
