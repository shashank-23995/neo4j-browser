import React from 'react'

function EditProperties (props) {
  return (
    <div>
      {props.properties.map((item, index) => (
        <p key={index}>
          {' '}
          {item.key} :{' '}
          {props.disabled ? (
            item.value
          ) : (
            <input
              id='properties'
              style={{ color: 'black' }}
              type='text'
              value={item.value}
              onChange={e => {
                props.handleChange(item.key, e)
              }}
            />
          )}
        </p>
      ))}
    </div>
  )
}

export default EditProperties
