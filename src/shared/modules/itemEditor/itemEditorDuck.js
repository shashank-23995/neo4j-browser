import { handleCypherCommand } from '../commands/helpers/cypher'
import * as _ from 'lodash'

const initialState = {
  selectedItem: undefined,
  neo4jItem: undefined
}

// Action type constants
export const NAME = 'itemEditor'
export const SET_SELECTED_ITEM = `${NAME}/SET_SELECTED_ITEM`
export const EDIT_SELECTED_ITEM = `${NAME}/EDIT_SELECTED_ITEM`
export const FETCH_DATA = `${NAME}/FETCH_DATA`
export const SET_NEO4J_ITEM = `${NAME}/SET_NEO4J_ITEM`

// Actions

export const setSelectedItem = item => {
  return {
    type: SET_SELECTED_ITEM,
    item
  }
}

/**
 *  Action for editing selected item
 */
export const editSelectedItem = item => {
  return {
    type: EDIT_SELECTED_ITEM,
    item
  }
}

/**
 * Fetch data action creator
 * @param {*} id The id of the node.
 */
export const fetchData = id => {
  return {
    type: FETCH_DATA,
    id
  }
}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_ITEM:
      return { ...state, selectedItem: action.item }
    case EDIT_SELECTED_ITEM:
      return { ...state, neo4jItem: action.item }

    case SET_NEO4J_ITEM:
      return { ...state, neo4jItem: action.item }

    default:
      return state
  }
}

// EPICs

/**
 * Epic handle for fetch data
 */
export const handleFetchDataEpic = (action$, store) =>
  action$.ofType(FETCH_DATA).mergeMap(action => {
    const noop = { type: 'NOOP' }
    let cmd = `MATCH (a) where id(a)=${
      action.id
    } RETURN a, ((a)-->()) , ((a)<--())`
    let newAction = _.cloneDeep(action)
    newAction.cmd = cmd
    let [id, request] = handleCypherCommand(newAction, store.dispatch)
    return request
      .then(res => {
        if (res && res.records && res.records.length) {
          console.log(res.records[0])
          store.dispatch({ type: SET_NEO4J_ITEM, item: res.records[0] })
        }
        return noop
      })
      .catch(function (e) {
        throw e
      })
  })

// Epic

export const handleUpdateDataEpic = (action$, store) =>
  action$.ofType(FETCH_DATA).mergeMap(action => {
    const noop = { type: 'NOOP' }
    // console.log("*******");
    let cmd = `MERGE (n) WHERE id(n)=${action.id}
      SET n ={${state.selectedItem.item.properties[0].key}:${
  state.selectedItem.item.properties[0].value
}}
      RETURN n`
    let newAction = _.cloneDeep(action)
    newAction.cmd = cmd
    let [id, request] = handleCypherCommand(newAction, store.dispatch)
    return request
      .then(res => {
        console.log(res.records[0])
        return noop
      })
      .catch(function (e) {
        throw e
      })
  })
