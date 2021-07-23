import { message } from "antd";
import { call, put, select } from "redux-saga/effects";
import { getUser } from "../../selectors";
import { requestUserList, storeUserList } from "../../slices/user";
import { getHeaders, SURFIX_URL } from "../../utils";
import { deleteRequest, getByParameterRequest, getRequest, postRequest, putRequest2 } from "../requests/index";


export function* getUserSaga(): any {
  const header = getHeaders();
  try {
    const response = yield call(getRequest, SURFIX_URL['users'], header);
    console.log("users: ", response);
    yield put(storeUserList(response.data.users===null? []:response.data.users))
  } catch (error: any) {
    //yield put(logout());
    //yield put(errorAlert({ message: error.response.data.errors }));
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    console.log(error.response)
  }
}

export function* createUserSaga(): any {
  const { newUserInfo } = yield select(getUser);
  const header = getHeaders();
  const data = {
    user: {
      name: newUserInfo.name,
      email: newUserInfo.email,
      phone: newUserInfo.phone,
      trust_level: Number(newUserInfo.trust_level),
      active: newUserInfo.active === "false" ? false : true,
      related_oid: Number(newUserInfo.related_oid)
    }
  }
  console.log("create user data : ", data);
  try {
    const response = yield call(postRequest, data, SURFIX_URL['users'], header);
    console.log("create : ", response);
    message.success("Successfully created:  " + newUserInfo.name);
    yield put(requestUserList());
  } catch (error: any) {
    //yield put(logout());
    //yield put(errorAlert({ message: error.response.data.errors }));
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    console.log(error.response)
  }
}

export function* deleteUserSaga(): any {
  const { deleteId } = yield select(getUser);
  const header = getHeaders();
  try {
    const response = yield call(deleteRequest, SURFIX_URL['users'], deleteId, header);
    console.log("delete: ", response);
    message.success("Deleted:  " + deleteId);
    yield put(requestUserList());
  } catch (error: any) {
    //yield put(logout());
    //yield put(errorAlert({ message: error.response.data.error }));
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    console.log(error.response)
  }
}

export function* updateUserSaga(): any {
  const { updateInfo, updateId } = yield select(getUser);
  const header = getHeaders();
  const data = {
    user: {
      name: updateInfo.name,
      phone: updateInfo.phone,
      trust_level: Number(updateInfo.trust_level),
      active: updateInfo.active ? (updateInfo.active === "false" ? false : true) : null,
      related_oid: Number(updateInfo.related_oid)
    }
  }
  console.log("update user data : ", data);
  try {
    const response = yield call(putRequest2, data, SURFIX_URL['users'], updateId, header);
    console.log("update : ", response);
    message.success("Successfully update:  " + updateInfo.name);
    yield put(requestUserList());
  } catch (error: any) {
    //yield put(logout());
    //yield put(errorAlert({ message: error.response.data.error }));
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    console.log(error.response)
  }
}

export function* searchUserNameSaga(): any {
  const { searchName } = yield select(getUser);
  const header = getHeaders();
  try {
    const response = yield call(getByParameterRequest, SURFIX_URL['user_search_name'], searchName, header);
    console.log("user: ", response);
    yield put(storeUserList(response.data.users===null? []:response.data.users))
  } catch (error: any) {
    //yield put(logout());
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    console.log(error.toString())
  }
}

export function* searchUserEmailSaga(): any {
  const { searchEmail } = yield select(getUser);
  const header = getHeaders();
  try {
    const response = yield call(getByParameterRequest, SURFIX_URL['user_search_email'], searchEmail, header);
    console.log("user: ", response);
    yield put(storeUserList(response.data.users===null? []:response.data.users))
  } catch (error: any) {
    //yield put(logout());
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    console.log(error.toString())
  }
}