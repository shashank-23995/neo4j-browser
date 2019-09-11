import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import { TextInput } from 'browser-components/Form'
import { StyledValue, StyledKey } from '../DatabaseInfo/styled'
import { v1 as neo4j } from 'neo4j-driver'

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
              value={coordinateSystemName}
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
            value={x}
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
            value={y}
          />
        </StyledValue>
      </tr>

      {coordinateSystemName === 'cartesian3D' ||
      coordinateSystemName === 'geographic3D' ? (
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
                value={z}
                />
              </StyledValue>
          </tr>
          </React.Fragment>
        ) : null}
    </React.Fragment>
  )
}
