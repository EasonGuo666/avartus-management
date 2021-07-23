import { call, put, select } from "redux-saga/effects";
import { getCloud, getServiceInfo } from "../../selectors";
import { requestChild, requestConfig, requestOfflineService, requestOnlineService, storeConfig, storeDetail, storeManagerMap, storeOfflineService, storeOnlineService } from "../../slices/cloud";
import { readGrpcAuth, readGrpcAuthRequest, readHeartbeat, readHeartbeatRequest, readTimesync, readTimesyncRequest, storeGrpcAuth, storeHeartbeat, storeTimesync } from "../../slices/serviceInfo";
import { getHeaders, history, SURFIX_URL } from "../../utils";
import { getRequest, postRequest } from "../requests/index";
import { message } from "antd";

export function* cloudSaga(): any {
  const { request } = yield select(getCloud);
  const data =
  {
    "args": [request]
  }
  const header = getHeaders();
  try {
    const response = yield call(postRequest, data, SURFIX_URL['cloud'], header);
    const servicesData = response.data.info;
    let services: Array<any> = [];
    let managers: Array<any> = [];

    if (request === "online") {
      console.log('fetch Cloud online service every 60s');
      getManager(servicesData, services, managers)
      yield put(storeOnlineService({ services: services, managers: managers }));
      for (const manager of managers) {
        yield put(requestChild(manager.uuid))
      }
    }

    if (request === "offline") {
      console.log('fetch Cloud offline service every 60s');
      getManager(servicesData, services, managers)
      yield put(storeOfflineService({ services: services, managers: managers }));
      for (const manager of managers) {
        yield put(requestChild(manager.uuid))
      }
    }
  } catch (error: any) {
    console.log(error.response)
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response === 500 && error.response.data.error.search("token is expired")) {
      history.push({ pathname: "/login" });
    }
  }
}
//  helper function to get manager from online and offline services
function getManager(servicesData: any, services: any, managers: any) {
  Object.entries(servicesData).forEach(([uuid, value]: any) => {
    services.push({ uuid, value });
    if (value === "manager") {
      managers.push({ uuid, value });
    }
  });
}



export function* cloudManagerSaga(): any {
  const { uuid } = yield select(getCloud);

  const data2 =
  {
    "args": ["query", "uuid", uuid, "manager"]
  }
  const header = getHeaders();
  try {
    const response = yield call(postRequest, data2, SURFIX_URL['graph'], header);
    console.log(uuid, ":  ", response)

    const subServices = response.data.result.data[0]["~Service.register"];
    let storeServ: Array<string> = []
    if (subServices) {
      subServices.forEach((ser: any) => {
        storeServ.push(ser["Node.uuid"])
      })
    } else {
      // console.log('no child')
      storeServ = []
    }
    yield put(storeManagerMap({ manager: uuid, subServ: storeServ }))

  } catch (error: any) {
    console.log(error.response)
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response === 500 && error.response.data.error.search("token is expired")) {
      history.push({ pathname: "/login" });
    }
  }
}

