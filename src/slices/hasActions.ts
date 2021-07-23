import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface HasActions {
  readHasActionsPending: boolean
  updateHasActionsPending: boolean
  profileUuid: string
  hasActionsUuidList: string[]
  addOrRemoveUuid: string
  [propName: string]: any
}

const initialState: HasActions = {
  readHasActionsPending: false,
  updateHasActionsPending: false,
  profileUuid: "",
  hasActionsUuidList: [],
  addOrRemoveUuid: ""
}

const hasActionsSlice = createSlice({
  name: 'hasActions',
  initialState,
  reducers: {
    readHasActionsRequest: (state, { payload }: PayloadAction<any>) => {
      state.profileUuid = payload
      state.hasActionsList = []
      state.hasActionsUuidList = []
      state.readHasActionsPending = true
    },

    readHasActions: (state, { payload }: PayloadAction<any>) => {
      state.hasActionsList = payload
      for (var actions of state.hasActionsList) {
        actions['key'] = actions['Node.uuid']
        state.hasActionsUuidList = [...state.hasActionsUuidList, actions['Node.uuid']]
      }
      state.readHasActionsPending = false
    },

    removeHasActionsRequest: (state, { payload }: PayloadAction<any>) => {
      state.updateHasActionsPending = true
      state.addOrRemoveUuid = payload
      state['tempHasActionsUuidList'] = state.hasActionsUuidList.filter((uuid: any) => uuid !== state.addOrRemoveUuid)
    },

    removeHasActions: (state) => {
      state.hasActionsList = state.hasActionsList.filter((actions: any) => actions['Node.uuid'] !== state.addOrRemoveUuid)
      state.hasActionsUuidList = state.hasActionsUuidList.filter((uuid: any) => uuid !== state.addOrRemoveUuid)
      state.addOrRemoveUuid = ""
      state['tempHasActionsUuidList'] = []
      state.updateHasActionsPending = false
    },

    addHasActionsRequest: (state, { payload }: PayloadAction<any>) => {
      state.updateHasActionsPending = true
      state.addOrRemoveUuid = payload["newAction"]
      state['tempHasActionsUuidList'] = [...state.hasActionsUuidList, state.addOrRemoveUuid]
    },

    addHasActions: (state, { payload }: PayloadAction<any>) => {
      state.hasActionsList = payload
      state.hasActionsUuidList = []
      for (var actions of state.hasActionsList) {
        actions['key'] = actions['Node.uuid']
        state.hasActionsUuidList = [...state.hasActionsUuidList, actions['Node.uuid']]
      }
      state.updateHasActionsPending = false
      state['tempHasActionsUuidList'] = []
      state.addOrRemoveUuid = ""
    }
  }
})

export const { readHasActionsRequest, readHasActions, removeHasActionsRequest, removeHasActions, addHasActionsRequest, addHasActions } = hasActionsSlice.actions;

export default hasActionsSlice.reducer;