import { message } from "antd";
import { call, put, select } from "redux-saga/effects";
import { getDevice } from "../../selectors";
import { errorAlert } from "../../slices/alert";
import { createDevice, deleteDevice, readAllChosenDevice, readDevice, updateDevice } from "../../slices/device";
import { CAMERA, DSP, getHeaders, PC, PROJECTOR, SURFIX_URL, SWITCHER, TV, VC } from "../../utils";
import { postRequest } from "../requests/index";

export function* readDeviceSaga(): any {
  const { locate_uuid } = yield select(getDevice);
  var data = {
    "args": ["query", "uuid", locate_uuid, "location"]
  };
  const header = getHeaders();

  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200 && res.data.result.data) {
      let tempArray: any = []
      if (res.data.result.data[0]['~Node.locate']) {//it means location has device
        for (let item of res.data.result.data[0]['~Node.locate']) {
          var deviceData = {
            "args": ["query", "uuid", item['Node.uuid'], "device"]
          }
          const detailedRes = yield call(postRequest, deviceData, SURFIX_URL['graph'], header);
          tempArray.push(detailedRes.data.result.data[0])
        }
      }
      yield put(readDevice(tempArray))// tempArray will be empty if the location has no device
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error);
  }
}

export function* readAllChosenDeviceSaga(): any {
  const { chosenType } = yield select(getDevice);
  var data = {
    "args": ["query", "name", chosenType]
  };
  const header = getHeaders();

  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200 && res.data.result.data) {
      let chosenDeviceData = []
      for (var eachDevice of res.data.result.data) {
        var deviceData = {
          "args": ["query", "uuid", eachDevice['Node.uuid']]
        }
        const deviceRes = yield call(postRequest, deviceData, SURFIX_URL['graph'], header);
        if (deviceRes.status === 200 && deviceRes.data.result.data[0]) {
          let location = deviceRes.data.result.data[0]['Node.locate']['Location.location']
          let locationUuid = deviceRes.data.result.data[0]['Node.locate']['Node.uuid']
          chosenDeviceData.push({
            deviceValue: eachDevice['Node.uuid'], deviceLabel: eachDevice[chosenType + '.desc'],
            locationValue: locationUuid, locationLabel: location
          })
        }
      }
      yield put(readAllChosenDevice(chosenDeviceData))
    }
  } catch (error: any) {
    console.log(error);
  }
}

export function* deleteDeviceSaga(): any {
  const { updateOrDeleteUuid } = yield select(getDevice);
  var data = {
    "args": ["delete", "uuid", updateOrDeleteUuid]
  }
  const header = getHeaders();
  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      console.log("delete location success")
      yield put(deleteDevice())
    }
    message.success("Delete Success")
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }
}

export function* updateDeviceSaga(): any {
  const { updateOrCreateDevice, chosenType } = yield select(getDevice);
  let data: any // NEED TO BE ABSTRACT
  switch (chosenType) {
    case SWITCHER:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "uuid": updateOrCreateDevice['Node.uuid'],
          "locate": updateOrCreateDevice['locate'],
          "model": updateOrCreateDevice['Switcher.model'],
          "ip": updateOrCreateDevice['Switcher.ip'],
          "responds": updateOrCreateDevice['Switcher.responds'],
          "desc": updateOrCreateDevice['Switcher.desc']
        }
      }
      break;

    case TV:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "uuid": updateOrCreateDevice['Node.uuid'],
          "locate": updateOrCreateDevice['locate'],
          "model": updateOrCreateDevice['TV.model'],
          "ip": updateOrCreateDevice['TV.ip'],
          "credential": updateOrCreateDevice['TV.credential'],
          "desc": updateOrCreateDevice['TV.desc']
        }
      }
      break;

    case PC:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "uuid": updateOrCreateDevice['Node.uuid'],
          "locate": updateOrCreateDevice['locate'],
          "model": updateOrCreateDevice['PC.model'],
          "ip": updateOrCreateDevice['PC.ip'],
          "broadcast": updateOrCreateDevice['PC.broadcast'],
          "mac_address": updateOrCreateDevice['PC.mac_address'],
          "desc": updateOrCreateDevice['PC.desc']
        }
      }
      break;

    case CAMERA:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "uuid": updateOrCreateDevice['Node.uuid'],
          "locate": updateOrCreateDevice['locate'],
          "model": updateOrCreateDevice['Camera.model'],
          "ip": updateOrCreateDevice['Camera.ip'],
          "speed": updateOrCreateDevice['Camera.speed'].toString(),
          "zoom_speed": updateOrCreateDevice['Camera.zoom_speed'].toString(),
          "desc": updateOrCreateDevice['Camera.desc']
        }
      }
      break;

    case PROJECTOR:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "uuid": updateOrCreateDevice['Node.uuid'],
          "locate": updateOrCreateDevice['locate'],
          "model": updateOrCreateDevice['Projector.model'],
          "ip": updateOrCreateDevice['Projector.ip'],
          "desc": updateOrCreateDevice['Projector.desc']
        }
      }
      break;

    case VC:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "uuid": updateOrCreateDevice['Node.uuid'],
          "locate": updateOrCreateDevice['locate'],
          "model": updateOrCreateDevice['VC.model'],
          "ip": updateOrCreateDevice['VC.ip'],
          "desc": updateOrCreateDevice['VC.desc']
        }
      }
      break;

    case DSP:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "uuid": updateOrCreateDevice['Node.uuid'],
          "locate": updateOrCreateDevice['locate'],
          "model": updateOrCreateDevice['DSP.model'],
          "ip": updateOrCreateDevice['DSP.ip'],
          "credential": updateOrCreateDevice['DSP.credential'],
          "lower_limit": updateOrCreateDevice['DSP.lower_limit'] ? updateOrCreateDevice['DSP.lower_limit'].toString() : "",
          "higher_limit": updateOrCreateDevice['DSP.higher_limit'] ? updateOrCreateDevice['DSP.higher_limit'].toString() : "",
          "speaker": updateOrCreateDevice['DSP.speaker'] ? updateOrCreateDevice['DSP.speaker'].toString() : "",
          "mic1": updateOrCreateDevice['DSP.mic1'] ? updateOrCreateDevice['DSP.mic1'].toString() : "",
          "mic2": updateOrCreateDevice['DSP.mic2'] ? updateOrCreateDevice['DSP.mic2'].toString() : "",
          "responds": updateOrCreateDevice['DSP.responds'],
          "desc": updateOrCreateDevice['DSP.desc']
        }
      }
      break;
  }

  console.log("update data", data)

  const header = getHeaders();
  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    console.log("res:", res);
    if (res.status === 200) {
      var deviceData = {
        "args": ["query", "uuid", res.data.result.data[0]['Node.uuid'], "device"]
      }
      const detailedRes = yield call(postRequest, deviceData, SURFIX_URL['graph'], header);
      if (detailedRes.status === 200) {
        yield put(updateDevice(detailedRes.data.result.data[0]))
        console.log("update device success", detailedRes)
      }
      message.success("Update Success")
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }
}

