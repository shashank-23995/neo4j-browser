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
export const FETCH_SELECT_OPTIONS_LIST = `${NAME}/FETCH_SELECT_OPTIONS_LIST`
export const SET_RELATIONSHIPTYPE_LIST = `${NAME}/SET_RELATIONSHIPTYPE_LIST`
export const SET_LABEL_LIST = `${NAME}/SET_LABEL_LIST`
export const SET_NODE_LIST = `${NAME}/SET_NODE_LIST`
export const SEARCH_LABEL_LIST = `${NAME}/SEARCH_LABEL_LIST`
export const SEARCH_PROPERTYKEY_LIST = `${NAME}/SEARCH_PROPERTYKEY_LIST`

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

export const fetchSelectOptions = (entityType, serachOperation) => {
  return {
    type: FETCH_SELECT_OPTIONS_LIST,
    entityType,
    serachOperation
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
    case FETCH_SELECT_OPTIONS_LIST:
      return state
    case SET_RELATIONSHIPTYPE_LIST:
      return {
        ...state,
        relationshipTypeList: action.relationshipTypeList
      }
    case SET_LABEL_LIST:
      return {
        ...state,
        labelList: action.labelList
      }
    case SET_NODE_LIST:
      return {
        ...state,
        nodeList: action.nodeList
      }
    case SEARCH_LABEL_LIST:
      return {
        ...state,
        labelList: action.labelList
      }
    case SEARCH_PROPERTYKEY_LIST:
      return {
        ...state,
        propertyKeyList: action.propertyKeyList
      }
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
    let cmd = `MATCH (a) where id(a)=${
      action.id
    } RETURN a, ((a)-->()) , ((a)<--())`
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
    case 'spatial':
      const zValue =
        action.editPayload.value.z || action.editPayload.value.z === 0
          ? `z: ${action.editPayload.value.z},`
          : ''
      convertedValue = `point({ x: ${action.editPayload.value.x}, y: ${
        action.editPayload.value.y
      }, ${zValue} srid: ${action.editPayload.value.srid} })`
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
        switch (action.entityType) {
          case 'node':
            cmd = `CREATE (a:\`${
              action.editPayload.nodeLabel
            }\`) RETURN a, ((a)-->()) , ((a)<--())`
            break
          case 'nodeLabel':
            cmd = `MATCH (a) WHERE id(a)=${action.editPayload.nodeId} SET a:\`${
              action.editPayload.label
            }\` RETURN a, ((a)-->()) , ((a)<--())`
            break
          case 'nodeProperty':
            cmd = `MATCH (a)
        WHERE ID(a) = ${action.editPayload.id}
        SET a.\`${action.editPayload.key}\` = ${getCypherCompatibleValue(
  action
)}
        RETURN a, ((a)-->()) , ((a)<--())`
            break
          case 'relationship':
            if (action.editPayload.direction === '---->') {
              cmd = `MATCH (a:\`${action.editPayload.startNodeLabel}\`),(b:\`${
                action.editPayload.endNodeLabel
              }\`)
                WHERE ID(a) = ${action.editPayload.startNodeId} AND ID(b) = ${
  action.editPayload.endNodeId
}
                CREATE (a)-[r:\`${action.editPayload.relationshipType}\`]->(b)
                RETURN  a, ((a)-->()) , ((a)<--())`
            } else if (action.editPayload.direction === '<----') {
              cmd = `MATCH (a:\`${action.editPayload.startNodeLabel}\`),(b:\`${
                action.editPayload.endNodeLabel
              }\`)
                WHERE ID(a) = ${action.editPayload.startNodeId} AND ID(b) = ${
  action.editPayload.endNodeId
}
                CREATE (b)-[r:\`${action.editPayload.relationshipType}\`]->(a)
                RETURN  a, ((a)-->()) , ((a)<--())`
            }
            break
          case 'relationshipProperty':
            cmd = `MATCH (a)-[r]-(a)
              WHERE id(r)=${action.editPayload.relationshipId} and id(a)=${
  action.editPayload.id
}
              SET r.\`${action.editPayload.key}\` = ${getCypherCompatibleValue(
  action
)}
              RETURN a, ((a)-->()) , ((a)<--())`
            break
          default:
            break
        }
        break
      case 'update':
        switch (action.entityType) {
          case 'nodeLabel':
            cmd = `MATCH (a) WHERE id(a)=${action.editPayload.nodeId} 
              REMOVE a:\`${action.editPayload.previousLabelValue}\`
              SET a:\`${action.editPayload.labelName}\`
              RETURN a, ((a)-->()), ((a)<--())`
            break
          case 'nodeProperties':
            cmd = `MATCH (a) WHERE id(a)=${action.editPayload.nodeId} 
              REMOVE a.\`${action.editPayload.oldProperties}\`
              SET a.\`${action.editPayload.key}\` = ${getCypherCompatibleValue(
  action
)}
              RETURN a, ((a)-->()), ((a)<--())`
            break
          case 'relationship':
            // relationship type
            let matchParameter = '(a)-[r]->(to)'
            if (action.editPayload.selectedNodeEndpoint === 'end') {
              matchParameter = '(a)<-[r]-(to)'
            }
            // relationship direction
            let setParameter = `(a)-[r2:\`${action.editPayload.value}\`]->(to)`
            if (action.editPayload.selectedDirection === '---->') {
              setParameter = `(a)-[r2:\`${action.editPayload.value}\`]->(to)`
            } else if (action.editPayload.selectedDirection === '<----') {
              setParameter = `(a)<-[r2:\`${action.editPayload.value}\`]-(to)`
            }
            cmd = `MATCH ${matchParameter} WHERE ID(r)= ${
              action.editPayload.id
            } WITH a, r, to CREATE ${setParameter} SET r2 = r WITH r, a DELETE r  RETURN a, ((a)-->()) , ((a)<--())`
            break
          case 'relationshipProperties':
            cmd = `MATCH (a)-[r]-(a)
              WHERE id(r)=${action.editPayload.relationshipId} AND id(a)=${
  action.editPayload.nodeId
}
              REMOVE r.\`${action.editPayload.oldProperties}\`
              SET r.\`${action.editPayload.key}\` = ${getCypherCompatibleValue(
  action
)}
              RETURN a, ((a)-->()), ((a)<--())`
            break
          default:
            break
        }
        break
      case 'delete':
        switch (action.entityType) {
          case 'node':
            cmd = `MATCH (p:\`${action.editPayload.firstLabel}\`) where ID(p)=${
              action.editPayload.nodeId
            } OPTIONAL MATCH (p)-[r]-() DELETE r, p`
            break
          case 'nodeLabel':
            cmd = `MATCH (a) WHERE id(a)=${action.editPayload.nodeId} 
              REMOVE a:\`${action.editPayload.labelName}\`
              RETURN a, ((a)-->()), ((a)<--())`
            break
          case 'nodeProperty':
            cmd = `MATCH (a:\`${action.editPayload.label}\`) where ID(a)=${
              action.editPayload.nodeId
            } REMOVE a.\`${
              action.editPayload.propertyKey
            }\` RETURN a, ((a)-->()) , ((a)<--())`
            break
          case 'relationship':
            cmd = `MATCH ()-[r]-() WHERE ID(r)=${
              action.editPayload.relationshipId
            } DELETE r WITH 1 as nothing
              MATCH (a) WHERE ID(a)= ${action.editPayload.nodeId} 
              RETURN a,((a)-->()) , ((a)<--())`
            break
          case 'relationshipProperty':
            cmd = `MATCH (a)-[r:\`${
              action.editPayload.type
            }\`]-(a) WHERE ID(r)=${
              action.editPayload.relationshipId
            } AND id(a)=${action.editPayload.selectedNodeId} REMOVE r.\`${
              action.editPayload.propertyKey
            }\` RETURN a, ((a)-->()) , ((a)<--())`
            break
          default:
            break
        }
        break
      default:
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

/**
 * Epic to fetch selection options for creating new relationship on selecting the node
 */
export const handleFetchSelectOptionsEpic = (action$, store) =>
  action$.ofType(FETCH_SELECT_OPTIONS_LIST).mergeMap(action => {
    const noop = { type: 'NOOP' }
    if (!action.serachOperation) {
      return Promise.resolve().then(() => {
        store.dispatch({ type: SET_RECORD, item: undefined })
        return noop
      })
    }
    let cmd = `CALL db.labels() YIELD label RETURN COLLECT(label) as result`
    if (action.entityType === 'custom') {
      if (action.serachOperation === 'label') {
        cmd = `CALL db.labels() YIELD label RETURN COLLECT(label) as result`
      } else if (action.serachOperation === 'propertyKey') {
        cmd = `CALL db.propertyKeys() YIELD propertyKey RETURN COLLECT(propertyKey) as result`
      }
    } else {
      cmd = `CALL db.relationshipTypes() YIELD relationshipType RETURN {name:'relationshipTypes', data:COLLECT(relationshipType)} as result`
      if (action.serachOperation === 'relationshipType') {
        cmd = `CALL db.relationshipTypes() YIELD relationshipType RETURN {name:'relationshipTypes', data:COLLECT(relationshipType)} as result`
      } else if (action.serachOperation === 'label') {
        cmd = `CALL db.labels() YIELD label RETURN {name:'labels', data:COLLECT(label)} as result`
      } else {
        cmd = `MATCH (n:\`${action.serachOperation}\`) RETURN n`
      }
    }
    let newAction = _.cloneDeep(action)
    newAction.cmd = cmd
    let [id, request] = handleCypherCommand(newAction, store.dispatch)
    return request
      .then(res => {
        if (res && res.records) {
          if (action.entityType === 'custom') {
            if (action.serachOperation === 'label') {
              let optionsList = res.records[0]._fields[0].map((item, index) => {
                return {
                  label: item,
                  value: item
                }
              })
              store.dispatch({
                type: SEARCH_LABEL_LIST,
                labelList: optionsList
              })
            } else if (action.serachOperation === 'propertyKey') {
              let optionsList = res.records[0]._fields[0].map((item, index) => {
                return {
                  label: item,
                  value: item
                }
              })
              store.dispatch({
                type: SEARCH_PROPERTYKEY_LIST,
                propertyKeyList: optionsList
              })
            }
          } else {
            if (action.serachOperation === 'relationshipType') {
              let optionsList = res.records[0]._fields[0].data.map(
                (item, index) => {
                  return { label: item, value: item }
                }
              )
              store.dispatch({
                type: SET_RELATIONSHIPTYPE_LIST,
                relationshipTypeList: optionsList
              })
            } else if (action.serachOperation === 'label') {
              let optionsList = res.records[0]._fields[0].data.map(
                (item, index) => {
                  return {
                    label: item,
                    value: item
                  }
                }
              )
              store.dispatch({
                type: SET_LABEL_LIST,
                labelList: optionsList
              })
            } else {
              let optionsList = res.records.map((record, index) => {
                return {
                  label: Object.values(
                    record._fields[0].properties
                  )[0].toString(),
                  value: record._fields[0]
                }
              })
              store.dispatch({
                type: SET_NODE_LIST,
                nodeList: optionsList
              })
            }
          }
        }
        return noop
      })
      .catch(function (e) {
        throw e
      })
  })
