import React, { useState, useEffect } from 'react'
import {
  DrawerSection,
  DrawerSubHeader,
  DrawerSectionBody
} from 'browser-components/drawer/index'
import classNames from 'classnames'
import styles from '../DatabaseInfo/style_meta.css'
import Select from 'react-select'
import { colourStyles } from './CreateRelationship'

/**
 * Component to search specific node
 * @param {*} props
 */

const InitialLabel = props => {
  const [val, setVal] = useState(props.search)
  return (
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
          // value={selectedLabel}
          onChange={selectedValue => {
            if (val && val.value === 'Label') {
              if (!props.selectedLabelArray.includes(selectedValue.value)) {
                props.setSelectedLabelArray([
                  ...props.selectedLabelArray,
                  selectedValue.value
                ])
              }
            } else if (val && val.value === 'Property') {
              if (
                !props.selectedPropertyKeyArray.includes(selectedValue.value)
              ) {
                props.setSelectedPropertyKeyArray([
                  ...props.selectedPropertyKeyArray,
                  selectedValue.value
                ])
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
  let [tempArray, setTempArray] = useState([
    // <InitialLabel
    //   search={search}
    //   setSearch={setSearch}
    //   labelList={props.labelList}
    //   propertyKeyList={props.propertyKeyList}
    // />
  ])
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

          {tempArray.map(item => item)}

          <button
            onClick={() =>
              setTempArray([
                ...tempArray,
                <InitialLabel
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
            }
          >
            Add Condition
          </button>
          <button
            onClick={() => {
              console.log('propertyKeyArray - ', selectedPropertyKeyArray)
              console.log('labelArray - ', selectedLabelArray)
              props.fetchSelectOptions('custom', 'node', {
                selectedLabelArray,
                selectedPropertyKeyArray
              })
            }}
          >
            Apply Search
          </button>
          <div
            style={{
              width: '100%',
              marginTop: '16px',
              marginBottom: '16px',
              color: '#30333a',
              fontWeight: 'normal'
            }}
          >
            <Select
              isClearable
              placeholder='Result'
              styles={colourStyles}
              // value={val}
              // onChange={value => {
              //   setVal(value)
              // }}
              options={props.nodeList}
            />
          </div>
        </DrawerSectionBody>
      </DrawerSection>
    </div>
  )
}

export default SearchNode
