import { message } from "antd";
import { call, put, select } from "redux-saga/effects";
import { getAuth } from "../../selectors";
import { loginSuccess, logout } from "../../slices/auth";
import { decodeToken, getHeaders, history, ORGNIZATION_ID, SURFIX_URL } from "../../utils";
import { postRequest } from "../requests/index";


export function* loginSaga(): any {
  const { user } = yield select(getAuth);
  console.log(user);
  let data: any; //JSON
  if (user.otp_uuid) {
    const { otp_uuid, code } = user;
    data = {
      otp_uuid: otp_uuid,
      otp: code,
    };
  } else {
    return;
  }
  console.log("post api request data: ", data)
  try {
    const response = yield call(postRequest, data, SURFIX_URL['auth'], {});
    console.log("response: ", response);
    if (response.status === 200) {
      if (response.data.result.token) {
        localStorage.setItem("token", response.data.result.token);
        const userInfo = decodeToken();
        yield put(loginSuccess(userInfo));
        history.push({ pathname: "/" });
      }
    }
  } catch (error: any) {
    yield put(logout());
    // yield put(errorAlert({ message: error.response.data.error.toString() }));
    if (error.response) {
      message.error("Failed:  " + error.response.data.error.toString(), 6);
    } else {
      message.error("Failed:  " + error.toString(), 6);
    }
    console.log(error.response)
  }
}

// verify if token is valid and expired, if it's expired, redirect to login page
export function* verifyTokenSaga(): any {
  const { user } = yield select(getAuth);
  const data =
  {
    admin_level: user.trust_level,
    org_id: ORGNIZATION_ID
  }
  const header = getHeaders();
  try {
    const response = yield call(postRequest, data, SURFIX_URL['valid'], header);
    var expireTime: Date = new Date(response.data.result.expires_at);
    var dateNow: Date = new Date();
    // convert to timestamp number
    var expireStamp = Number.parseInt(expireTime.getTime().toString().substring(0, 10));
    var nowStamp = Number.parseInt(dateNow.getTime().toString().substring(0, 10));
    if (expireStamp < nowStamp) {
      console.log('Token has Expired');
      yield put(logout());
      history.push({ pathname: "/login" });
    }
    console.log(response);
  } catch (error: any) {
    console.log(error.response)
    yield put(logout());
    history.push({ pathname: "/login" });
  }
}