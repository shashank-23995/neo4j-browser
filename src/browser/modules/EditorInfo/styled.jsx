/*
 * This module contains the css which is used for
 * styling labels and properties in DisplayNodeDetails.
 */

import styled from 'styled-components'
import { StyledKey } from '../DatabaseInfo/styled'

export const chip = styled.div`
  word-break: break-all;
  font-family: ${props => props.theme.primaryFontFamily};
  font-weight: bold;
  font-size: 12px;
  border-radius: 20px;
  background-color: #9195a0;
  color: #30333a;
  margin: 4px;
  padding: 3px 7px 3px 7px;
  span {
    line-height: normal;
  }
`

export const StyledKeyEditor = styled(StyledKey)`
  vertical-align: top;
`
