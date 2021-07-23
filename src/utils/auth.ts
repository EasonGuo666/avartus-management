import { message } from "antd";
import jwt_decode from "jwt-decode";
import { history, store, SURFIX_URL } from ".";
import { postRequest } from "../saga/requests";
import { loginRequest, loginSuccess, logout } from "../slices/auth";

export async function login(username: string, password: string, remember: boolean) {
  store.dispatch(loginRequest({ username: username, remember: remember }));

  let data: any; //JSON

  data = remember
    ? {
      email: username,
      password: password,
      expire: "2592000", // 30 days in seconds
    }
    : {
      email: username,
      password: password,
    };

  try {
    const response = await postRequest(data, SURFIX_URL['auth'], {})

    console.log("response: ", response);

    if (response.status === 200) {
      if (response.data.result.otp_uuid) {
        store.dispatch(
          loginSuccess({
            username: username,
            otp_uuid: response.data.result.otp_uuid,
          })
        );
        history.push({ pathname: "/otp" });
      } else if (response.data.result.token) {
        localStorage.setItem("token", response.data.result.token);
        const userInfo = decodeToken();
        store.dispatch(
          loginSuccess(userInfo)
        );
        history.push({ pathname: "/" });
      }
    }
  } catch (error: any) {
    store.dispatch(logout());
    //store.dispatch(errorAlert({ message: error.response.data.error.toString() }));
    if (error.response) {
      message.error("Failed:  " + error.response.data.error.toString(), 6);
    } else {
      message.error("Failed:  " + error.toString(), 6);
    }
    console.log(error.response);
  }
}

export function decodeToken() {
  const token = localStorage.getItem("token");
  if (token != null) {
    return jwt_decode(token);
  } else {
    return null;
  }
}

export function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Accept": "application/json, text/plain, */*",
    'Content-Type': 'application/json',
    'Authorization': 'JWT ' + token
  }
}
