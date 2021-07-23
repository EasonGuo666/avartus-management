import { message } from "antd";
import { call, put, select } from "redux-saga/effects";
import { getProfile } from "../../selectors";
import { errorAlert } from "../../slices/alert";
import { createProfile, deleteProfile, readProfile, updateProfile } from "../../slices/profile";
import { getHeaders, SURFIX_URL } from "../../utils";
import { postRequest } from "../requests/index";

export function* readProfileSaga(): any {
  var data = {
    "args": ["query", "name", "profile"]
  };
  const header = getHeaders();

  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200 && res.data.result.data) {
      let temp: any = []
      for (var eachProfile of res.data.result.data) {
        try {
          var profileData = {
            "args": ["query", "uuid", eachProfile['Node.uuid']]
          }
          const detailedRes = yield call(postRequest, profileData, SURFIX_URL['graph'], header);
          if (detailedRes.status === 200) {
            if (detailedRes.data.result.data[0]['Profile.recursive']) {
              eachProfile['Profile.recursive'] = detailedRes.data.result.data[0]['Profile.recursive']
            }
          }
          temp.push(eachProfile)
        } catch (error: any) {
          console.log(error)
        }
      }
      yield put(readProfile(temp))
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error);
  }
}

export function* deleteProfileSaga(): any {
  const { updateOrDeleteUuid } = yield select(getProfile);
  var data = {
    "args": ["delete", "uuid", updateOrDeleteUuid]
  }
  const header = getHeaders();
  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      console.log("delete profile success")
      yield put(deleteProfile())
    }
    message.success("Delete Success")
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }
}

export function* updateProfileSaga(): any {
  const { updateOrCreateProfile } = yield select(getProfile);
  let data = {
    "args": ["set", "profile"],
    "vars": {
      "uuid": updateOrCreateProfile['Node.uuid'],
      "label": updateOrCreateProfile['Profile.label'],
    }
  }
  console.log("update data", data)
  const header = getHeaders();
  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      yield put(updateProfile(res.data.result.data[0]))
      console.log("update profile success", res)
    }
    message.success("Update Success")
  }
  catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }
}

export function* createProfileSaga(): any {
  const { updateOrCreateProfile } = yield select(getProfile);
  let data = {
    "args": ["set", "profile"],
    "vars": {
      "label": updateOrCreateProfile['Profile.label']
    }
  }
  console.log("create data:", data)
  const header = getHeaders();

  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      yield put(createProfile(res.data.result.data[0]))
      console.log("create profile success:", res)
    }
    message.success("Create Success")
  }
  catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }
}