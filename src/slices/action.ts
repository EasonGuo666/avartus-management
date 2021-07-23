import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Action {
  device_uuid: string,// action's device's uuid
  pending: boolean,
  updateOrDeleteUuid: string //the uuid of the action need to be updated or deleted
  updateOrCreateAction: any //a temp action need to be updated or created
  [propName: string]: any
}

const initialState: Action = {
  device_uuid: "",
  pending: false,
  updateOrDeleteUuid: "",
  updateOrCreateAction: ""
}

const actionSlice = createSlice({
  name: 'action',
  initialState,
  reducers: {
    readActionRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state['actionList'] = []
      state.device_uuid = payload
    },

    readAction: (state, { payload }: PayloadAction<any>) => {
      state['actionList'] = payload
      for (var eachAction of state['actionList']) {
        eachAction['key'] = eachAction['uid'];
        // if eachAction['~Profile.has_actions'] exist, then this element actually is a list of profile
        // but it is only need to know if the Action has profile
        // transfer it to a boolean value
        eachAction['~Profile.has_actions'] = eachAction['~Profile.has_actions'] ? true : false
        //if eachAction['Action.params'] exist, then keep it, else set it as ""
        eachAction['Action.params'] = eachAction['Action.params'] ? eachAction['Action.params'] : ""
        eachAction['target'] = state.device_uuid
      }
      state.pending = false
    },

    readAllActionRequest: (state) => {
      state.pending = true
      state['allActionList'] = []
    },

    readAllAction: (state, { payload }: PayloadAction<any>) => {
      state['allActionList'] = payload
      state.pending = false
    },

    readActionTree: (state, { payload }: PayloadAction<any>) => {
      state['actionTree'] = payload
    },

    createActionRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrCreateAction = payload
    },

    createAction: (state, { payload }: PayloadAction<any>) => {
      payload['key'] = payload['uid']
      payload['~Profile.has_actions'] = false
      payload['Action.params'] = payload['Action.params'] ? payload['Action.params'] : ""
      state.actionList = [...state.actionList, payload]
      state.updateOrCreateAction = []
      state.pending = false
    },

    deleteActionRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrDeleteUuid = payload
    },

    deleteAction: (state) => {
      state.actionList = state.actionList.filter((action: any) => action['Node.uuid'] !== state.updateOrDeleteUuid)
      state.updateOrDeleteUuid = ""
      state.pending = false
    },

    updateActionRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrDeleteUuid = payload['Node.uuid']
      state.updateOrCreateAction = payload
    },

    updateAction: (state, { payload }: PayloadAction<any>) => {
      payload['key'] = payload['uid']
      payload['~Profile.has_actions'] = payload['~Profile.has_actions'] ? true : false
      payload['target'] = state.updateOrCreateAction['target']
      payload['Action.params'] = payload['Action.params'] ? payload['Action.params'] : ""

      state.actionList = state.actionList.map((action: any) =>
        action['Node.uuid'] === state.updateOrDeleteUuid ? payload : action
      )

      state.actionList = state.actionList.filter((action: any) => action['target'] === state.device_uuid)
      state.updateOrDeleteUuid = ""
      state.updateOrCreateAction = []
      state.pending = false
    }
  }
})

export const { readActionRequest, readAction, readAllActionRequest, readAllAction, readActionTree, createActionRequest, createAction, updateActionRequest, updateAction, deleteActionRequest, deleteAction } = actionSlice.actions;

export default actionSlice.reducer;