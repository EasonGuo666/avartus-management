import { message } from "antd";
import { call, put, select } from "redux-saga/effects";
import { getLocation } from "../../selectors";
import { errorAlert } from "../../slices/alert";
import { createLocation, deleteLocation, readLocation, updateLocation } from "../../slices/location";
import { getHeaders, SURFIX_URL } from "../../utils";
import { postRequest } from "../requests/index";

export function* readLocationSaga(): any {
  var data = {
    "args": ["query", "name", "Location"]
  }
  const header = getHeaders();

  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      let tempArray: any = []
      if (res.data.result.data) {
        for (let item of res.data.result.data) {
          try {// test if the location has devices?
            var locationData = {
              "args": ["query", "uuid", item['Node.uuid'], "location"]
            }
            const detailedRes = yield call(postRequest, locationData, SURFIX_URL['graph'], header);
            if (detailedRes.status === 200) {
              tempArray.push(detailedRes.data.result.data[0])
            }
          } catch (error: any) {
            console.log(error)
          }
        }
      }
      yield put(readLocation(tempArray))
    }
  } catch (error: any) {
    console.log(error)
  }
}

export function* deleteLocationSaga(): any {
  const { updateOrDeleteUuid } = yield select(getLocation);
  var data = {
    "args": ["delete", "uuid", updateOrDeleteUuid]
  }
  const header = getHeaders();
  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      console.log("delete location success")
      yield put(deleteLocation())
    }
    message.success("Delete Success")
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error.response)
  }
}

export function* updateLocationSaga(): any {
  const { updateOrCreateLocation } = yield select(getLocation);

  let data = {
    "args": ["set", "location"],
    "vars": {
      "uuid": updateOrCreateLocation['Node.uuid'],
      "building": updateOrCreateLocation['Location.building'],
      "location": updateOrCreateLocation['Location.location'],
      "resource_id": updateOrCreateLocation['Location.resource_id'] ? (updateOrCreateLocation['Location.resource_id']).toString() : "",
      "zoom_id": updateOrCreateLocation['Location.zoom_id'] ? updateOrCreateLocation['Location.zoom_id'] : "",
      "h323_ip": updateOrCreateLocation['Location.h323_ip'] ? updateOrCreateLocation['Location.h323_ip'] : "",
      "desc": updateOrCreateLocation['Location.desc'] ? updateOrCreateLocation['Location.desc'] : ""
    }
  }

  const header = getHeaders();
  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      try {// test if the location has devices?
        var locationData = {
          "args": ["query", "uuid", res.data.result.data[0]['Node.uuid'], "Location"]
        }
        const detailedRes = yield call(postRequest, locationData, SURFIX_URL['graph'], header);
        if (detailedRes.status === 200) {
          if (detailedRes.data.result.data[0]['~Node.locate']) {
            yield put(updateLocation(detailedRes.data.result.data[0]))
          } else {
            yield put(updateLocation(res.data.result.data[0]))
          }
          console.log("update location success", detailedRes)
        }
      } catch (error: any) {
        console.log(error)
      }
      message.success("Update Success")
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.data.error.toString() }));
    console.log(error)
  }
}

export function* createLocationSaga(): any {
  const { updateOrCreateLocation } = yield select(getLocation);
  let data = {
    "args": ["set", "location"],
    "vars": {
      "building": updateOrCreateLocation['Location.building'],
      "location": updateOrCreateLocation['Location.location'],
      "resource_id": updateOrCreateLocation['Location.resource_id'] ? (updateOrCreateLocation['Location.resource_id']).toString() : "",
      "zoom_id": updateOrCreateLocation['Location.zoom_id'] ? updateOrCreateLocation['Location.zoom_id'] : "",
      "h323_ip": updateOrCreateLocation['Location.h323_ip'] ? updateOrCreateLocation['Location.h323_ip'] : "",
      "desc": updateOrCreateLocation['Location.desc'] ? updateOrCreateLocation['Location.desc'] : ""
    }
  }

  console.log("create data:", data)
  const header = getHeaders();

  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      yield put(createLocation(res.data.result.data[0]))
      console.log("create location success:", res)
      message.success("Create Success")
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }
}