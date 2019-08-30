import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MaskedInput from 'react-text-mask'

function TextMaskCustom (props) {
  const { inputRef, ...other } = props

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null)
      }}
      mask={[/[1-9]/, /\d/, '.', /\d/, /\d/]}
      showMask
    />
  )
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired
}
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
      X:
      <Input
        style={{
          width: '120px',
          color: '#555',
          backgroundColor: '#fff',
          padding: '4px 12px',
          fontSize: '14px'
        }}
        id='x'
        inputComponent={TextMaskCustom}
        onChange={e => {
          handleChange(e.target.id, parseFloat(e.target.value))
        }}
      />
      Y:
      <Input
        style={{
          width: '120px',
          color: '#555',
          backgroundColor: '#fff',
          padding: '4px 12px',
          fontSize: '14px'
        }}
        id='y'
        inputComponent={TextMaskCustom}
        onChange={e => {
          handleChange(e.target.id, parseFloat(e.target.value))
        }}
      />
      {state.coordinateSystem === 'cartesian3D' ||
      state.coordinateSystem === 'geographic3D' ? (
        <React.Fragment>
          Z:
            <Input
            style={{
                width: '120px',
                color: '#555',
                backgroundColor: '#fff',
                padding: '4px 12px',
                fontSize: '14px'
              }}
            id='z'
            inputComponent={TextMaskCustom}
            onChange={e => {
                handleChange(e.target.id, parseFloat(e.target.value))
              }}
            />
          </React.Fragment>
        ) : null}
    </React.Fragment>
  )
}
