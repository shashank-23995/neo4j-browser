import React from 'react'

function EditProperties (props) {
  const itemProperties = props.itemProperties
  return (
    <div>
      {itemProperties &&
        Object.keys(itemProperties).map(key => {
          let value
          if (typeof itemProperties[key] === 'object') {
            value =
              itemProperties[key].high == 0
                ? itemProperties[key].low
                : itemProperties[key].high
          } else {
            value = itemProperties[key]
          }

          return (
            <div key={key}>
              {key}:
              {props.disabled ? (
                value
              ) : (
                <div>
                  <input
                    id='item'
                    style={{ color: 'black' }}
                    type='text'
                    value={itemProperties[key]}
                    onChange={e => {
                      props.handleChange(key, e)
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}

export default EditProperties
