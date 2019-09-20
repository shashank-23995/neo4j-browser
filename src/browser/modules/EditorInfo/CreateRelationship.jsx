import React from 'react'
import PropTypes from 'prop-types'
import { StyledTable, StyledKey, StyledValue } from '../DatabaseInfo/styled'
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'
import FormControl from '@material-ui/core/FormControl'
import { Select as MaterialUISelect } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'

export const colourStyles = {
  control: provided => ({
    ...provided,
    backgroundColor: '#efeff4',
    width: '93%'
  }),
  placeholder: provided => ({
    ...provided,
    color: '#958d98',
    font: 'inherit',
    padding: 0,
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: '0.00938em'
  }),
  dropdownIndicator: provided => ({
    ...provided,
    color: '#958d98',
    background: 'none'
  }),
  indicatorSeparator: provided => ({
    ...provided,
    backgroundColor: '#efeff4'
  })
}

/**
 * Component to Create New Relationship
 */
export default function CreateRelationship (props) {
  const { direction, selectedType, selectedLabel, selectedNode } = props
  return (
    <React.Fragment>
      <div
        style={{
          marginLeft: -9,
          marginRight: -9,
          backgroundColor: '#efeff4',
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          padding: 5
        }}
      >
        <div style={{ marginLeft: 8, marginRight: 8, width: '100%' }}>
          <FormControl
            variant='outlined'
            style={{ width: '100%', marginTop: '16px', marginLeft: -8 }}
          >
            <InputLabel htmlFor='outlined-age-simple'>Direction</InputLabel>
            <MaterialUISelect
              name='datatype'
              input={<OutlinedInput id='outlined-age-simple' />}
              style={{
                backgroundColor: '#efeff4',
                width: '93%',
                marginLeft: '8px',
                borderRadius: '5px'
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
          <div style={{ width: '100%', marginTop: '16px' }}>
            <CreatableSelect
              isClearable
              placeholder='Type'
              styles={colourStyles}
              value={selectedType}
              onChange={selectedType => {
                props.setSelectedType(selectedType)
              }}
              options={props.relationshipTypeList}
            />
          </div>
          <div style={{ width: '100%', marginTop: '16px' }}>
            <Select
              isClearable
              placeholder='Label'
              styles={colourStyles}
              value={selectedLabel}
              onChange={selectedLabel => {
                props.setSelectedLabel(selectedLabel)
              }}
              options={props.labelList}
            />
          </div>
          <div style={{ width: '100%', marginTop: '16px' }}>
            <Select
              isClearable
              placeholder='Node'
              styles={colourStyles}
              value={selectedNode}
              onChange={selectedNode => {
                props.setSelectedNode(selectedNode)
              }}
              options={selectedLabel ? props.nodeList : []}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

CreateRelationship.propTypes = {
  labelList: PropTypes.array,
  relationshipTypeList: PropTypes.array,
  nodeList: PropTypes.array
}
