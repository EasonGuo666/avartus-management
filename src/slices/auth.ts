import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
let userToken = localStorage.getItem("token");
if (userToken != null) {
  var userInfo: any = jwt_decode(userToken);
}

export interface AuthState {
  loggingIn: boolean
  loggedIn: boolean
  user: any
  token: string | null
}

const initialState: AuthState = userToken ?
  {
    loggingIn: false,
    loggedIn: true,
    user: {
      username: userInfo.name,
      email: userInfo.email,
      organization: userInfo.organization,
      organization_id: userInfo.organization_id,
      trust_level: userInfo.trust_level,
    },
    token: userToken

  } : {
    loggingIn: false,
    loggedIn: false,
    user: {},
    token: userToken
  }

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state, { payload }: PayloadAction<any>) => {
      state.loggingIn = true;
      state.user = payload;
    },
    loginSuccess: (state, { payload }: PayloadAction<any>) => {
      state.loggingIn = false;
      state.loggedIn = true
      state.user = payload
      state.token = userToken
    },
    logout: (state) => {
      state.loggingIn = false;
      state.loggedIn = false
      state.user = {}
      state.token = ""
    },
    changeUser: (state, { payload }: PayloadAction<any>) => {
      state.user.name = payload;
    },
    verifyToken: (state, { payload }: PayloadAction<any>) => {
      state.token = payload.token
      state.user = payload.userInfo
    }
  },
});

export const { loginRequest, loginSuccess, logout, changeUser, verifyToken } = authSlice.actions;

export default authSlice.reducer;


