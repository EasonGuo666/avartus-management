import { call, put, select } from "redux-saga/effects";
import { getBadger } from "../../selectors";
import { errorAlert } from "../../slices/alert";
import { getHeaders, history, SURFIX_URL } from "../../utils";
import { postRequest } from "../requests/index";
import { message } from "antd";
import { requestBadger, storeBadgerInfo } from "../../slices/badger";


export function* BadgerReadAllSaga(): any {
  const { managerID } = yield select(getBadger);
  const data =
  {
    "args": ["badger", managerID, "iterator"]
  }

  const header = getHeaders();
  try {
    const response = yield call(postRequest, data, SURFIX_URL['cloud'], header);
    console.log(managerID, "Badger:  ", response);
    yield put(storeBadgerInfo(response.data.info));

  } catch (error: any) {
    console.log(error.response);
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}

export function* BadgerReadByKeySaga(): any {
  const { managerID, key_prefix } = yield select(getBadger);
  const data =
  {
    "args": ["badger", managerID, "read", key_prefix]
  }
  const header = getHeaders();
  try {
    const response = yield call(postRequest, data, SURFIX_URL['cloud'], header);
    console.log("Badger by key:  ", response);
    yield put(storeBadgerInfo(response.data.info));
  } catch (error: any) {
    console.log(error.response);
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}

export function* BadgerAddSaga(): any {
  const { managerID, addKey, addValue, ttl } = yield select(getBadger);
  const data = ttl.length === 0 ?
    {
      "args": ["badger", managerID, "add", addKey, addValue]
    } :
    {
      "args": ["badger", managerID, "add", addKey, addValue, ttl]
    }

  const header = getHeaders();
  try {
    const response = yield call(postRequest, data, SURFIX_URL['cloud'], header);
    console.log("Badger add:  ", response);
    message.success("Successfully add:  " + addKey);
    yield put(requestBadger(managerID));
    //yield put(requestBadgerByKey({key:"",value:"",ttl:""}));

  } catch (error: any) {
    console.log(error.response);
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}


export function* BadgerDeleteSaga(): any {
  const { managerID, deleteKey } = yield select(getBadger);

  const data =
  {
    "args": ["badger", managerID, "delete", deleteKey]
  }

  const header = getHeaders();
  try {
    const response = yield call(postRequest, data, SURFIX_URL['cloud'], header);
    console.log(managerID, "delete:  ", response);
    message.success("Successfully deleted:  " + deleteKey);
    yield put(requestBadger(managerID));

  } catch (error: any) {
    console.log(error.response);
    yield put(errorAlert({ message: error.response.data.error.toString() }));
    if (error.response.status === 500) {
      //yield put(errorAlert({ message: "Token is invalid" }));
      history.push({ pathname: "/login" });
    }
  }
}


