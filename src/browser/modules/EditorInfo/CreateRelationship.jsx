import React from 'react'
import PropTypes from 'prop-types'
import {
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { StyledTable, StyledKey, StyledValue } from '../DatabaseInfo/styled'
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'
import FormControl from '@material-ui/core/FormControl'
import { Select as MaterialUISelect } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'

/**
 * Component to Create New Relationship
 */
export default function CreateRelationship (props) {
  const { direction, selectedType, selectedLabel, selectedNode } = props
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
                    <MaterialUISelect
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
                        props.setDirection(e.target.value)
                      }}
                    >
                      <MenuItem value='<----'>{'<---- (Incoming)'}</MenuItem>
                      <MenuItem value='---->'>{'----> (Outgoing)'}</MenuItem>
                    </MaterialUISelect>
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
                      props.setSelectedType(selectedType)
                    }}
                    options={props.relationshipTypeList}
                  />
                </StyledValue>
              </tr>
              <tr>
                <StyledKey>Label:</StyledKey>
                <StyledValue
                  style={{ width: '100%' }}
                  data-testid='user-details-username'
                >
                  <Select
                    isClearable
                    value={selectedLabel}
                    onChange={selectedLabel => {
                      props.setSelectedLabel(selectedLabel)
                    }}
                    options={props.labelList}
                  />
                </StyledValue>
              </tr>
              <tr>
                <StyledKey>Node:</StyledKey>
                <StyledValue
                  style={{ width: '100%' }}
                  data-testid='user-details-username'
                >
                  <Select
                    isClearable
                    value={selectedNode}
                    onChange={selectedNode => {
                      props.setSelectedNode(selectedNode)
                    }}
                    options={props.nodeList}
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

CreateRelationship.propTypes = {
  labelList: PropTypes.array,
  relationshipTypeList: PropTypes.array,
  nodeList: PropTypes.array
}
