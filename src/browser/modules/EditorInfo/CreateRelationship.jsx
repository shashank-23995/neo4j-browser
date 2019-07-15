import React from 'react'
import {
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { StyledTable, StyledKey, StyledValue } from '../DatabaseInfo/styled'
import { SelectionSearch } from './SelectionSearch'
import { CreateRelationshipSelectInput } from './styled'

const options = []

export const CreateRelationship = props => {
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
                  <SelectionSearch options={options} />
                </StyledValue>
              </tr>
            </tbody>
          </StyledTable>
        </DrawerSectionBody>
      </DrawerSection>
    </React.Fragment>
  )
}
