import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Recursive {
  readRecursivePending: boolean
  updateRecursivePending: boolean
  profileUuid: string
  recursiveUuidList: string[]
  addOrRemoveUuid: string
  [propName: string]: any
}

const initialState: Recursive = {
  readRecursivePending: false,
  updateRecursivePending: false,
  profileUuid: "",
  recursiveUuidList: [],
  addOrRemoveUuid: ""
}

const recursiveSlice = createSlice({
  name: 'recursive',
  initialState,
  reducers: {
    readRecursiveRequest: (state, { payload }: PayloadAction<any>) => {
      state.profileUuid = payload
      state.recursiveList = []
      state.recursiveUuidList = []
      state.readRecursivePending = true
    },

    readRecursive: (state, { payload }: PayloadAction<any>) => {
      state.recursiveList = payload
      for (var profile of state.recursiveList) {
        profile['key'] = profile['Node.uuid']
        state.recursiveUuidList = [...state.recursiveUuidList, profile['Node.uuid']]
      }
      state.readRecursivePending = false
    },

    removeRecursiveRequest: (state, { payload }: PayloadAction<any>) => {
      state.updateRecursivePending = true
      state.addOrRemoveUuid = payload
      state['tempRecursiveUuidList'] = state.recursiveUuidList.filter((uuid: any) => uuid !== state.addOrRemoveUuid)
    },

    removeRecursive: (state) => {
      state.recursiveList = state.recursiveList.filter((profile: any) => profile['Node.uuid'] !== state.addOrRemoveUuid)
      state.recursiveUuidList = state.recursiveUuidList.filter((uuid: any) => uuid !== state.addOrRemoveUuid)
      state.addOrRemoveUuid = ""
      state['tempRecursiveUuidList'] = []
      state.updateRecursivePending = false
    },

    addRecursiveRequest: (state, { payload }: PayloadAction<any>) => {
      state.updateRecursivePending = true
      state.addOrRemoveUuid = payload["newRecursive"]
      state['tempRecursiveUuidList'] = [...state.recursiveUuidList, state.addOrRemoveUuid]
    },

    addRecursive: (state, { payload }: PayloadAction<any>) => {
      state.recursiveList = payload
      state.recursiveUuidList = []
      for (var profile of state.recursiveList) {
        profile['key'] = profile['Node.uuid']
        state.recursiveUuidList = [...state.recursiveUuidList, profile['Node.uuid']]
      }
      state.updateRecursivePending = false
      state['tempRecursiveUuidList'] = []
      state.addOrRemoveUuid = ""
    }
  }
})

export const { readRecursiveRequest, readRecursive, removeRecursiveRequest, removeRecursive, addRecursiveRequest, addRecursive } = recursiveSlice.actions;

export default recursiveSlice.reducer;