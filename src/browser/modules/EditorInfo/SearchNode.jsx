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

const SearchComponent = props => {
  return (
    <div
      style={{
        width: '100%',
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
        // onChange={selectedLabel => {
        //   setSelectedLabel(selectedLabel)
        // }}
        options={props.list}
      />
    </div>
  )
}

const InitialLabel = props => {
  useEffect(() => {}, [props])
  const [val, setVal] = useState(props.search)
  return (
    <div style={{ width: '100%' }}>
      <p style={{ color: '#30333a', fontSize: 13 }}>
        I want to search node with
      </p>
      <div
        style={{
          width: '100%',
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
      {val &&
        val.value === 'Label' && <SearchComponent list={props.labelList} />}

      {val &&
        val.value === 'Property' && (
        <SearchComponent list={props.propertyKeyList} />
      )}
    </div>
  )
}

const defaultList = [
  { label: 'Label', value: 'Label' },
  { label: 'Property', value: 'Property' }
]

function SearchNode (props) {
  const [search, setSearch] = useState(null)
  const [selectedLabel, setSelectedLabel] = useState(null)
  //   const [property, setProperty] = useState(null)
  let [tempArray, setTempArray] = useState([
    // <InitialLabel
    //   search={search}
    //   setSearch={setSearch}
    //   labelList={props.labelList}
    //   propertyKeyList={props.propertyKeyList}
    // />
  ])
  useEffect(() => {
    // props.fetchSelectOptions('node', 'label')
    // props.fetchSelectOptions('node', 'propertyKeys')
    props.fetchSelectOptions('custom', 'label')
    props.fetchSelectOptions('custom', 'propertyKey')
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
                />
              ])
            }
          >
            Add Condition
          </button>
        </DrawerSectionBody>
      </DrawerSection>
    </div>
  )
}

export default SearchNode
