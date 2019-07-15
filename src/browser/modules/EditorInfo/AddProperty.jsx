import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { StyledTable, StyledValue, StyledKey } from '../DatabaseInfo/styled'
import {
  PlusIcon,
  TickMarkIcon,
  CancelIcon
} from 'browser-components/icons/Icons'
import {
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { TextInput } from 'browser-components/Form'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'
import { v1 as neo4j } from 'neo4j-driver'

const IconButton = styled.button`
  margin-left: 4px;
  border: 0;
  background: transparent;
  &:focus {
    outline: none;
  }
`
function DropDownContents (props) {
  return (
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
        value={props.myState.newProperties.datatype}
        onChange={e => {
          props.handleChange(e.target.name, e.target.value)
        }}
      >
        <MenuItem value='string'>String</MenuItem>
        <MenuItem value='number'>Number</MenuItem>
      </Select>
    </FormControl>
  )
}

function AddProperty (props) {
  const [textField, handleToggle] = useState(false)

  const initialState = {
    newProperties: {}
  }
  const [myState, updatePropertiesState] = useState(initialState)

  const handleChange = (key1, value) => {
    let newState = _.cloneDeep(myState)
    updatePropertiesState({
      ...newState,
      newProperties: {
        ...newState.newProperties,
        [key1]: value
      }
    })
  }

  let valueInput = null
  switch (myState.newProperties.datatype) {
    case 'string':
      valueInput = (
        <TextInput
          id='propValue'
          onChange={e => {
            handleChange(e.target.id, e.target.value)
          }}
          style={{ width: '120px' }}
        />
      )
      break
    case 'number':
      valueInput = (
        <TextInput
          id='propValue'
          type='number'
          onChange={e => {
            handleChange(e.target.id, neo4j.int(e.target.value))
          }}
          style={{ width: '120px' }}
        />
      )
      break
  }

  return (
    <React.Fragment>
      <IconButton onClick={() => handleToggle(!textField)}>
        <PlusIcon />
        AddProperty
      </IconButton>
      {textField ? (
        <DrawerSection>
          <DrawerSectionBody>
            <StyledTable>
              <tr>
                <StyledKey>key:</StyledKey>
                <StyledValue>
                  <TextInput
                    id='key'
                    onChange={e => {
                      handleChange(e.target.id, e.target.value)
                    }}
                    style={{ width: '120px' }}
                  />
                </StyledValue>
              </tr>
              <tr>
                <StyledKey> Data Type:</StyledKey>
                <StyledValue>
                  <DropDownContents
                    myState={myState}
                    handleChange={handleChange}
                  />
                </StyledValue>
              </tr>
              <StyledKey>Value :</StyledKey>
              <StyledValue>{valueInput}</StyledValue>
              <PartialConfirmationButtons
                cancelIcon={
                  <IconButton onClick={() => handleToggle(textField)}>
                    <CancelIcon />
                  </IconButton>
                }
                onCanceled={() => {
                  handleToggle(false)
                }}
                confirmIcon={<TickMarkIcon />}
                onConfirmed={() => {
                  handleToggle(!textField)
                  props.editEntityAction(
                    {
                      id: props.id,
                      key: myState.newProperties.key,
                      value: myState.newProperties.propValue,
                      dataType: myState.newProperties.datatype
                    },
                    'create',
                    'nodeProperty'
                  )
                }}
              />
            </StyledTable>
          </DrawerSectionBody>
        </DrawerSection>
      ) : null}
    </React.Fragment>
  )
}

AddProperty.propTypes = {
  editEntityAction: PropTypes.func
}

export default AddProperty
