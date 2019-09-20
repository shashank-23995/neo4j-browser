import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import { v1 as neo4j } from 'neo4j-driver'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'

const coordinateSystemSRIDMap = {
  cartesian2D: 7203,
  cartesian3D: 9157,
  geographic2D: 4326,
  geographic3D: 4979
}
const SRIDToCoordinateSystemMap = {
  7203: 'cartesian2D',
  9157: 'cartesian3D',
  4326: 'geographic2D',
  4979: 'geographic3D'
}

export const SpatialProperty = props => {
  const point = props.value
  let coordinateSystemName = ''

  let x = 0
  let y = 0
  let z = 0
  if (point && neo4j.isPoint(point) && point.srid) {
    coordinateSystemName =
      SRIDToCoordinateSystemMap[
        neo4j.isInt(point.srid) ? point.srid.toInt() : point.srid
      ]
    x = point.x
    y = point.y
    z = point.z
  }

  const handleChange = (key, value) => {
    const emptyPoint = {
      coordinateSystem: '',
      x: 0,
      y: 0,
      z: undefined
    }

    if (props.value) {
      emptyPoint.coordinateSystem =
        SRIDToCoordinateSystemMap[
          neo4j.isInt(props.value.srid)
            ? props.value.srid.toInt()
            : props.value.srid
        ]
      emptyPoint.x = props.value.x
      emptyPoint.y = props.value.y
      emptyPoint.z = props.value.z
    }

    const newPointValues = { ...emptyPoint, [key]: value }
    if (value === 'cartesian2D' || value === 'geographic2D') {
      newPointValues.z = undefined
    }
    if (value === 'cartesian3D' || value === 'geographic3D') {
      newPointValues.z = newPointValues.z || 0
    }

    const point = new neo4j.types.Point(
      coordinateSystemSRIDMap[newPointValues.coordinateSystem],
      newPointValues.x,
      newPointValues.y,
      newPointValues.z
    )
    props.onChange(point)
  }

  return (
    <React.Fragment>
      <FormControl variant='outlined' style={{ flex: 1, width: '100%' }}>
        <InputLabel>System</InputLabel>
        <Select
          name='coordinateSystem'
          value={coordinateSystemName}
          onChange={e => {
            handleChange(e.target.name, e.target.value)
          }}
          input={<OutlinedInput />}
        >
          <MenuItem value='cartesian2D'>Cartesian-2D</MenuItem>
          <MenuItem value='cartesian3D'>Cartesian-3D</MenuItem>
          <MenuItem value='geographic2D'>Geographic-2D</MenuItem>
          <MenuItem value='geographic3D'>Geographic-3D</MenuItem>
        </Select>
      </FormControl>

      <TextField
        type='number'
        label='X'
        margin='normal'
        variant='outlined'
        id='x'
        value={x}
        onChange={e => {
          handleChange(e.target.id, parseFloat(e.target.value))
        }}
        style={{
          flex: 1,

          borderRadius: '5px'
        }}
      />

      <TextField
        type='number'
        label='Y'
        margin='normal'
        variant='outlined'
        id='y'
        value={y}
        onChange={e => {
          handleChange(e.target.id, parseFloat(e.target.value))
        }}
        style={{
          flex: 1,

          borderRadius: '5px'
        }}
      />

      {coordinateSystemName === 'cartesian3D' ||
      coordinateSystemName === 'geographic3D' ? (
        <React.Fragment>
            <TextField
            type='number'
            label='Z'
            margin='normal'
            variant='outlined'
            id='z'
            value={z}
            onChange={e => {
                handleChange(e.target.id, parseFloat(e.target.value))
              }}
            style={{
                flex: 1,

                borderRadius: '5px'
              }}
            />
          </React.Fragment>
        ) : null}
    </React.Fragment>
  )
}
