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
import { v1 as neo4j } from 'neo4j-driver'
import { Calendar } from 'styled-icons/boxicons-regular/Calendar'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import { SpatialProperty } from './SpatialProperty'
import { StyledFavFolderButtonSpan } from '../Sidebar/styled'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'

const IconButton = styled.div`
  margin-left: 4px;
  border: 0;
  background: transparent;
  &:focus {
    outline: none;
  }
`
export function DropDownContents (props) {
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
        value={props.dataTypeValue}
        onChange={e => {
          props.handleChange(e.target.name, e.target.value)
        }}
      >
        <MenuItem value='string'>String</MenuItem>
        <MenuItem value='number'>Number</MenuItem>
        <MenuItem value='boolean'>Boolean</MenuItem>
        <MenuItem value='date'>Date</MenuItem>
        <MenuItem value='spatial'>Spatial</MenuItem>
      </Select>
    </FormControl>
  )
}

const dataTypeChecker = value => {
  if (neo4j.isInt(value[0])) {
    return 'number'
  }
  if (neo4j.isPoint(value[0])) {
    return 'spatial'
  }
  if (neo4j.isDate(value[0])) {
    return 'date'
  }
  if (typeof value[0] === 'string') {
    return 'string'
  }
  if (typeof value[0] === 'boolean') {
    return 'boolean'
  }
}

function AddProperty (props) {
  const [textField, handleToggle] = useState(false)
  const [calendarFlag, toggleCalendar] = useState(false)
  const [showButtons, setButtonVisibility] = useState(false)
  const [dataType, setDatatype] = useState('')
  const [p, setP] = useState({ key: null, value: null })
  const [stateUpdatedWithProps, setFlag] = useState(false)
  const [entityType, setEntityType] = useState('')

  // effect to copy props to state. this is one time job
  useEffect(
    () => {
      if (!stateUpdatedWithProps) {
        setP(props.p)
        const dataTypeValue = dataTypeChecker(
          Object.values({ value: props.p && props.p.value })
        )
        setDatatype(dataTypeValue)
        if (props.relationshipId !== null) {
          setEntityType('relationship')
        } else {
          setEntityType('node')
        }
        setFlag(true)
      }
    },
    [props]
  )

  // effect to show confirmation buttons
  useEffect(
    () => {
      if (
        stateUpdatedWithProps &&
        props.p &&
        (props.p.value !== p.value || props.p.key !== p.key)
      ) {
        setButtonVisibility(true)
      } else {
        setButtonVisibility(false)
      }
    },
    [p && p.key, p && p.value, stateUpdatedWithProps]
  )

  const handleChange = (key1, value) => {
    setP({ ...p, value: value })
  }

  let valueInput = null
  const options = ['true', 'false']

  switch (dataType) {
    case 'string':
      valueInput = (
        <TextInput
          id='propValue'
          value={p.value || ''}
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
          value={p.value || ''}
          type='number'
          onChange={e => {
            handleChange(e.target.id, e.target.value)
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
          selectedValue={
            p
              ? Object.values({
                value: p.value !== null ? p.value : ''
              })[0].toString()
              : ''
          }
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
            value={p.value || ''}
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
    case 'spatial':
      valueInput = (
        <SpatialProperty
          properties={props.properties}
          value={p.value}
          onChange={point => {
            handleChange('propValue', point)
          }}
        />
      )
      break
  }

  const onConfirmed = () => {
    if (p && p.key && p.value) {
      if (entityType === 'node') {
        props.editEntityAction(
          {
            nodeId: props.nodeId,
            key: p.key,
            value: p.value,
            oldProperties: Object.values(props.p)[0],
            dataType: dataType
          },
          'update',
          'nodeProperties'
        )
      } else if (entityType === 'relationship') {
        props.editEntityAction(
          {
            nodeId: props.nodeId,
            relationshipId: props.relationshipId,
            key: p.key,
            value: p.value,
            oldProperties: Object.values(props.p)[0],
            dataType: dataType
          },
          'update',
          'relationshipProperties'
        )
      }
      setButtonVisibility(false)
      dataType === 'date' && toggleCalendar(false)
    } else {
      alert('Empty field')
    }
  }

  const onCanceled = () => {
    setButtonVisibility(false)
    dataType === 'date' && toggleCalendar(false)
    setDatatype(dataTypeChecker(Object.values({ value: props.p.value })))
    setP(props.p)
  }

  return (
    <React.Fragment>
      {props.ToDisplay != 'view' ? (
        <StyledFavFolderButtonSpan>
          <ConfirmationButton
            requestIcon={
              <IconButton
                onClick={() => {
                  handleToggle(!textField)
                }}
              >
                <PlusIcon />
              </IconButton>
            }
            cancelIcon={
              <IconButton
                onClick={() => {
                  handleToggle(textField)
                }}
              >
                <CancelIcon />
              </IconButton>
            }
            confirmIcon={<TickMarkIcon />}
            onConfirmed={() => {
              handleToggle(!textField)
              if (p && p.key && p.value) {
                if (entityType === 'node') {
                  props.editEntityAction(
                    {
                      id: props.id,
                      key: p.key,
                      value: p.value,
                      dataType: dataType
                    },
                    'create',
                    'nodeProperty'
                  )
                } else if (entityType === 'relationship') {
                  props.editEntityAction(
                    {
                      id: props.id,
                      relationshipId: props.relationshipId,
                      key: p.key,
                      value: p.value,
                      dataType: dataType
                    },
                    'create',
                    'relationshipProperty'
                  )
                }
                setP({ key: null, value: null })
                setDatatype('')
              } else {
                alert('Empty field')
              }
            }}
          />
        </StyledFavFolderButtonSpan>
      ) : null}
      {props.ToDisplay == 'view' || textField ? (
        <DrawerSection>
          {showButtons ? (
            <PartialConfirmationButtons
              onConfirmed={onConfirmed}
              onCanceled={onCanceled}
            />
          ) : null}
          <DrawerSectionBody>
            <StyledTable>
              <tr>
                <StyledKey>key:</StyledKey>
                <StyledValue>
                  <TextInput
                    id='key'
                    value={(p && p.key) || ''}
                    onChange={e => {
                      setP({ ...p, key: e.target.value })
                    }}
                    style={{ width: '120px' }}
                  />
                </StyledValue>
              </tr>
              <tr>
                <StyledKey> Data Type:</StyledKey>
                <StyledValue>
                  <DropDownContents
                    dataTypeValue={dataType}
                    handleChange={(key, value) => {
                      if (dataType !== value) {
                        setDatatype(value)
                        setP({ ...p, value: null })
                      }
                    }}
                  />
                </StyledValue>
              </tr>
              <tr>
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
              </tr>
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
