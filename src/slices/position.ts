import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Position {
  cameraUuid: string,
  pending: boolean,
  updateOrDeleteUuid: string,
  updateOrCreatePosition: [], //a temp position need to be updated or created
  [propName: string]: any
}

const initialState: Position = {
  cameraUuid: "",
  pending: false,
  updateOrDeleteUuid: "",
  updateOrCreatePosition: [],
}

const positionSlice = createSlice({
  name: 'position',
  initialState,
  reducers: {
    readPositionRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.cameraUuid = payload;
      state['positionList'] = [];
      state['positionUuidList'] = [];//record every position's uuid and help to update camera
    },

    readPosition: (state, { payload }: PayloadAction<any>) => {
      state['positionList'] = payload;
      for (var eachPosition of state['positionList']) {
        eachPosition['key'] = eachPosition['Node.uuid'];
        state.positionUuidList = [...state.positionUuidList, eachPosition['Node.uuid']]
        eachPosition['Position.pan'] = eachPosition['Position.pan'] ? eachPosition['Position.pan'] : 0
        eachPosition['Position.tilt'] = eachPosition['Position.tilt'] ? eachPosition['Position.tilt'] : 0
        eachPosition['Position.zoom'] = eachPosition['Position.zoom'] ? eachPosition['Position.zoom'] : 0
      }
      state.pending = false
    },

    deletePositionRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrDeleteUuid = payload
    },

    deletePosition: (state) => {
      state.positionList = state.positionList.filter((position: any) => position['Node.uuid'] !== state.updateOrDeleteUuid)
      state.positionUuidList = state.positionUuidList.filter((uuid: any) => uuid !== state.updateOrDeleteUuid)
      state.updateOrDeleteUuid = ""
      state.pending = false
    },

    updatePositionRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrDeleteUuid = payload['Node.uuid']
      state.updateOrCreatePosition = payload
    },

    updatePosition: (state, { payload }: PayloadAction<any>) => {
      payload['key'] = payload['Node.uuid']
      payload['Position.pan'] = payload['Position.pan'] ? payload['Position.pan'] : 0
      payload['Position.tilt'] = payload['Position.tilt'] ? payload['Position.tilt'] : 0
      payload['Position.zoom'] = payload['Position.zoom'] ? payload['Position.zoom'] : 0
      state.positionList = state.positionList.map((position: any) =>
        position['Node.uuid'] === state.updateOrDeleteUuid ? payload : position
      )
      state.updateOrDeleteUuid = ""
      state.updateOrCreatePosition = []
      state.pending = false
    },

    createPositionRequest: (state, { payload }: PayloadAction<any>) => {
      state.pending = true
      state.updateOrCreatePosition = payload;
    },

    createPosition: (state, { payload }: PayloadAction<any>) => {
      payload['key'] = payload['Node.uuid'];
      payload['Position.pan'] = payload['Position.pan'] ? payload['Position.pan'] : 0
      payload['Position.tilt'] = payload['Position.tilt'] ? payload['Position.tilt'] : 0
      payload['Position.zoom'] = payload['Position.zoom'] ? payload['Position.zoom'] : 0
      state.positionList = [...state.positionList, payload]
      state.positionUuidList = [...state.positionUuidList, payload['Node.uuid']]
      state.updateOrCreatePosition = []
      state.pending = false
    }
  }
});

export const { readPositionRequest, readPosition, deletePositionRequest, deletePosition, createPositionRequest, createPosition, updatePositionRequest, updatePosition } = positionSlice.actions;
export default positionSlice.reducer;