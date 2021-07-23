import { message } from "antd";
import { call, put, select } from "redux-saga/effects";
import { getRecursive } from "../../selectors";
import { errorAlert } from "../../slices/alert";
import { addRecursive, readRecursive, removeRecursive } from "../../slices/recursive";
import { getHeaders, SURFIX_URL } from "../../utils";
import { postRequest } from "../requests/index";

export function* readRecursiveSaga(): any {
  const { profileUuid } = yield select(getRecursive);
  const header = getHeaders();
  var data = {
    "args": ["query", "uuid", profileUuid]
  }
  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200 && res.data.result.data) {
      let temp = []
      if (res.data.result.data[0]['Profile.recursive']) {
        temp = res.data.result.data[0]['Profile.recursive']
      }
      yield put(readRecursive(temp))
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error);
  }
}

export function* removeRecursiveSaga(): any {
  const { profileUuid, tempRecursiveUuidList } = yield select(getRecursive);
  const header = getHeaders();
  let data = {
    "args": ["set", "profile"],
    "vars": {
      "uuid": profileUuid,
      "recursive": (tempRecursiveUuidList).toString(),
    }
  }
  console.log("remove recursive:", data)
  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      yield put(removeRecursive())
      message.success("Remove Success")
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }

}

export function* addRecursiveSaga(): any {
  const { profileUuid, tempRecursiveUuidList } = yield select(getRecursive);
  const header = getHeaders();
  let data = {
    "args": ["set", "profile"],
    "vars": {
      "uuid": profileUuid,
      "recursive": (tempRecursiveUuidList).toString(),
    }
  }

  console.log("add recursive:", data)

  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      try {// get profile's new has_action
        var profileData = {
          "args": ["query", "uuid", res.data.result.data[0]['Node.uuid']]
        }
        const detailedRes = yield call(postRequest, profileData, SURFIX_URL['graph'], header);
        if (detailedRes.status === 200) {
          yield put(addRecursive(detailedRes.data.result.data[0]["Profile.recursive"]))
          console.log("update profile's recursive success", detailedRes)
        }
      } catch (error: any) {
        console.log(error)
      }
    }
    message.success("Add Success")
  }
  catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }

}

