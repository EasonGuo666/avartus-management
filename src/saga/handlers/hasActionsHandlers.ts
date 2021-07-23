import { message } from "antd";
import { call, put, select } from "redux-saga/effects";
import { getHasActions } from "../../selectors";
import { errorAlert } from "../../slices/alert";
import { addHasActions, readHasActions, removeHasActions } from "../../slices/hasActions";
import { getHeaders, SURFIX_URL } from "../../utils";
import { postRequest } from "../requests/index";

export function* readHasActionsSaga(): any {
  const { profileUuid } = yield select(getHasActions);
  const header = getHeaders();
  var data = {
    "args": ["query", "uuid", profileUuid]
  }
  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200 && res.data.result.data) {
      let temp = []
      if (res.data.result.data[0]['Profile.has_actions']) {
        temp = res.data.result.data[0]['Profile.has_actions']
      }
      yield put(readHasActions(temp))
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error);
  }
}

export function* removeHasActionsSaga(): any {
  const { profileUuid, tempHasActionsUuidList } = yield select(getHasActions);
  const header = getHeaders();
  let data = {
    "args": ["set", "profile"],
    "vars": {
      "uuid": profileUuid,
      "has_actions": (tempHasActionsUuidList).toString(),
    }
  }
  console.log("remove has_actions data", data)
  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      yield put(removeHasActions())
      message.success("Remove Success")
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }
}

export function* addHasActionsSaga(): any {
  const { profileUuid, tempHasActionsUuidList } = yield select(getHasActions);
  const header = getHeaders();
  let data = {
    "args": ["set", "profile"],
    "vars": {
      "uuid": profileUuid,
      "has_actions": (tempHasActionsUuidList).toString(),
    }
  }
  console.log("add HasActions data", data)
  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      try {// get profile's new has_action
        var profileData = {
          "args": ["query", "uuid", res.data.result.data[0]['Node.uuid']]
        }
        const detailedRes = yield call(postRequest, profileData, SURFIX_URL['graph'], header);
        if (detailedRes.status === 200) {
          yield put(addHasActions(detailedRes.data.result.data[0]["Profile.has_actions"]))
          console.log("add profile's has_actions success", detailedRes)
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

