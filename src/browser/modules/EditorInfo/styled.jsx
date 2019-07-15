/*
 * This module contains the css which is used for
 * styling labels and properties in DisplayNodeDetails.
 */

import styled from 'styled-components'
import { StyledKey } from '../DatabaseInfo/styled'
import { EditFolderInput } from '../Sidebar/styled'

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
  text-align: start;
  padding-right: 0;
`

export const EditPropertiesInput = styled(EditFolderInput)`
  margin-bottom: 0.5em;
`

export const RelationshipIconButton = styled.button`
  background: transparent;
  border: none;
  float: right;
  font-size: 80%;
  outline: none;
`

export const CreateRelationshipSelectInput = styled.select`
  color: black;
  border: none;
  outline: none;
  border-radius: 5px;
  line-height: 200%;
  padding-left: 5px;
`
