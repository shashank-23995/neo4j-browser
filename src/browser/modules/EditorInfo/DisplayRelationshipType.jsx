import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'
import CreatableSelect from 'react-select/creatable'
import { colourStyles } from './CreateRelationship'
import FormControl from '@material-ui/core/FormControl'
import { Select as MaterialUISelect } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import OutlinedInput from '@material-ui/core/OutlinedInput'

/**
 * Component to display the relationship type
 * @param {*} props
 */

function DisplayRelationshipType (props) {
  useEffect(() => {
    props.fetchSelectOptions('relationship', 'relationshipType')
    setButtonVisibility(false)
    if (
      props.selectedNodeId ===
      props.value.segments[0].relationship.start.toInt()
    ) {
      setSelectedNode('start')
    } else {
      setSelectedNode('end')
    }
    if (props.relationshipEndpoint === 'from') {
      setSelectedDirection('---->')
    } else if (props.relationshipEndpoint === 'to') {
      setSelectedDirection('<----')
    }
  }, [])

  const [selectedType, setSelectedType] = useState({
    label: props.relationshipType,
    value: props.relationshipType
  })
  const [showButtons, setButtonVisibility] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedDirection, setSelectedDirection] = useState(selectedDirection)

  const onConfirmed = () => {
    props.editEntityAction(
      {
        id: props.relationshipId,
        value: selectedType.value,
        selectedNodeEndpoint: selectedNode,
        selectedDirection: selectedDirection,
        selectedNodeId: props.selectedNodeId,
        endNodeId: props.value.end.identity.toInt()
      },
      'update',
      'relationship'
    )
    setButtonVisibility(false)
  }

  const onCanceled = () => {
    setButtonVisibility(false)
  }

  return (
    <div>
      {showButtons ? (
        <div>
          <PartialConfirmationButtons
            onConfirmed={onConfirmed}
            onCanceled={onCanceled}
          />
        </div>
      ) : null}
      <div
        style={{
          display: 'flex',
          marginLeft: 8,
          marginRight: 8,
          marginBottom: 16,
          width: '100%'
        }}
      >
        <div style={{ width: '100%' }}>
          <CreatableSelect
            isClearable
            placeholder='Type'
            styles={colourStyles}
            defaultValue={selectedType}
            onChange={selectedType => {
              if (
                selectedType &&
                selectedType.value !== props.relationshipType
              ) {
                setSelectedType(selectedType)
                setButtonVisibility(true)
              } else {
                setButtonVisibility(false)
              }
            }}
            options={props.relationshipTypeList}
          />
          <FormControl
            style={{
              width: '100%',
              marginTop: 16
            }}
            variant='outlined'
          >
            <MaterialUISelect
              name='datatype'
              input={<OutlinedInput id='outlined-age-simple' />}
              style={{
                backgroundColor: '#efeff4',
                width: '93%'
              }}
              value={selectedDirection}
              onChange={e => {
                setSelectedDirection(e.target.value)
                setButtonVisibility(true)
              }}
            >
              <MenuItem value='<----'>{'<---- (Incoming)'}</MenuItem>
              <MenuItem value='---->'>{'----> (Outgoing)'}</MenuItem>
            </MaterialUISelect>
          </FormControl>
        </div>
      </div>
    </div>
  )
}

DisplayRelationshipType.propTypes = {
  relationshipType: PropTypes.string
}

export default DisplayRelationshipType
