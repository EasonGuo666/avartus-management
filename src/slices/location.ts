import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Location {
  locationList: any
  pending: boolean
  updateOrDeleteUuid: string //the uuid of the location need to be updated or deleted
  updateOrCreateLocation: [] //a temp location need to be updated or created
  [propName: string]: any
}

const initialState: Location = {
  locationList: "",
  pending: false,
  updateOrDeleteUuid: "",
  updateOrCreateLocation: [],
}

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    readLocationRequest: (state) => {
      state.pending = true
      state.locationList = []
    },

    readLocation: (state, { payload }: PayloadAction<any>) => {
      state.locationList = payload
      for (var eachLocation of state.locationList) {
        eachLocation['key'] = eachLocation['uid']
        eachLocation['~Node.locate'] = eachLocation['~Node.locate'] ? true : false
      }
      state.pending = false
    },

    createLocationRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrCreateLocation = payload
    },

    createLocation: (state, { payload }: PayloadAction<any>) => {
      payload['key'] = payload['uid']
      payload['~Node.locate'] = false
      state.locationList = [...state.locationList, payload]
      state.updateOrCreateLocation = []
      state.pending = false
    },

    deleteLocationRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrDeleteUuid = payload
    },

    deleteLocation: (state) => {
      state.locationList = state.locationList.filter((location: any) => location['Node.uuid'] !== state.updateOrDeleteUuid)
      state.updateOrDeleteUuid = ""
      state.pending = false
    },

    updateLocationRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrDeleteUuid = payload['Node.uuid']
      state.updateOrCreateLocation = payload
    },

    updateLocation: (state, { payload }: PayloadAction<any>) => {
      payload['key'] = payload['uid']
      payload['~Node.locate'] = payload['~Node.locate'] ? true : false

      state.locationList = state.locationList.map((location: any) =>
        location['Node.uuid'] === state.updateOrDeleteUuid ? payload : location
      )
      state.updateOrDeleteUuid = ""
      state.updateOrCreateLocation = []
      state.pending = false
    }
  }
})

export const { readLocationRequest, readLocation, createLocationRequest, createLocation, deleteLocationRequest, deleteLocation, updateLocation, updateLocationRequest } = locationSlice.actions;

export default locationSlice.reducer;