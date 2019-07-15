import React, { useState } from 'react'
import {
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { TextInput } from 'browser-components/Form'
import { StyledTable, StyledKey, StyledValue } from '../DatabaseInfo/styled'
import {
  CreateRelationshipInput,
  CreateRelationshipSelectInput
} from './styled'
import Select from 'react-select'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

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
                <StyledKey>Type:</StyledKey>
                <StyledValue data-testid='user-details-username'>
                  <CreateRelationshipInput id='item' type='text' />
                </StyledValue>
              </tr>
              <tr>
                <StyledKey>react-select</StyledKey>
                <StyledValue data-testid='user-details-username'>
                  <Select
                    value={selectedOption}
                    onChange={selectedOption => handleChange(selectedOption)}
                    options={options}
                  />
                  {console.log('selected option - ', selectedOption)}
                </StyledValue>
              </tr>
            </tbody>
          </StyledTable>
        </DrawerSectionBody>
      </DrawerSection>
    </React.Fragment>
  )
}
