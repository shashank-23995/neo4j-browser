import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'
import FormControl from '@material-ui/core/FormControl'
import { Select as MaterialUISelect } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import OutlinedInput from '@material-ui/core/OutlinedInput'

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
          width: '100%',
          marginBottom: 16
        }}
        variant='outlined'
      >
        <MaterialUISelect
          name='datatype'
          input={<OutlinedInput id='outlined-age-simple' />}
          style={{
            backgroundColor: '#efeff4',
            width: '93%',
            marginLeft: '8px',
            borderRadius: '5px',
            height: 40
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
