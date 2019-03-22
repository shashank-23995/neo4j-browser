import React from 'react'

function EditProperties (props) {
  const item = props.item.item._fields[0].properties
  return (
    <div>
      {item &&
        Object.keys(item).map(key => {
          let value
          if (typeof item[key] === 'object') {
            value = item[key].high == 0 ? item[key].low : item[key].high
          } else {
            value = item[key]
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
                    value={item[key]}
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