export function* createDeviceSaga(): any {
  const { updateOrCreateDevice, locate_uuid, chosenType } = yield select(getDevice);

  let data: any// NEED TO BE ABSTRACT
  switch (chosenType) {
    case SWITCHER:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "locate": locate_uuid,
          "model": updateOrCreateDevice['Switcher.model'],
          "ip": updateOrCreateDevice['Switcher.ip'],
          "responds": updateOrCreateDevice['Switcher.responds'],
          "desc": updateOrCreateDevice['Switcher.desc']
        }
      }
      break;

    case TV:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "locate": locate_uuid,
          "model": updateOrCreateDevice['TV.model'],
          "ip": updateOrCreateDevice['TV.ip'],
          "credential": updateOrCreateDevice['TV.credential'],
          "desc": updateOrCreateDevice['TV.desc']
        }
      }
      break;

    case PC:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "locate": locate_uuid,
          "model": updateOrCreateDevice['PC.model'],
          "ip": updateOrCreateDevice['PC.ip'],
          "broadcast": updateOrCreateDevice['PC.broadcast'],
          "mac_address": updateOrCreateDevice['PC.mac_address'],
          "desc": updateOrCreateDevice['PC.desc']
        }
      }
      break;

    case CAMERA:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "locate": locate_uuid,
          "model": updateOrCreateDevice['Camera.model'],
          "ip": updateOrCreateDevice['Camera.ip'],
          "speed": updateOrCreateDevice['Camera.speed'].toString(),
          "zoom_speed": updateOrCreateDevice['Camera.zoom_speed'].toString(),
          "desc": updateOrCreateDevice['Camera.desc']
        }
      }
      break;

    case PROJECTOR:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "locate": locate_uuid,
          "model": updateOrCreateDevice['Projector.model'],
          "ip": updateOrCreateDevice['Projector.ip'],
          "desc": updateOrCreateDevice['Projector.desc']
        }
      }
      break;

    case VC:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "locate": locate_uuid,
          "model": updateOrCreateDevice['VC.model'],
          "ip": updateOrCreateDevice['VC.ip'],
          "desc": updateOrCreateDevice['VC.desc']
        }
      }
      break;

    case DSP:
      data = {
        "args": ["set", chosenType],
        "vars": {
          "locate": locate_uuid,
          "model": updateOrCreateDevice['DSP.model'],
          "ip": updateOrCreateDevice['DSP.ip'],
          "credential": updateOrCreateDevice['DSP.credential'],
          "lower_limit": updateOrCreateDevice['DSP.lower_limit'] ? updateOrCreateDevice['DSP.lower_limit'].toString() : "",
          "higher_limit": updateOrCreateDevice['DSP.higher_limit'] ? updateOrCreateDevice['DSP.higher_limit'].toString() : "",
          "speaker": updateOrCreateDevice['DSP.speaker'] ? updateOrCreateDevice['DSP.speaker'].toString() : "",
          "mic1": updateOrCreateDevice['DSP.mic1'] ? updateOrCreateDevice['DSP.mic1'].toString() : "",
          "mic2": updateOrCreateDevice['DSP.mic2'] ? updateOrCreateDevice['DSP.mic2'].toString() : "",
          "responds": updateOrCreateDevice['DSP.responds'],
          "desc": updateOrCreateDevice['DSP.desc']
        }
      }
      break;
  }


  console.log("create data:", data)
  const header = getHeaders();

  try {
    const res = yield call(postRequest, data, SURFIX_URL['graph'], header);
    if (res.status === 200) {
      yield put(createDevice(res.data.result.data[0]))
      console.log("create device success:", res)
      message.success("Create Success")
    }
  } catch (error: any) {
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    console.log(error)
  }
}