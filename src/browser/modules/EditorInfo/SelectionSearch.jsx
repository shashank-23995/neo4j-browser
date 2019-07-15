import React, { useState } from 'react'
import CreatableSelect from 'react-select/creatable'

export const SelectionSearch = props => {
  const [selectedOption, handleChange] = useState(null)
  const { options } = props
  return (
    <CreatableSelect
      isClearable
      value={selectedOption}
      onChange={selectedOption => handleChange(selectedOption)}
      options={options}
    />
  )
}
