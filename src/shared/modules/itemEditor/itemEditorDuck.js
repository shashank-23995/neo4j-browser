import { handleCypherCommand } from '../commands/helpers/cypher'
import * as _ from 'lodash'
const initialState = {
  record: undefined,
  entityType: undefined
}
// Action type constants
export const NAME = 'itemEditor'
export const SET_RECORD = `${NAME}/SET_RECORD`
export const FETCH_DATA_ON_SELECT = `${NAME}/FETCH_DATA_ON_SELECT`
export const EDIT_ENTITY_ACTION_CONSTANT = `${NAME}/EDIT_ENTITY_ACTION_CONSTANT`
export const REMOVE_PROPERTY = `${NAME}/REMOVE_PROPERTY`

// Actions
/**
 * Fetch data action creator
 * @param {number} id The id of selected entity for which we will fetch data
 * @param {string} entityType the selected entity type
 */
export const fetchData = (id, entityType) => {
  return {
    type: FETCH_DATA_ON_SELECT,
    id,
    entityType
  }
}

/**
 * Edit Entity action creator
 * @param {object} editPayload the payload received for the operations
 * @param {string} editType edit type (create, update, delete)
 * @param {string} entityType entity type (node, relationship)
 */
export const editEntityAction = (editPayload, editType, entityType) => {
  return {
    type: EDIT_ENTITY_ACTION_CONSTANT,
    editPayload,
    editType,
    entityType
  }
}

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case SET_RECORD:
      return { ...state, record: action.item }
    case FETCH_DATA_ON_SELECT:
      return { ...state, entityType: action.entityType }
    case EDIT_ENTITY_ACTION_CONSTANT:
      return state
    default:
      return state
  }
}

/**
 * Epic to fetch data on selecting the node/relationship from database
 */
export const handleFetchDataEpic = (action$, store) =>
  action$.ofType(FETCH_DATA_ON_SELECT).mergeMap(action => {
    const noop = { type: 'NOOP' }
    if (!action.id) {
      return Promise.resolve().then(() => {
        store.dispatch({ type: SET_RECORD, item: undefined })
        return noop
      })
    }
    let cmd = `MATCH (a) where id(a)=${action.id} RETURN a, ((a)-->()) , ((a)<--())`
    if (action.entityType === 'relationship') {
      cmd = `MATCH ()-[r]->() where id(r)=${action.id} RETURN r`
    }
    let newAction = _.cloneDeep(action)
    newAction.cmd = cmd
    let [id, request] = handleCypherCommand(newAction, store.dispatch)
    return request
      .then(res => {
        if (res && res.records && res.records.length) {
          store.dispatch({ type: SET_RECORD, item: res.records[0] })
        }
        return noop
      })
      .catch(function (e) {
        throw e
      })
  })

/**
 * This function returns the cypher compatible value of the received value.
 */
function getCypherCompatibleValue (action) {
  let convertedValue = ''
  switch (action.editPayload.dataType) {
    case 'string':
      convertedValue = `'${action.editPayload.value}'`
      break
    case 'number':
      convertedValue = `toInt('${action.editPayload.value.toString()}')`
      break
    case 'boolean':
      convertedValue = `toBoolean('${action.editPayload.value.toString()}')`
      break
    case 'date':
      convertedValue = `date('${action.editPayload.value.toString()}')`
      break
    default:
      convertedValue = `'${action.editPayload.value}'`
      break
  }
  return convertedValue
}

/**
 * Epic to handle edit operation (create, update, delete)
 * This will handle all three edit types viz. create, update, delete (may be by means of switch)
 * every sub operation inturn may handle the case for node and reletionship
 */
export const handleEditEntityEpic = (action$, store) =>
  action$.ofType(EDIT_ENTITY_ACTION_CONSTANT).mergeMap(action => {
    const noop = { type: 'NOOP' }
    let cmd
    switch (action.editType) {
      case 'create':
        getCypherCompatibleValue(action)
        if (action.entityType === 'nodeProperty') {
          cmd = `MATCH (a)
        WHERE ID(a) = ${action.editPayload.id}
        SET a.${action.editPayload.key} = ${getCypherCompatibleValue(action)}
        RETURN a, ((a)-->()) , ((a)<--())`
        }
        if (action.entityType === 'node') {
          cmd = `CREATE (a:${action.editPayload.nodeLabel}) RETURN a, ((a)-->()) , ((a)<--())`
        }
        break
      case 'update':
        if (action.entityType === 'relationshipType') {
          let matchParameter = '(a)-[r]->(to)'
          let setParameter = `(a)-[r2:${action.editPayload.value}]->(to)`
          if (action.editPayload.selectedNode === 'end') {
            matchParameter = '(a)<-[r]-(to)'
            setParameter = `(a)<-[r2:${action.editPayload.value}]-(to)`
          }
          cmd = `MATCH ${matchParameter} WHERE ID(r)= ${action.editPayload.id} WITH a, r, to CREATE ${setParameter} SET r2 = r WITH r, a DELETE r  RETURN a, ((a)-->()) , ((a)<--())`
        } else if (action.entityType === 'nodeLabel') {
          cmd = `MATCH (a) WHERE id(a)=${action.editPayload.nodeId} 
        REMOVE a:${action.editPayload.previousLabelValue}
        SET a:${action.editPayload.labelName}
        RETURN a, ((a)-->()), ((a)<--())`
        }
        break
      case 'delete':
        if (action.entityType === 'node') {
          cmd = `MATCH (p:${action.editPayload.firstLabel}) where ID(p)=${action.editPayload.nodeId} OPTIONAL MATCH (p)-[r]-() DELETE r, p`
        } else if (action.entityType === 'relationship') {
          cmd = `MATCH ()-[r]-() WHERE ID(r)=${action.editPayload.relationshipId} DELETE r WITH 1 as nothing
          MATCH (a) WHERE ID(a)= ${action.editPayload.nodeId} 
          RETURN a,((a)-->()) , ((a)<--())`
        } else if (action.entityType === 'nodeProperty') {
          cmd = `MATCH (a:${action.editPayload.label}) where ID(a)=${action.editPayload.nodeId} REMOVE a.${action.editPayload.propertyKey} RETURN a, ((a)-->()) , ((a)<--())`
        } else if (action.entityType === 'relationshipProperty') {
          cmd = `MATCH ()-[r:${action.editPayload.type}]-() WHERE ID(r)=${action.editPayload.relationshipId} REMOVE r.${action.editPayload.propertyKey} RETURN r`
        } else if (action.entityType === 'nodeLabel') {
          cmd = `MATCH (a) WHERE id(a)=${action.editPayload.nodeId} 
           REMOVE a:${action.editPayload.labelName}
           RETURN a, ((a)-->()), ((a)<--())`
        }
        break
    }
    // Below code will be common to all above kind of operations
    if (cmd) {
      let newAction = _.cloneDeep(action)
      newAction.cmd = cmd
      let [id, request] = handleCypherCommand(newAction, store.dispatch)
      return request
        .then(res => {
          store.dispatch({ type: SET_RECORD, item: res.records[0] })
          return noop
        })
        .catch(function (e) {
          throw e
        })
    } else {
      return noop
    }
  })
