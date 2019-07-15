import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { EditPropertiesInput } from './styled'
import { getStringValue } from './utils'

/**
 * Component to display the relationship type
 * @param {*} props
 */

function DisplayRelationshipType (props) {
  const initState = {
    relationshipTypeObj: {
      'relationshipType': props.relationshipType
    }
  }
  const [relationshipTypeState, setrelationshipType] = useState(initState)

  useEffect(
    () => {
      setrelationshipType({
        relationshipTypeObj: { 'relationshipType': props.relationshipType }
      })
    },
    [props.relationshipType]
  )

  const handleChange = e => {
    setrelationshipType({
      relationshipTypeObj: { 'relationshipType': e.target.value }
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
    </div>
  )
}

DisplayRelationshipType.propTypes = {
  relationshipType: PropTypes.string
}

export default DisplayRelationshipType
