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
      showButtons: false
    }
  }

  const [relationshipTypeState, setrelationshipType] = useState(initState)

  useEffect(
    () => {
      setrelationshipType({
        relationshipTypeObj: {
          relationshipType: props.relationshipType,
          showButtons: false
        }
      })
    },
    [props.relationshipType]
  )

  const handleChange = e => {
    let selectedNode
    if (
      props.selectedNodeId ===
      props.value.segments[0].relationship.start.toInt()
    ) {
      selectedNode = 'start'
    } else {
      selectedNode = 'end'
    }
    let newState = _.cloneDeep(relationshipTypeState)
    setrelationshipType({
      ...newState,
      relationshipTypeObj: {
        ...newState.relationshipTypeObj,
        relationshipType: e.target.value,
        showButtons: true,
        selectedNode: selectedNode
      }
    })
  }

  const onConfirmed = () => {
    props.editEntityAction(
      {
        id: props.relationshipId,
        value: relationshipTypeState.relationshipTypeObj.relationshipType,
        selectedNode: relationshipTypeState.relationshipTypeObj.selectedNode
      },
      'update',
      'relationshipType'
    )
  }

  const onCanceled = () => {
    setrelationshipType({
      relationshipTypeObj: {
        relationshipType: props.relationshipType,
        showButtons: false
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
        <PartialConfirmationButtons
          onConfirmed={onConfirmed}
          onCanceled={onCanceled}
        />
      ) : null}
    </div>
  )
}

DisplayRelationshipType.propTypes = {
  relationshipType: PropTypes.string
}

export default DisplayRelationshipType
