import React from 'react'

function EditProperties (props) {
  console.log('props-->', props)
  const properties = props.properties._fields[0].properties
  return (
    <div>
      {properties &&
        Object.keys(properties).map(key => {
          if (typeof properties[key] !== 'object') {
            return (
              <div key={key}>
                {key}:
                {props.disabled ? (
                  properties[key]
                ) : (
                  <div>
                    <input
                      id='properties'
                      style={{ color: 'black' }}
                      type='text'
                      value={properties[key]}
                      onChange={e => {
                        props.handleChange(key, e)
                      }}
                    />
                  </div>
                )}
              </div>
            )
          } else {
            return (
              <div key={key}>
                {key}:
                {props.disabled ? (
                  <div>
                    {properties[key].high == 0 ? (
                      <div>{properties[key].low}</div>
                    ) : (
                      <div>{properties[key].high}</div>
                    )}
                  </div>
                ) : (
                  <div>
                    {' '}
                    <input
                      id='properties'
                      style={{ color: 'black' }}
                      type='text'
                      value={properties[key]}
                      onChange={e => {
                        props.handleChange(key, e)
                      }}
                    />
                  </div>
                )}
              </div>
            )
          }
        })}
    </div>
  )
}

export default EditProperties
