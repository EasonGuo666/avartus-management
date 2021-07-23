import { message } from "antd";
import { call, put, select } from "redux-saga/effects";
import { getAction } from "../../selectors";
import { createAction, deleteAction, readAction, readActionTree, readAllAction, updateAction } from "../../slices/action";
import { errorAlert } from "../../slices/alert";
import { getHeaders, SURFIX_URL } from "../../utils";
import { postRequest } from "../requests/index";

export function* readActionSaga(): any {
  const { device_uuid } = yield select(getAction);
  var data = {
    "args": ["query", "uuid", device_uuid, "device"]
  };
  const header = getHeaders();

  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200 && res.data.result.data) {
      let tempArray: any = []
      if (res.data.result.data[0]['~Action.target']) {//it means device has action
        for (let action of res.data.result.data[0]['~Action.target']) {
          var actionData = {
            "args": ["query", "uuid", action['Node.uuid'], "action"]
          }
          const detailedRes = yield call(postRequest, actionData, SURFIX_URL['graph'], header);
          if (detailedRes.status === 200) {
            tempArray.push(detailedRes.data.result.data[0])
          }
        }
      }
      yield put(readAction(tempArray))// tempArray will be empty if the device has no action
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error);
  }
}

export function* readAllActionSaga(): any {
  var data = {
    "args": ["query", "name", "action"]
  };
  const header = getHeaders();

  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200 && res.data.result.data) {
      let temp = []
      let actionTreeData = []
      for (var eachAction of res.data.result.data) {
        var actionData = {
          "args": ["query", "uuid", eachAction['Node.uuid']]
        }
        const actionRes = yield call(postRequest, actionData, SURFIX_URL['graph'], header);
        if (actionRes.status === 200 && actionRes.data.result.data) {
          const baseTarget = actionRes.data.result.data[0]['Action.target']['Node.uuid']
          var deviceData = {
            "args": ["query", "uuid", baseTarget]
          }
          const deviceRes = yield call(postRequest, deviceData, SURFIX_URL['graph'], header);
          if (deviceRes.status === 200 && deviceRes.data.result.data && deviceRes.data.result.data[0]['Node.name'] !== "profile") {
            const location = deviceRes.data.result.data[0]['Node.locate']['Location.location']
            const devcieType = deviceRes.data.result.data[0]['dgraph.type']
            const deviceDesc = actionRes.data.result.data[0]['Action.target'][devcieType + '.desc']
            actionTreeData.push({
              actionValue: eachAction['Node.uuid'], actionLabel: eachAction['Action.op'],
              deviceValue: baseTarget, deviceLabel: deviceDesc,
              locationValue: deviceRes.data.result.data[0]['Node.locate']['Node.uuid'], locationLabel: location
            })
          }
          temp.push({ ...eachAction })
        }
      }
      yield put(readAllAction(temp))
      yield put(readActionTree(actionTreeData))
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error);
  }
}

export function* deleteActionSaga(): any {
  const { updateOrDeleteUuid } = yield select(getAction);
  var data = {
    "args": ["delete", "uuid", updateOrDeleteUuid]
  }
  const header = getHeaders();
  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      console.log("delete action success")
      yield put(deleteAction())
    }
    message.success("Delete Success")
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }
}

export function* updateActionSaga(): any {
  const { updateOrCreateAction } = yield select(getAction);

  let data = {
    "args": ["set", "action"],
    "vars": {
      "uuid": updateOrCreateAction['Node.uuid'],
      "op": updateOrCreateAction['Action.op'],
      "params": updateOrCreateAction['Action.params'] ? updateOrCreateAction['Action.params'].toString() : "",
      "target": updateOrCreateAction['target'],
    }
  }

  console.log("update data", data)

  const header = getHeaders();
  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      try {// test if the action has profile?
        var actionData = {
          "args": ["query", "uuid", res.data.result.data[0]['Node.uuid'], "action"]
        }
        const detailedRes = yield call(postRequest, actionData, SURFIX_URL['graph'], header);
        if (detailedRes.status === 200) {
          yield put(updateAction(detailedRes.data.result.data[0]))
          console.log("update action success", detailedRes)
        }
      } catch (error: any) {
        console.log(error)
      }
      message.success("Update Success")
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }
}

export function* createActionSaga(): any {
  const { updateOrCreateAction, device_uuid } = yield select(getAction);

  let data = {
    "args": ["set", "action"],
    "vars": {
      "op": updateOrCreateAction['Action.op'],
      "params": updateOrCreateAction['Action.params'] ? updateOrCreateAction['Action.params'].toString() : "",
      "target": device_uuid
    }
  }

  console.log("create data:", data)
  const header = getHeaders();

  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      yield put(createAction(res.data.result.data[0]))
      console.log("create action success:", res)
      message.success("Create Success")
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }
}