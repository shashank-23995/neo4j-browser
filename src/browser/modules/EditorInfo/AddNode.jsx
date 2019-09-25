import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TickMarkIcon } from 'browser-components/icons/Icons'
import {
  DrawerSection,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import { TextInput } from 'browser-components/Form'
import PartialConfirmationButtons from 'browser-components/buttons/PartialConfirmationButtons'

function Node (props) {
  const [textField, handleToggle] = useState(false)
  const [nodeLabel, handleChange] = useState('')
  return (
    <React.Fragment>
      <button
        onClick={() => handleToggle(!textField)}
        style={{ color: '#30333a', fontSize: 16 }}
      >
        Create Node
      </button>
      {textField ? (
        <DrawerSection>
          <DrawerSectionBody>
            <div style={{ display: 'flex', marginTop: 20 }}>
              <div style={{ flex: 3, fontSize: 16 }}>Node with Label:</div>
              <TextInput
                value={nodeLabel}
                id='nodeLabel'
                style={{
                  width: '120px',
                  flex: 4
                }}
                onChange={() => {
                  handleChange(([event.target.id] = event.target.value))
                }}
              />
              <div style={{ flex: 1 }}>
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
              </div>
            </div>
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
