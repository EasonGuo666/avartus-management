import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CloudState {
  loading: boolean,
  request: string,
  online: any
  offline: any
  uuid: string,
  deleteUUID: string,
  detailUUID: string,
  configUUID: string,
  managerMap: any,
  serviceDetail: any,
  serviceStatus: any,
  config: any,
  device: string,
  lifetime: number,
  serviceConfig: any,
  updateConfig: any,
}

export const initialState: CloudState = {
  loading: false,
  request: "",
  online: {
    services: {},
    managers: []
  },
  offline: {
    services: {},
    managers: []
  },
  uuid: "",
  deleteUUID: "",
  detailUUID: "",
  configUUID: "",
  managerMap: {},
  serviceDetail: {},
  serviceStatus: {},
  config: "",
  device: "",
  lifetime: 0,
  serviceConfig: {},
  updateConfig: {},
}

const cloudSlice = createSlice({
  name: "cloud",
  initialState,
  reducers: {
    requestOnlineService: (state) => {
      state.loading = true;
      state.request = "online";
    },
    requestOfflineService: (state) => {
      state.loading = true;
      state.request = "offline";
    },
    storeOnlineService: (state, { payload }: PayloadAction<any>) => {
      state.loading = false;
      state.online = payload;
    },
    storeOfflineService: (state, { payload }: PayloadAction<any>) => {
      state.loading = false;
      state.offline = payload;
    },
    requestChild: (state, { payload }: PayloadAction<any>) => {
      state.uuid = payload;
    },
    storeManagerMap: (state, { payload }: PayloadAction<any>) => {
      //state.managerMap.set(payload.manager, payload.subServ)
      state.managerMap[payload.manager] = payload.subServ
    },
    deleteCloudService: (state, { payload }: PayloadAction<any>) => {
      state.deleteUUID = payload;
    },
    requestDetail: (state, { payload }: PayloadAction<any>) => {
      state.detailUUID = payload;
    },
    storeDetail: (state, { payload }: PayloadAction<any>) => {
      state.serviceDetail = payload.detail;
      state.serviceStatus = payload.status;
    },
    sendConfigurations: (state, { payload }: PayloadAction<any>) => {
      state.config = payload;
    },
    sendLifeTime: (state, { payload }: PayloadAction<any>) => {
      state.device = payload.device;
      state.lifetime = payload.lifetime;
    },
    requestConfig: (state, { payload }: PayloadAction<any>) => {
      state.configUUID = payload;
      state.serviceConfig = {};
    },
    storeConfig: (state, { payload }: PayloadAction<any>) => {
      state.serviceConfig = payload;

      if(state.serviceConfig["config"]["CloudGrpcAddr"] ){
      state.serviceConfig["config"]["CloudGrpcAddr"] = payload["config"]["CloudGrpcAddr"].substring(0, payload["config"]["CloudGrpcAddr"].indexOf(':'));
      }
    },
    requestUpdateConfig: (state, { payload }: PayloadAction<any>) => {
      state.updateConfig = payload;
    },
  },
});

export const { requestOnlineService, requestOfflineService, storeOnlineService, storeOfflineService, requestChild, storeManagerMap, deleteCloudService, requestDetail, storeDetail, sendConfigurations, sendLifeTime, requestConfig, storeConfig, requestUpdateConfig } = cloudSlice.actions;

export default cloudSlice.reducer;
