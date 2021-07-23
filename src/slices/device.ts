import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Device {
  locate_uuid: string,// The current uuid of the location of devices shown on devicePage
  pending: boolean,
  updateOrDeleteUuid: string //the uuid of the device need to be updated or deleted
  updateOrCreateDevice: any //a temp device need to be updated or created
  chosenType: string
  [propName: string]: any
}

const initialState: Device = {
  locate_uuid: "",
  pending: false,
  updateOrDeleteUuid: "",
  updateOrCreateDevice: "",
  chosenType: ""
}

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    readDeviceRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true;
      state['deviceList'] = [] //clear the devicelist when read another device details
      state.locate_uuid = payload;
    },

    readDevice: (state, { payload }: PayloadAction<any>) => {
      // Add all devices into the redux store
      state['deviceList'] = payload;
      for (var eachDevice of state['deviceList']) {
        eachDevice['key'] = eachDevice['uid'];
        // record the current location of this device
        eachDevice['locate'] = state.locate_uuid;
        // if '~Action.target' exist, then this element actually is a list of action
        // but it is only need to know if the device has action
        // transfer it to a boolean value
        eachDevice['~Action.target'] = eachDevice['~Action.target'] ? true : false
      }
      state.chosenType = ""
      state.pending = false;
    },

    findSpecificDevice: (state, { payload }: PayloadAction<any>) => {
      console.log("dispatch find", payload);
      state.chosenType = payload;
      state['chosenDevices'] = [];
      for (var eachDevice of state['deviceList']) {
        if (eachDevice['Node.name'].toLowerCase() === payload.toLowerCase()) {
          state['chosenDevices'].push({ ...eachDevice });
        }
      }
    },

    readAllChosenDeviceRequest: (state) => {
      state.pending = true;
      state['allChosenDeviceList'] = []
    },

    readAllChosenDevice: (state, { payload }: PayloadAction<any>) => {
      state['allChosenDeviceList'] = payload
      state.pending = false;
    },

    createDeviceRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrCreateDevice = payload
    },

    createDevice: (state, { payload }: PayloadAction<any>) => {
      payload['key'] = payload['uid']
      payload['~Action.target'] = false
      state.deviceList = [...state.deviceList, payload]
      state.chosenDevices = [...state.chosenDevices, payload]
      state.updateOrCreateDevice = []
      state.pending = false
    },

    deleteDeviceRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrDeleteUuid = payload
    },

    deleteDevice: (state) => {
      state.deviceList = state.deviceList.filter((device: any) => device['Node.uuid'] !== state.updateOrDeleteUuid)
      state.chosenDevices = state.chosenDevices.filter((device: any) => device['Node.uuid'] !== state.updateOrDeleteUuid)
      state.updateOrDeleteUuid = ""
      state.pending = false
    },

    updateDeviceRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrDeleteUuid = payload['Node.uuid']
      state.updateOrCreateDevice = payload
    },

    updateDevice: (state, { payload }: PayloadAction<any>) => {
      console.log("87:", payload);
      payload['key'] = payload['uid']
      payload['~Action.target'] = payload['~Action.target'] ? true : false
      payload['locate'] = state.updateOrCreateDevice['locate']

      state.deviceList = state.deviceList.map((device: any) =>
        device['Node.uuid'] === state.updateOrDeleteUuid ? payload : device
      )
      state.chosenDevices = state.chosenDevices.map((device: any) =>
        device['Node.uuid'] === state.updateOrDeleteUuid ? payload : device
      )

      state.chosenDevices = state.chosenDevices.filter((device: any) => device['locate'] === state.locate_uuid)
      state.deviceList = state.deviceList.filter((device: any) => device['locate'] === state.locate_uuid)

      state.updateOrDeleteUuid = ""
      state.updateOrCreateDevice = []
      state.pending = false
    }
  }
})

export const { readDeviceRequest, readDevice, readAllChosenDevice, readAllChosenDeviceRequest, findSpecificDevice, createDeviceRequest, createDevice, deleteDeviceRequest, deleteDevice, updateDeviceRequest, updateDevice } = deviceSlice.actions;

export default deviceSlice.reducer;