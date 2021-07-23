import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CloudState {
  loading: boolean,
  managerID: string,
  badgerInfo: any,
  key_prefix: string,
  addKey: string,
  addValue:string,
  ttl: string,
  deleteKey: string
}

export const initialState: CloudState = {
  loading: false,
  managerID : "",
  badgerInfo:{},
  key_prefix:"",
  addKey: "",
  addValue:"",
  ttl: "",
  deleteKey:""
}

const badgerSlice = createSlice({
  name: "badger",
  initialState,
  reducers: {
    requestBadger:(state, { payload }: PayloadAction<any>) => {
      state.managerID = payload;
    },
    storeBadgerInfo:(state, { payload }: PayloadAction<any>) => {
      state.badgerInfo = payload;
    },
    requestBadgerByKey:(state, { payload }: PayloadAction<any>) => {
      state.key_prefix = payload;
    },
    addBadger: (state, { payload }: PayloadAction<any>) => {
      state.addKey = payload.key;
      state.addValue = payload.value;
      state.ttl = payload.ttl;
    },
    deleteBadger:(state, { payload }: PayloadAction<any>) => {
      state.deleteKey = payload;
    },
  },
});

export const { requestBadger, storeBadgerInfo, requestBadgerByKey, addBadger, deleteBadger } = badgerSlice.actions;

export default badgerSlice.reducer;
