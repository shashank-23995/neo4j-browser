import React, { useState } from 'react'
import {
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { StyledTable, StyledKey, StyledValue } from '../DatabaseInfo/styled'
import { CreateRelationshipSelectInput } from './styled'
import Select, { components } from 'react-select'

const options = []

const NoOptionsMessage = props => {
  return props.selectProps.inputValue ? (
    `Create New + ${props.selectProps.inputValue}`
  ) : (
    <components.NoOptionsMessage {...props} />
  )
}

export const CreateRelationship = props => {
  const [selectedOption, handleChange] = useState(null)
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
                <StyledKey>react-select</StyledKey>
                <StyledValue
                  style={{ width: '100%' }}
                  data-testid='user-details-username'
                >
                  <Select
                    isClearable
                    components={{ NoOptionsMessage }}
                    value={selectedOption}
                    onChange={selectedOption => handleChange(selectedOption)}
                    options={options}
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
