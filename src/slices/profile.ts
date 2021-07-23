import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Profile {
  pending: boolean,
  updateOrDeleteUuid: string //the uuid of the action need to be updated or deleted
  updateOrCreateProfile: [] //a temp action need to be updated or created
  [propName: string]: any
}

const initialState: Profile = {
  pending: false,
  updateOrDeleteUuid: "",
  updateOrCreateProfile: []
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    readProfileRequest: (state) => {
      state.pending = true
      state['profileList'] = []
    },

    readProfile: (state, { payload }: PayloadAction<any>) => {
      state['profileList'] = payload
      for (var eachProfile of state['profileList']) {
        eachProfile['key'] = eachProfile['uid'];
      }
      state.pending = false
    },

    createProfileRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrCreateProfile = payload
    },

    createProfile: (state, { payload }: PayloadAction<any>) => {
      payload['key'] = payload['uid']
      state.profileList = [...state.profileList, payload]
      state.updateOrCreateProfile = []
      state.pending = false
    },

    deleteProfileRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrDeleteUuid = payload
    },

    deleteProfile: (state) => {
      state.profileList = state.profileList.filter((profile: any) => profile['Node.uuid'] !== state.updateOrDeleteUuid)
      state.updateOrDeleteUuid = ""
      state.pending = false
    },

    updateProfileRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrDeleteUuid = payload['Node.uuid']
      state.updateOrCreateProfile = payload
    },

    updateProfile: (state, { payload }: PayloadAction<any>) => {
      payload['key'] = payload['uid']
      state.profileList = state.profileList.map((profile: any) =>
        profile['Node.uuid'] === state.updateOrDeleteUuid ? payload : profile
      )
      state.updateOrDeleteUuid = ""
      state.updateOrCreateProfile = []
      state.pending = false
    }
  }
})

export const { readProfileRequest, readProfile, createProfileRequest, createProfile, updateProfileRequest, updateProfile, deleteProfileRequest, deleteProfile } = profileSlice.actions;

export default profileSlice.reducer;