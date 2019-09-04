import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'
import FormControl from '@material-ui/core/FormControl'
import { Select as MaterialUISelect } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'

/**
 * Component to display the relationship direction
 * @param {*} props
 */

function DisplayRelationshipDirection (props) {
  useEffect(() => {
    if (props.relationshipEndpoint === 'from') {
      setSelectedDirection('---->')
    } else if (props.relationshipEndpoint === 'to') {
      setSelectedDirection('<----')
    }
    setButtonVisibility(false)
  }, [])
  const [selectedDirection, setSelectedDirection] = useState(selectedDirection)
  const [showButtons, setButtonVisibility] = useState(false)

  const onConfirmed = () => {
    props.editEntityAction(
      {
        id: props.relationshipId,
        value: props.relationshipType,
        selectedDirection: selectedDirection,
        selectedNodeId: props.selectedNodeId,
        endNodeId: props.value.end.identity.toInt()
      },
      'update',
      'relationshipDirection'
    )
    setButtonVisibility(false)
  }

  const onCanceled = () => {
    setButtonVisibility(false)
  }

  return (
    <div>
      <FormControl
        style={{
          marginBottom: 16,
          minWidth: 205
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
      {showButtons ? (
        <PartialConfirmationButtons
          onConfirmed={onConfirmed}
          onCanceled={onCanceled}
        />
      ) : null}
    </div>
  )
}

DisplayRelationshipDirection.propTypes = {
  relationshipType: PropTypes.string
}

export default DisplayRelationshipDirection
