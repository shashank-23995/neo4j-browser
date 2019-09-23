import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  FoldersButton,
  FolderButtonContainer,
  StyledFolderLabel
} from '../Sidebar/styled'
import { DrawerSectionBody } from 'browser-components/drawer/index'
import classNames from 'classnames'
import styles from '../DatabaseInfo/style_meta.css'
import { IconContainer } from 'browser-components/icons/IconContainer'
const black = `
  color: #000000;
`
const white = `
  color: #ffffff;
`
export const CollapseMenuIconWhite = () => (
  <IconContainer
    activeStyle={white}
    inactiveStyle={white}
    className='fa fa-caret-down'
  />
)

export const ExpandMenuIconBlack = () => (
  <IconContainer
    activeStyle={black}
    inactiveStyle={black}
    className='fa fa-caret-left'
  />
)

/**
 * Expansion Panel
 * @param {*} props
 */
export const ExpansionPanel = props => {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        marginLeft: 1,
        marginRight: 1,
        marginBottom: 5,
        backgroundColor: open ? '#424650' : '#efeff4',
        padding: 5,
        borderRadius: 5,
        color: '#30333a'
      }}
    >
      <div>
        <StyledFolderLabel>
          <DrawerSectionBody
            className={classNames({
              [styles['wrapper']]: true
            })}
            style={{
              color: open ? 'white' : '#30333a'
            }}
          >
            {props.title}
          </DrawerSectionBody>
        </StyledFolderLabel>
        <FolderButtonContainer
          style={{ color: open ? 'white !important' : '#30333a' }}
        >
          <FoldersButton onClick={() => setOpen(!open)}>
            {open === true ? (
              <CollapseMenuIconWhite />
            ) : (
              <ExpandMenuIconBlack />
            )}
          </FoldersButton>
          &nbsp;
          {props.panelActions && props.panelActions()}
        </FolderButtonContainer>
      </div>
      {open === true && (
        <div
          style={{
            backgroundColor: 'rgb(239, 239, 244)',

            margin: '6px -4px -4px -4px',
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
            padding: 5
          }}
        >
          {props.children}
        </div>
      )}
    </div>
  )
}

ExpansionPanel.propTypes = {
  title: PropTypes.string,
  panelActions: PropTypes.func
}
