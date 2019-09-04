import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'
import CreatableSelect from 'react-select/creatable'

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
  }, [])
  const [selectedType, setSelectedType] = useState(props.relationshipType)
  const [showButtons, setButtonVisibility] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)

  const onConfirmed = () => {
    props.editEntityAction(
      {
        id: props.relationshipId,
        value: selectedType.value,
        selectedNode: selectedNode
      },
      'update',
      'relationshipType'
    )
    setButtonVisibility(false)
  }

  const onCanceled = () => {
    setButtonVisibility(false)
  }

  return (
    <div>
      <CreatableSelect
        isClearable
        defaultInputValue={selectedType}
        value={selectedType}
        onChange={selectedType => {
          setSelectedType(selectedType)
          setButtonVisibility(true)
        }}
        options={props.relationshipTypeList}
      />
      {showButtons ? (
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
