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

import {
  ExpandMenuIcon,
  CollapseMenuIcon
} from 'browser-components/icons/Icons'
import { IconContainer } from 'browser-components/icons/IconContainer'
const black = `
  color: #000000;
`
export const CollapseMenuIconBlack = () => (
  <IconContainer
    activeStyle={black}
    inactiveStyle={black}
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
    <div>
      <StyledFolderLabel>
        <DrawerSectionBody
          style={{ color: 'black' }}
          className={classNames({
            [styles['wrapper']]: true
          })}
          style={{
            color: '#30333a'
          }}
        >
          {props.title}
        </DrawerSectionBody>
      </StyledFolderLabel>
      <FolderButtonContainer>
        <FoldersButton onClick={() => setOpen(!open)}>
          {open === true ? <CollapseMenuIconBlack /> : <ExpandMenuIconBlack />}
        </FoldersButton>
        &nbsp;
        {props.panelActions && props.panelActions()}
      </FolderButtonContainer>
      {open === true && <div>{props.children}</div>}
    </div>
  )
}

ExpansionPanel.propTypes = {
  title: PropTypes.string,
  panelActions: PropTypes.func
}
