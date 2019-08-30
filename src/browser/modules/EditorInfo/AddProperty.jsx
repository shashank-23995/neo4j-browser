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
import { TextInput, RadioSelector } from 'browser-components/Form'
import styled from 'styled-components'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'
import { v1 as neo4j } from 'neo4j-driver'
import { Calendar } from 'styled-icons/boxicons-regular/Calendar'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'

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
        <MenuItem value='boolean'>Boolean</MenuItem>
        <MenuItem value='date'>Date</MenuItem>
        <MenuItem value='cartesian2D'>Cartesian-2D</MenuItem>
        <MenuItem value='cartesian3D'>Cartesian-3D</MenuItem>
      </Select>
    </FormControl>
  )
}

function AddProperty (props) {
  const [textField, handleToggle] = useState(false)
  const [calendarFlag, toggleCalendar] = useState(false)

  const initialState = {
    newProperties: {}
  }
  const [myState, updatePropertiesState] = useState(initialState)

  const handleCartesian = (axis, value) => {
    let newState = _.cloneDeep(myState)
    let point = newState.newProperties.propValue
    let p = { x: 0, y: 0, z: undefined }
    if (point && neo4j.isPoint(point)) {
      p.x = point.x
      p.y = point.y
      p.z = point.z
    }
    p[axis] = value || 0
    const srid = newState.newProperties.datatype === 'cartesian2D' ? 7203 : 9157
    point = new neo4j.types.Point(srid, p.x, p.y, p.z)

    updatePropertiesState({
      ...newState,
      newProperties: {
        ...newState.newProperties,
        propValue: point
      }
    })
  }

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
  const options = ['true', 'false']
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
    case 'boolean':
      valueInput = (
        <RadioSelector
          options={options}
          onChange={e => {
            handleChange('propValue', e.target.value)
          }}
          selectedValue={myState.newProperties.propValue}
        />
      )
      break
    case 'date':
      valueInput = (
        <React.Fragment>
          <TextInput
            style={{
              width: '120px'
            }}
            value={myState.newProperties.propValue}
            disabled
          />
          <Calendar
            style={{
              float: 'right',
              height: '2em',
              width: '2em',
              color: 'ghostwhite'
            }}
            onClick={() => {
              toggleCalendar(!calendarFlag)
            }}
          />
        </React.Fragment>
      )
      break
    case 'cartesian2D':
      valueInput = (
        <React.Fragment>
          X:
          <TextInput
            id='x'
            type='number'
            onChange={e => {
              handleCartesian(e.target.id, parseFloat(e.target.value))
            }}
            style={{ width: '120px' }}
          />
          Y:
          <TextInput
            id='y'
            type='number'
            onChange={e => {
              handleCartesian(e.target.id, parseFloat(e.target.value))
            }}
            style={{ width: '120px' }}
          />
        </React.Fragment>
      )
      break
    case 'cartesian3D':
      valueInput = (
        <React.Fragment>
          X:
          <TextInput
            id='x'
            type='number'
            onChange={e => {
              handleCartesian(e.target.id, parseFloat(e.target.value))
            }}
            style={{ width: '120px' }}
          />
          Y:
          <TextInput
            id='y'
            type='number'
            onChange={e => {
              handleCartesian(e.target.id, parseFloat(e.target.value))
            }}
            style={{ width: '120px' }}
          />
          Z:
          <TextInput
            id='z'
            type='number'
            onChange={e => {
              handleCartesian(e.target.id, parseFloat(e.target.value))
            }}
            style={{ width: '120px' }}
          />
        </React.Fragment>
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
              <StyledValue>
                {valueInput}
                {calendarFlag ? (
                  <DayPicker
                    style={{ float: 'right' }}
                    id='date'
                    onDayClick={day => {
                      handleChange(
                        'propValue',
                        neo4j.types.Date.fromStandardDate(day)
                      )
                    }}
                  />
                ) : null}
              </StyledValue>
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
