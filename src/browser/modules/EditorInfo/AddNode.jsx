import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { StyledTable, StyledValue, StyledKey } from '../DatabaseInfo/styled'
import { TickMarkIcon } from 'browser-components/icons/Icons'
import {
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { TextInput } from 'browser-components/Form'
import styled from 'styled-components'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'

const IconButton = styled.div`
  margin-left: 4px;
  border: 0;
  background: transparent;
  &:focus {
    outline: none;
  }
`

function Node (props) {
  const [textField, handleToggle] = useState(false)
  const [nodeLabel, handleChange] = useState('')
  return (
    <React.Fragment>
      <button onClick={() => handleToggle(!textField)}>Create Node</button>
      {textField ? (
        <DrawerSection>
          <DrawerSectionBody>
            <PartialConfirmationButtons
              icon={<TickMarkIcon />}
              onCanceled={() => {
                handleToggle(!textField)
                handleChange('')
              }}
              onConfirmed={() => {
                handleToggle(!textField)
                if (nodeLabel.length > 0) {
                  props.editEntityAction(
                    { nodeLabel: nodeLabel },
                    'create',
                    'node'
                  )
                } else {
                  alert('plzz enter node')
                }
              }}
            />
            <StyledTable>
              <StyledKey>Node with Label:</StyledKey>
              <StyledValue>
                <TextInput
                  value={nodeLabel}
                  id='nodeLabel'
                  style={{
                    width: '120px'
                  }}
                  onChange={() => {
                    handleChange(([event.target.id] = event.target.value))
                  }}
                />
              </StyledValue>
            </StyledTable>
          </DrawerSectionBody>
        </DrawerSection>
      ) : null}
    </React.Fragment>
  )
}

Node.propTypes = {
  editEntityAction: PropTypes.func
}

export default Node
