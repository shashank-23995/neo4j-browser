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
        >
          {props.title}
        </DrawerSectionBody>
      </StyledFolderLabel>
      <FolderButtonContainer>
        <FoldersButton onClick={() => setOpen(!open)}>
          {open === true ? <CollapseMenuIcon /> : <ExpandMenuIcon />}
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
