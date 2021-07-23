import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ServiceInfo {
  heartbeat_interval: string,
  timesync_interval: string,
  grpcAuth_token: string,
  readPending: boolean,
  updateHeartbeat: string,
  updateTimesync: string,
  updateGrpcAuth: string,
}

const initialState: ServiceInfo = {
  heartbeat_interval: "",
  timesync_interval: "",
  grpcAuth_token: "",
  readPending: false,
  updateHeartbeat: "",
  updateTimesync: "",
  updateGrpcAuth: ""
}

const serviceInfoSlice = createSlice({
  name: 'serviceInfo',
  initialState,
  reducers: {
    readHeartbeatRequest: (state) => {
      state.heartbeat_interval = ""
      state.readPending = true
    },
    readHeartbeat: (state, { payload }: PayloadAction<any>) => {
      state.heartbeat_interval = payload
      state.readPending = false
    },
    updateHeartbeatRequest: (state, { payload }: PayloadAction<any>) => {
      state.updateHeartbeat = payload
    },
    storeHeartbeat: (state, { payload }: PayloadAction<any>) => {
      state.heartbeat_interval = payload
      state.updateHeartbeat = ""
    },
    readTimesyncRequest: (state) => {
      state.timesync_interval = ""
      state.readPending = true
    },
    readTimesync: (state, { payload }: PayloadAction<any>) => {
      state.timesync_interval = payload
      state.readPending = false
    },
    updateTimesyncRequest: (state, { payload }: PayloadAction<any>) => {
      state.updateTimesync = payload
    },
    storeTimesync: (state, { payload }: PayloadAction<any>) => {
      state.timesync_interval = payload
      state.updateTimesync = ""
    },
    readGrpcAuthRequest: (state) => {
      state.grpcAuth_token = ""
      state.readPending = true
    },
    readGrpcAuth: (state, { payload }: PayloadAction<any>) => {
      state.grpcAuth_token = payload
      state.readPending = false
    },
    updateGrpcAuthRequest: (state, { payload }: PayloadAction<any>) => {
      state.updateGrpcAuth = payload
    },
    storeGrpcAuth: (state, { payload }: PayloadAction<any>) => {
      state.grpcAuth_token = payload
      state.updateGrpcAuth = ""
    },
  }
})

export const { readHeartbeatRequest, readHeartbeat, updateHeartbeatRequest, storeHeartbeat, readGrpcAuthRequest, readGrpcAuth, updateGrpcAuthRequest, storeGrpcAuth, readTimesyncRequest, readTimesync, updateTimesyncRequest, storeTimesync } = serviceInfoSlice.actions;

export default serviceInfoSlice.reducer;