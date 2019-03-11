const initialState = {
  selectedItem: undefined
}

// Action type constants
export const NAME = 'itemEditor'
export const SET_SELECTED_ITEM = `${NAME}/SET_SELECTED_ITEM`
export const EDIT_SELECTED_ITEM = `${NAME}/EDIT_SELECTED_ITEM`

// Actions

export const setSelectedItem = item => {
  return {
    type: SET_SELECTED_ITEM,
    item
  }
}

export const editSelectedItem = item => {
  return {
    type: EDIT_SELECTED_ITEM,
    item
  }
}

// Reducer
export default function reducer (state = initialState, action) {
  // console.log(action.type);
  switch (action.type) {
    case SET_SELECTED_ITEM:
      return { ...state, selectedItem: action.item }
    case EDIT_SELECTED_ITEM:
      console.log('in reducer', action.item)
      console.log('**', state)
      return state

    default:
      return state
  }
}
