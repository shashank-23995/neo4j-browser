import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StyledTable, StyledValue, StyledKey } from '../DatabaseInfo/styled'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'
import {
  PlusIcon,
  TickMarkIcon,
  CancelIcon
} from 'browser-components/icons/Icons'
import styled from 'styled-components'
import { TextInput } from 'browser-components/Form'
import { StyledFavFolderButtonSpan } from '../Sidebar/styled'

const IconButton = styled.button`
  margin-left: 4px;
  border: 0;
  background: transparent;
  &:focus {
    outline: none;
  }
`

function AddLabel (props) {
  let { nodeId } = props
  const [textField, handleToggle] = useState(false)
  const [label, handleChange] = useState('')

  return (
    <React.Fragment>
      <StyledFavFolderButtonSpan>
        <IconButton onClick={() => handleToggle(!textField)}>
          <PlusIcon />
        </IconButton>
      </StyledFavFolderButtonSpan>
      {textField ? (
        <StyledTable>
          <StyledKey>Label:</StyledKey>
          <StyledValue>
            <TextInput
              id='label'
              style={{
                width: '120px'
              }}
              onChange={() => {
                handleChange(([event.target.id] = event.target.value))
              }}
            />
          </StyledValue>
          <PartialConfirmationButtons
            cancelIcon={
              <IconButton onClick={() => handleToggle(textField)}>
                <CancelIcon />
              </IconButton>
            }
            onCanceled={() => {
              handleToggle(false)
            }}
            confirmIcon={<TickMarkIcon />}
            onConfirmed={() => {
              handleToggle(!textField)
              props.editEntityAction(
                { label: label, nodeId: nodeId },
                'create',
                'nodeLabel'
              )
            }}
          />
        </StyledTable>
      ) : null}
    </React.Fragment>
  )
}

AddLabel.propTypes = {
  editEntityAction: PropTypes.func,
  nodeId: PropTypes.number
}

export default AddLabel
