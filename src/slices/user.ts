import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  loading: boolean
  userList: any
  newUserInfo: any
  deleteId: string
  updateId: string
  updateInfo: any
  searchName: string
  searchEmail: string
}

const initialState: AuthState =
{
  loading: false,
  userList: {},
  newUserInfo: {},
  deleteId: "",
  updateId: "",
  updateInfo: {},
  searchName: "",
  searchEmail: ""
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    requestUserList: (state) => {
      state.loading = true;
    },
    storeUserList: (state, { payload }: PayloadAction<any>) => {
      state.loading = false;
      state.userList = payload;
    },
    createUser: (state, { payload }: PayloadAction<any>) => {
      state.newUserInfo = payload;
    },
    deleteUser: (state, { payload }: PayloadAction<any>) => {
      state.deleteId = payload;
    },
    updateUser: (state, { payload }: PayloadAction<any>) => {
      state.updateId = payload.id;
      state.updateInfo = payload.values;
    },
    requestUserByName: (state, { payload }: PayloadAction<any>) => {
      state.searchName = payload;
    },
    requestUserByEmail: (state, { payload }: PayloadAction<any>) => {
      state.searchEmail = payload;
    },
  },
});

export const { requestUserList, storeUserList, createUser, deleteUser, updateUser, requestUserByName, requestUserByEmail } = userSlice.actions;

export default userSlice.reducer;


