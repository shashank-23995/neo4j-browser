import React from 'react'

function AddProperty (props) {
  return (
    <div>
      key:
      <input id='key' style={{ color: 'black' }} onChange={props.addProperty} />
      Value:
      <input
        id='value'
        style={{ color: 'black' }}
        onChange={props.addProperty}
      />
      <hr />
      <div
        data-testid='sidebarMetaItem'
        className='styled__chip-sc-1srdf8s-0 styled__StyledLabel-sc-1srdf8s-1 eGKpnH'
        style={{
          width: '90px',
          height: 'auto',
          float: 'left'
        }}
        onClick={() => {
          props.closeAddProperty()
          props.saveNewProperty()
        }}
      >
        Save
      </div>
      <div
        data-testid='sidebarMetaItem'
        className='styled__chip-sc-1srdf8s-0 styled__StyledLabel-sc-1srdf8s-1 eGKpnH'
        style={{
          width: '90px',
          height: 'auto',
          float: 'right'
        }}
        onClick={() => {
          props.closeAddProperty()
        }}
      >
        Cancel
      </div>
    </div>
  )
}

export default AddProperty