export function* cloudDeleteSaga(): any {
  const { deleteUUID } = yield select(getCloud);

  const data =
  {
    "args": ["delete", "uuid", deleteUUID]
  }
  const header = getHeaders();
  try {
    const response = yield call(postRequest, data, SURFIX_URL['graph'], header);
    console.log(deleteUUID, " delete:  ", response);
    yield put(requestOnlineService());
    yield put(requestOfflineService());

  } catch (error: any) {
    console.log(error.response);
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}



export function* cloudDetailSaga(): any {
  const { detailUUID } = yield select(getCloud);

  const data =
  {
    "args": ["query", "uuid", detailUUID]
  }
  const data2 =
  {
    "args": ["service_status", detailUUID]
  }

  const header = getHeaders();
  try {
    const response = yield call(postRequest, data, SURFIX_URL['graph'], header);
    const response2 = yield call(postRequest, data2, SURFIX_URL['cloud'], header);
    console.log(detailUUID, "details:  ", response);
    console.log(detailUUID, "status:  ", response2);
    yield put(storeDetail({ detail: response.data.result.data[0], status: response2.data.info }));
  } catch (error: any) {
    console.log(error.response);
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}



export function* cloudManagerConfigSaga(): any {
  const { config, detailUUID } = yield select(getCloud);
  const data =
  {
    "args": ["config", detailUUID, config]
  }

  const header = getHeaders();
  try {
    const response = yield call(postRequest, data, SURFIX_URL['cloud'], header);
    console.log(detailUUID, "config:  ", response);
    message.success("Success send:  " + config)

  } catch (error: any) {
    console.log(error.response);
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}




export function* cloudManagerBadgerSaga(): any {
  const { config, detailUUID } = yield select(getCloud);

  const data =
  {
    "args" : ["config", detailUUID, config]
  }

  const header = getHeaders();
  try {
    const response = yield call(postRequest, data, SURFIX_URL['cloud'], header);
    console.log(detailUUID, "config:  ", response);
    message.success("Success send:  " + config)

  } catch (error: any) {
    console.log(error.response);
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}

export function* cloudChangeLifeTimeSaga(): any {
  const { device, lifetime } = yield select(getCloud);

  const data =
  {
    "args": ["lifetime", device, lifetime]
  }

  const header = getHeaders();
  try {
    const response = yield call(postRequest, data, SURFIX_URL['cloud'], header);
    console.log("lifetime :  ", response);
    if (response.status === 200) {
      message.success("Successfully set  " + device + "  lifetime to  " + lifetime);
    }

  } catch (error: any) {
    console.log(error.response);
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}


export function* cloudConfigSaga(): any {
  const { configUUID } = yield select(getCloud);
  const data =
  {
    "args": ["service_config", "read", configUUID]
  }
  const header = getHeaders();
  try {
    const response = yield call(postRequest, data, SURFIX_URL['cloud'], header);
    console.log(configUUID, "hihicloud config: ", response);
    yield put(storeConfig(response.data.info));

  } catch (error: any) {
    console.log(error.response);
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
    if (error.response.status === 504) {
      message.error("Please wait for manager reconnect");
      history.push({ pathname: "/cloud" });
    }
    if (error.response === undefined) {
      message.error("Please wait for manager reconnect");
      history.push({ pathname: "/cloud" });
    }
  }
}


export function* cloudUpdateConfigSaga(): any {
  const { serviceConfig, updateConfig } = yield select(getCloud);
  const { configUUID } = yield select(getCloud);

  let configList: Array<any> = [];
  let updateList: Array<any> = [];
  function objectToArray(arraylist: Array<any>, dataObject: any) {
    Object.entries(dataObject).forEach(([key, value]: any) => {
      if (typeof value === "object") {
        arraylist.push({ key, value: " " });
        Object.entries(value).forEach(([key, value]: any) => {
          arraylist.push({ key: `${key}`, value: `${value}` });
        });
      } else {
        arraylist.push({ key, value });
      }
    })
  }
  objectToArray(configList, serviceConfig.config);
  objectToArray(updateList, updateConfig)

  for (var j = 0; j < configList.length; j++) {
    configList[j].value = updateList[j].value
  }

  var configListString = "";
  for (var i = 0; i < configList.length; i++) {
    if (i === 0) {
      configListString += "{"
    }
    configListString += "\""; configListString += configList[i].key;
    configListString += "\": "; configListString += "\""; configListString += configList[i].value;
    configListString += "\"";
    if (i !== configList.length - 1) {
      configListString += ","
    }
    if (i === configList.length - 1) {
      configListString += "}"
    }
  }

  let data = {
    "args": ["service_config", "write", configUUID, configListString]
  }
  const header = getHeaders();
  try {
    const res = yield call(postRequest, data, SURFIX_URL['cloud'], header)
    if (res.status === 200) {
      console.log("update config success", res)
      yield put(requestConfig(configUUID));
    }
    message.success("Update Success")
  } catch (error: any) {
    console.log(error.response);
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}




export function* readHeartbeatSaga(): any {
  const header = getHeaders();
  try {
    const res = yield call(getRequest, SURFIX_URL['heartbeat'], header);
    if (res.status === 200) {
      yield put(readHeartbeat(res.data.info.data))
    }
  } catch (error: any) {
    console.log(error.response);
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}



export function* updateHeartbeatSaga(): any {
  const { updateHeartbeat } = yield select(getServiceInfo);
  var updateHeartbeatSec = Number(updateHeartbeat) * 60
  var updateHeartbeatOri = updateHeartbeatSec.toString()
  var data = {
    "args": ["heartbeat_interval", updateHeartbeatOri]
  }
  const header = getHeaders();
  try {
    const res = yield call(postRequest, data, SURFIX_URL['cloud'], header)
    if (res.status === 200) {
      console.log("i ma here", res)
      yield put(storeHeartbeat(res.data.info.data[0]["Cloud.heartbeat_interval"]))
      yield put(readHeartbeatRequest())
    }
  } catch (error: any) {
    console.log(error.response);
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}



export function* readTimesyncSaga(): any {
  const header = getHeaders();

  try {
    const res = yield call(getRequest, SURFIX_URL['timesync'], header);
    //console.log("get request", res)
    if (res.status === 200) {
      yield put(readTimesync(res.data.info.data))
    }
  } catch (error: any) {
    console.log(error.response);
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}



export function* updateTimesyncSaga(): any {
  const { updateTimesync } = yield select(getServiceInfo);
  var updateTimesyncSec = Number(updateTimesync) * 3600
  var updateTimesyncOri = updateTimesyncSec.toString()
  var data = {
    "args": ["time_sync_interval", updateTimesyncOri]
  }
  const header = getHeaders();
  try {
    const res = yield call(postRequest, data, SURFIX_URL['cloud'], header)
    if (res.status === 200) {
      yield put(storeTimesync(res.data.info.data[0]["Cloud.time_sync_interval"]))
      yield put(readTimesyncRequest())
    }
  } catch (error: any) {
    console.log(error.response);
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}



export function* readGrpcAuthSaga(): any {
  const header = getHeaders();
  try {
    const res = yield call(getRequest, SURFIX_URL['grpcauth'], header);
    if (res.status === 200) {
      yield put(readGrpcAuth(res.data.info.data))
    }
  } catch (error: any) {
    console.log(error.response);
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}



export function* updateGrpcAuthSaga(): any {
  const { updateGrpcAuth } = yield select(getServiceInfo);
  var data = {
    "args": ["grpc_auth_token", updateGrpcAuth]
  }
  const header = getHeaders();
  try {
    const res = yield call(postRequest, data, SURFIX_URL['cloud'], header)
    if (res.status === 200) {
      yield put(storeGrpcAuth(res.data.info.data[0]["Cloud.grpc_auth_token"]))
      yield put(readGrpcAuthRequest())
    }
  } catch (error: any) {
    console.log(error.response);
    message.error("Failed" + JSON.stringify(error.response.data.errors));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}
