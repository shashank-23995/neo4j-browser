import React, { useState, useEffect } from 'react'
import {
  DrawerSection,
  DrawerSubHeader,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import classNames from 'classnames'
import styles from '../DatabaseInfo/style_meta.css'
import Select from 'react-select'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'

const chip = styled.div`
  word-break: break-all;
  cursor: pointer;
  font-family: ${props => props.theme.primaryFontFamily};
  font-weight: bold;
  font-size: 12px;
  background-color: #424650;
  color: #ffffff;
  margin: 4px;
  padding: 3px 7px 3px 7px;
  span {
    line-height: normal;
  }
  text-align: center;
`
export const StyledButton = styled(chip)`
  border-radius: 20px;
`

export const colourStyles = {
  control: provided => ({
    ...provided,
    backgroundColor: '#efeff4',
    width: '93%'
  }),
  placeholder: provided => ({
    ...provided,
    color: '#958d98',
    font: 'inherit',
    padding: 0,
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: '0.00938em'
  }),
  dropdownIndicator: provided => ({
    ...provided,
    color: '#958d98',
    background: 'none',
    padding: 0
  }),
  indicatorSeparator: provided => ({
    ...provided,
    backgroundColor: '#efeff4'
  }),
  clearIndicator: provided => ({
    ...provided,
    padding: 0
  }),
  singleValue: provided => ({
    ...provided,
    fontSize: 13
  })
}

/**
 * Component to search specific node
 * @param {*} props
 */

const SearchComponent = props => {
  const [val, setVal] = useState(props.search)
  const [textfieldFlag, setTextfieldFlag] = useState(false)
  const [textValue, setTextValue] = useState('')
  const [currentValue, setCurrentValue] = useState('')
  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%', display: 'flex' }}>
        <div
          style={{
            width: '50%',
            marginBottom: '16px',
            color: '#30333a',
            fontWeight: 'normal'
          }}
        >
          <Select
            isClearable
            placeholder='Search'
            styles={colourStyles}
            value={val}
            onChange={value => {
              setVal(value)
            }}
            options={defaultList}
          />
        </div>
        <p style={{ color: '#30333a', fontSize: 13 }}>as</p>
        <div
          style={{
            width: '50%',
            marginBottom: '16px',
            color: '#30333a',
            fontWeight: 'normal'
          }}
        >
          <Select
            isClearable
            placeholder='Search'
            styles={colourStyles}
            onChange={selectedValue => {
              if (selectedValue && val && val.value === 'Label') {
                if (!props.selectedLabelArray.includes(selectedValue.value)) {
                  props.setSelectedLabelArray([
                    ...props.selectedLabelArray,
                    selectedValue.value
                  ])
                  setCurrentValue(selectedValue.value)
                }
              } else if (val && val.value === 'Property') {
                if (
                  !props.selectedPropertyKeyArray.includes(selectedValue.value)
                ) {
                  setCurrentValue(selectedValue.value)
                  setTextfieldFlag(true)
                }
              }
            }}
            options={
              val && val.value === 'Label'
                ? props.labelList
                : val && val.value === 'Property'
                  ? props.propertyKeyList
                  : []
            }
          />
        </div>
      </div>
      {textfieldFlag ? (
        <div style={{ width: '100%', marginBottom: 16 }}>
          <TextField
            label='Property Value'
            margin='dense'
            variant='outlined'
            id={currentValue}
            value={textValue}
            onChange={e => {
              setTextValue(e.target.value)
              props.setSelectedPropertyKeyArray([
                ...props.selectedPropertyKeyArray,
                { key: e.target.id, value: e.target.value }
              ])
            }}
            style={{
              backgroundColor: '#efeff4',
              width: '100%',
              borderRadius: '5px'
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

const defaultList = [
  { label: 'Label', value: 'Label' },
  { label: 'Property', value: 'Property' }
]

function SearchNode (props) {
  const [search, setSearch] = useState(null)
  const [selectedLabelArray, setSelectedLabelArray] = useState([])
  const [selectedPropertyKeyArray, setSelectedPropertyKeyArray] = useState([])
  let [searchComponentArray, setSearchComponentArray] = useState([])
  useEffect(() => {
    props.fetchSelectOptions('custom', 'label', {})
    props.fetchSelectOptions('custom', 'propertyKey', {})
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        marginRight: 8,
        marginBottom: 16,
        width: '100%'
      }}
    >
      <DrawerSection
        style={{
          backgroundColor: '#d2d5da',
          padding: 1,
          borderRadius: 5,
          width: '100%'
        }}
      >
        <DrawerSubHeader
          style={{
            padding: '0px 10px',
            backgroundColor: '#424650',
            borderRadius: 5
          }}
        >
          Search Node
        </DrawerSubHeader>
        <DrawerSectionBody
          style={{ marginLeft: 8, marginRight: 8 }}
          className={classNames({
            [styles['wrapper']]: true
          })}
        >
          <p style={{ color: '#30333a', fontSize: 13 }}>
            I want to search node with
          </p>

          {searchComponentArray.map(item => item)}

          <div
            style={{
              display: 'flex',
              marginRight: 8,
              marginBottom: 16,
              width: '100%'
            }}
          >
            <div style={{ width: '100%' }}>
              <StyledButton
                onClick={e => {
                  setSearchComponentArray([
                    ...searchComponentArray,
                    <SearchComponent
                      search={search}
                      setSearch={setSearch}
                      labelList={props.labelList}
                      propertyKeyList={props.propertyKeyList}
                      selectedLabelArray={selectedLabelArray}
                      setSelectedLabelArray={setSelectedLabelArray}
                      selectedPropertyKeyArray={selectedPropertyKeyArray}
                      setSelectedPropertyKeyArray={setSelectedPropertyKeyArray}
                    />
                  ])
                }}
              >
                Add Condition
              </StyledButton>
            </div>
            <div style={{ width: '100%' }}>
              <StyledButton
                onClick={() => {
                  props.fetchSelectOptions('custom', 'node', {
                    selectedLabelArray,
                    selectedPropertyKeyArray
                  })
                }}
              >
                Apply Search
              </StyledButton>
            </div>
          </div>
        </DrawerSectionBody>
      </DrawerSection>
    </div>
  )
}

export default SearchNode
