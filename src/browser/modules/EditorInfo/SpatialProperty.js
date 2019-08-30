import React, { useState } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import { TextInput } from 'browser-components/Form'
import { StyledValue, StyledKey } from '../DatabaseInfo/styled'

const coordinateSystemSRIDMap = {
  cartesian2D: 7203,
  cartesian3D: 9157,
  geographic2D: 4326,
  geographic3D: 4979
}

export const SpatialProperty = props => {
  const initialState = {
    coordinateSystem: '',
    x: 0,
    y: 0,
    z: undefined
  }

  const [state, updateState] = useState(initialState)

  const handleChange = (key, value) => {
    const newState = { ...state, [key]: value }
    if (value === 'cartesian2D' || value === 'geographic2D') {
      newState.z = undefined
    }
    if (value === 'cartesian3D' || value === 'geographic3D') {
      newState.z = newState.z || 0
    }
    updateState(newState)
    props.onChange({
      ...newState,
      coordinateSystem: coordinateSystemSRIDMap[newState.coordinateSystem]
    })
  }

  return (
    <React.Fragment>
      <tr>
        <StyledKey>System:</StyledKey>
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
              name='coordinateSystem'
              style={{
                background: '#fff',
                fontSize: '14px',
                textAlign: '-webkit-center',
                height: '34px',
                color: '#555',
                borderTop: '1px solid #ccc',
                borderRadius: '4px'
              }}
              value={state.coordinateSystem}
              onChange={e => {
                handleChange(e.target.name, e.target.value)
              }}
            >
              <MenuItem value='cartesian2D'>Cartesian-2D</MenuItem>
              <MenuItem value='cartesian3D'>Cartesian-3D</MenuItem>
              <MenuItem value='geographic2D'>Geographic-2D</MenuItem>
              <MenuItem value='geographic3D'>Geographic-3D</MenuItem>
            </Select>
          </FormControl>
        </StyledValue>
      </tr>
      <tr>
        <StyledKey>X:</StyledKey>
        <StyledValue>
          <TextInput
            type='number'
            style={{ width: '120px' }}
            id='x'
            onChange={e => {
              handleChange(e.target.id, parseFloat(e.target.value))
            }}
          />
        </StyledValue>
      </tr>
      <tr>
        <StyledKey>Y:</StyledKey>
        <StyledValue>
          <TextInput
            type='number'
            style={{ width: '120px' }}
            id='y'
            onChange={e => {
              handleChange(e.target.id, parseFloat(e.target.value))
            }}
          />
        </StyledValue>
      </tr>
      {state.coordinateSystem === 'cartesian3D' ||
      state.coordinateSystem === 'geographic3D' ? (
        <React.Fragment>
            <tr>
            <StyledKey>Z:</StyledKey>
            <StyledValue>
                <TextInput
                type='number'
                style={{ width: '120px' }}
                id='z'
                onChange={e => {
                    handleChange(e.target.id, parseFloat(e.target.value))
                  }}
                />
              </StyledValue>
          </tr>
          </React.Fragment>
        ) : null}
    </React.Fragment>
  )
}
