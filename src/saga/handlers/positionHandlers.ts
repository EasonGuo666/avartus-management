import { postRequest } from "../requests/index";
import { call, put, select } from "redux-saga/effects";
import { getHeaders, SURFIX_URL } from "../../utils";
import { getPosition } from "../../selectors";
import { errorAlert } from "../../slices/alert";
import { readPosition, deletePosition, createPosition, updatePosition } from "../../slices/position";
import { message } from "antd";

export function* readPositionSaga(): any {
  const header = getHeaders();
  const { cameraUuid } = yield select(getPosition);
  let positionRequest = {
    "args": ["query", "uuid", cameraUuid]
  }
  try {
    const res = yield call(postRequest, positionRequest, SURFIX_URL['graph'], header);
    if (res.status === 200 && res.data.result.data) {
      let positionList = []
      if (res.data.result.data[0]["Camera.positions"]) {
        positionList = res.data.result.data[0]["Camera.positions"];
      }
      yield put(readPosition(positionList));
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error);
  }
}

export function* deletePositionSaga(): any {
  const { updateOrDeleteUuid, positionUuidList, cameraUuid } = yield select(getPosition);
  var deletePositionRequest = {
    "args": ["delete", "uuid", updateOrDeleteUuid]
  }
  var updateCameraRequest = {
    "args": ["set", "camera"],
    "vars": {
      "uuid": cameraUuid,
      "positions": (positionUuidList).toString()
    }
  }
  console.log("updateCameraRequest", updateCameraRequest)
  const header = getHeaders();
  try {
    const updateCameraRequestRes = yield call(postRequest, updateCameraRequest, SURFIX_URL['graph'], header);
    if (updateCameraRequestRes.status === 200) {// update camera success(delete the position in camera's position)
      console.log("update camera res:", updateCameraRequestRes)
      const deletePositionRequestRes = yield call(postRequest, deletePositionRequest, SURFIX_URL['graph'], header);
      if (deletePositionRequestRes.status === 200) {
        console.log("delete position success")
        yield put(deletePosition())
        message.success("Delete Success")
      }
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }
}

export function* updatePositionSaga(): any {
  const { updateOrCreatePosition } = yield select(getPosition);
  let data = {
    "args": ["set", "position"],
    "vars": {
      "uuid": updateOrCreatePosition['Node.uuid'],
      "pan": updateOrCreatePosition['Position.pan'].toString(),
      "tilt": updateOrCreatePosition['Position.tilt'].toString(),
      "zoom": updateOrCreatePosition['Position.zoom'].toString(),
      "label": updateOrCreatePosition['Position.label'],
      "desc": updateOrCreatePosition['Position.desc']
    }
  }
  const header = getHeaders();

  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      let updatedPosition = res.data.result.data[0];
      yield put(updatePosition(updatedPosition));
      message.success("Update Success")
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error);
  }
}

export function* createPositionSaga(): any {
  const { updateOrCreatePosition, positionUuidList, cameraUuid } = yield select(getPosition);
  const header = getHeaders();

  let createPositionRequest = {
    "args": ["set", "position"],
    "vars": {
      "pan": updateOrCreatePosition['Position.pan'].toString(),
      "tilt": updateOrCreatePosition['Position.tilt'].toString(),
      "zoom": updateOrCreatePosition['Position.zoom'].toString(),
      "label": updateOrCreatePosition['Position.label'],
      "desc": updateOrCreatePosition['Position.desc'],
    }
  }

  try {
    const res = yield call(postRequest, createPositionRequest, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      var newPositionUuidList = [...positionUuidList, res.data.result.data[0]['Node.uuid']]
      var updateCameraRequest = {
        "args": ["set", "camera"],
        "vars": {
          "uuid": cameraUuid,
          "positions": (newPositionUuidList).toString()
        }
      }
      try {
        const updateCameraRequestRes = yield call(postRequest, updateCameraRequest, SURFIX_URL['graph'], header);
        if (updateCameraRequestRes.status === 200) {// update camera success(add the position in camera's position)
          console.log("update camera res:", updateCameraRequestRes)
          yield put(createPosition(res.data.result.data[0]))
          message.success("Create Success")
        }
      } catch (error: any) {
        yield put(errorAlert({ message: error.response.data.error.toString() }));
        console.log(error);
      }
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error);
  }
}