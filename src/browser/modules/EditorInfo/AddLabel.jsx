import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StyledTable, StyledValue, StyledKey } from '../DatabaseInfo/styled'
import {
  PlusIcon,
  TickMarkIcon,
  CancelIcon
} from 'browser-components/icons/Icons'
import styled from 'styled-components'
import { TextInput } from 'browser-components/Form'
import { StyledFavFolderButtonSpan } from '../Sidebar/styled'
import { ConfirmationButton } from 'browser-components/buttons/ConfirmationButton'
import TextField from '@material-ui/core/TextField'

const IconButton = styled.div`
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
        <ConfirmationButton
          requestIcon={
            <IconButton
              onClick={() => {
                handleToggle(!textField)
              }}
            >
              <PlusIcon />
            </IconButton>
          }
          cancelIcon={
            <IconButton
              onClick={() => {
                handleToggle(textField)
                handleChange('')
              }}
            >
              <CancelIcon />
            </IconButton>
          }
          confirmIcon={<TickMarkIcon />}
          onConfirmed={() => {
            handleToggle(!textField)
            if (label.length > 0) {
              props.editEntityAction(
                { label: label, nodeId: nodeId },
                'create',
                'nodeLabel'
              )
            } else {
              alert('plzz enter label')
            }
            handleChange('')
          }}
        />
      </StyledFavFolderButtonSpan>
      {textField ? (
        <div
          style={{
            marginLeft: '-9px',
            marginRight: '-9px',
            backgroundColor: '#efeff4',
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px'
          }}
        >
          <TextField
            label='Label'
            margin='normal'
            variant='outlined'
            id='label'
            value={label}
            onChange={() => {
              handleChange(([event.target.id] = event.target.value))
            }}
            style={{
              backgroundColor: '#efeff4',
              width: '93%',
              marginLeft: '8px',
              borderRadius: '5px'
            }}
          />
        </div>
      ) : null}
    </React.Fragment>
  )
}

AddLabel.propTypes = {
  editEntityAction: PropTypes.func,
  nodeId: PropTypes.number
}

export default AddLabel
