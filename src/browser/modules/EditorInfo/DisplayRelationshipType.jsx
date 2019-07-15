import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { EditPropertiesInput } from './styled'
import { getStringValue } from './utils'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'

/**
 * Component to display the relationship type
 * @param {*} props
 */

function DisplayRelationshipType (props) {
  const initState = {
    relationshipTypeObj: {
      relationshipType: props.relationshipType,
      'relationshipId': props.relationshipId,
      showButtons: false
    }
  }

  const [relationshipTypeState, setrelationshipType] = useState(initState)

  useEffect(
    () => {
      setrelationshipType({
        relationshipTypeObj: {
          relationshipType: props.relationshipType,
          'relationshipId': props.relationshipId,
          showButtons: false
        }
      })
    },
    [props.relationshipType]
  )

  const handleChange = e => {
    setrelationshipType({
      relationshipTypeObj: {
        relationshipType: e.target.value,
        'relationshipId': props.relationshipId,
        showButtons: true
      }
    })
  }

  return (
    <div>
      <EditPropertiesInput
        id='item'
        type='text'
        onChange={e => {
          handleChange(e)
        }}
        value={getStringValue(
          relationshipTypeState.relationshipTypeObj.relationshipType
        )}
      />
      {relationshipTypeState.relationshipTypeObj.showButtons ? (
        <PartialConfirmationButtons />
      ) : null}
    </div>
  )
}

DisplayRelationshipType.propTypes = {
  relationshipType: PropTypes.string
}

export default DisplayRelationshipType
