import { all, takeEvery, takeLatest } from "@redux-saga/core/effects";
import { createActionRequest, deleteActionRequest, readActionRequest, readAllActionRequest, updateActionRequest } from "../slices/action";
import { loginRequest, verifyToken } from "../slices/auth";
import { deleteCloudService, requestChild, requestConfig, requestDetail, requestOfflineService, requestOnlineService, requestUpdateConfig, sendConfigurations, sendLifeTime} from "../slices/cloud";
import { createDeviceRequest, deleteDeviceRequest, readAllChosenDeviceRequest, readDeviceRequest, updateDeviceRequest } from "../slices/device";
import { readGrpcAuthRequest, readHeartbeatRequest, readTimesyncRequest, updateGrpcAuthRequest, updateHeartbeatRequest, updateTimesyncRequest } from "../slices/serviceInfo";
import { createLocationRequest, deleteLocationRequest, readLocationRequest, updateLocationRequest } from "../slices/location";
import { createProfileRequest, deleteProfileRequest, readProfileRequest, updateProfileRequest } from "../slices/profile";
import { createPositionRequest, deletePositionRequest, readPositionRequest, updatePositionRequest } from "../slices/position";
import { createUser, deleteUser, requestUserByEmail, requestUserByName, requestUserList, updateUser } from "../slices/user";

import { createActionSaga, deleteActionSaga, readActionSaga, readAllActionSaga, updateActionSaga } from "./handlers/actionHandlers";
import { loginSaga, verifyTokenSaga } from './handlers/authHandlers';
import { cloudChangeLifeTimeSaga, cloudConfigSaga, cloudDeleteSaga, cloudDetailSaga, cloudManagerConfigSaga, cloudManagerSaga, cloudSaga, cloudUpdateConfigSaga, readGrpcAuthSaga, readHeartbeatSaga, readTimesyncSaga, updateGrpcAuthSaga, updateHeartbeatSaga, updateTimesyncSaga } from './handlers/cloudHandlers';
import { createDeviceSaga, deleteDeviceSaga, readAllChosenDeviceSaga, readDeviceSaga, updateDeviceSaga } from "./handlers/deviceHandlers";
import { createLocationSaga, deleteLocationSaga, readLocationSaga, updateLocationSaga } from "./handlers/locationHandlers";
import { createProfileSaga, deleteProfileSaga, readProfileSaga, updateProfileSaga } from "./handlers/profileHandlers";
import { createPositionSaga, deletePositionSaga, readPositionSaga, updatePositionSaga } from "./handlers/positionHandlers";
import { addBadger, deleteBadger, requestBadger, requestBadgerByKey } from "../slices/badger";
import { BadgerAddSaga, BadgerDeleteSaga, BadgerReadAllSaga, BadgerReadByKeySaga } from "./handlers/badgerHandlers";
import { addHasActionsSaga, readHasActionsSaga, removeHasActionsSaga } from "./handlers/hasActionsHandlers";
import { addHasActionsRequest, readHasActionsRequest, removeHasActionsRequest } from "../slices/hasActions";
import { addRecursiveSaga, readRecursiveSaga, removeRecursiveSaga } from "./handlers/recursiveHandlers";
import { addRecursiveRequest, readRecursiveRequest, removeRecursiveRequest } from "../slices/recursive";
import { createUserSaga, deleteUserSaga, getUserSaga, searchUserEmailSaga, searchUserNameSaga, updateUserSaga } from "./handlers/userHandlers";

// If any of these functions are dispatched, invoke the appropriate saga
function* rootSaga() {
  yield all([
    takeLatest(loginRequest.type, loginSaga),
    takeLatest(verifyToken.type, verifyTokenSaga),
    takeLatest(requestOnlineService.type, cloudSaga),
    takeLatest(requestOfflineService.type, cloudSaga),
    takeEvery(requestChild.type, cloudManagerSaga),
    takeEvery(deleteCloudService.type, cloudDeleteSaga),
    takeLatest(requestDetail.type, cloudDetailSaga),
    takeLatest(sendConfigurations.type, cloudManagerConfigSaga),
    takeLatest(sendLifeTime.type, cloudChangeLifeTimeSaga),
    takeLatest(requestConfig.type, cloudConfigSaga),
    takeLatest(requestUpdateConfig.type, cloudUpdateConfigSaga),
    takeLatest(readHeartbeatRequest.type, readHeartbeatSaga),
    takeLatest(updateHeartbeatRequest.type, updateHeartbeatSaga),
    takeLatest(readTimesyncRequest.type, readTimesyncSaga),
    takeLatest(updateTimesyncRequest.type, updateTimesyncSaga),
    takeLatest(readGrpcAuthRequest.type, readGrpcAuthSaga),
    takeLatest(updateGrpcAuthRequest.type, updateGrpcAuthSaga),
    takeLatest(requestBadger.type, BadgerReadAllSaga),
    takeLatest(requestBadgerByKey.type, BadgerReadByKeySaga),
    takeLatest(addBadger.type,BadgerAddSaga),
    takeLatest(deleteBadger.type,BadgerDeleteSaga),
    takeLatest(readLocationRequest.type, readLocationSaga),
    takeEvery(deleteLocationRequest.type, deleteLocationSaga),
    takeEvery(updateLocationRequest.type, updateLocationSaga),
    takeEvery(createLocationRequest.type, createLocationSaga),
    takeLatest(readDeviceRequest.type, readDeviceSaga),
    takeLatest(readAllChosenDeviceRequest.type, readAllChosenDeviceSaga),
    takeEvery(deleteDeviceRequest.type, deleteDeviceSaga),
    takeEvery(updateDeviceRequest.type, updateDeviceSaga),
    takeEvery(createDeviceRequest.type, createDeviceSaga),
    takeLatest(readActionRequest.type, readActionSaga),
    takeLatest(readAllActionRequest.type, readAllActionSaga),
    takeEvery(deleteActionRequest.type, deleteActionSaga),
    takeEvery(updateActionRequest.type, updateActionSaga),
    takeEvery(createActionRequest.type, createActionSaga),
    takeLatest(readProfileRequest.type, readProfileSaga),
    takeEvery(deleteProfileRequest.type, deleteProfileSaga),
    takeEvery(updateProfileRequest.type, updateProfileSaga),
    takeEvery(createProfileRequest.type, createProfileSaga),
    takeLatest(readPositionRequest.type, readPositionSaga),
    takeEvery(createPositionRequest.type, createPositionSaga),
    takeEvery(updatePositionRequest.type, updatePositionSaga),
    takeEvery(deletePositionRequest.type, deletePositionSaga),
    takeLatest(readHasActionsRequest.type, readHasActionsSaga),
    takeEvery(removeHasActionsRequest.type, removeHasActionsSaga),
    takeEvery(addHasActionsRequest.type, addHasActionsSaga),
    takeLatest(readRecursiveRequest.type, readRecursiveSaga),
    takeEvery(removeRecursiveRequest.type, removeRecursiveSaga),
    takeEvery(addRecursiveRequest.type, addRecursiveSaga),
    //user
    takeLatest(requestUserList.type, getUserSaga),
    takeLatest(createUser.type, createUserSaga),
    takeLatest(deleteUser.type, deleteUserSaga),
    takeLatest(updateUser.type, updateUserSaga),
    takeLatest(requestUserByName.type, searchUserNameSaga),
    takeLatest(requestUserByEmail.type, searchUserEmailSaga),
  ]); // type?
}

export default rootSaga;
