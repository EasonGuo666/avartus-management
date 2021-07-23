import { RootState } from '../types';

export const getAlert = (state: RootState) => state.alert;
export const getAuth = (state: RootState) => state.auth;
export const getCloud = (state: RootState) => state.cloud;
export const getBadger = (state: RootState) => state.badger;
export const getLocation = (state: RootState) => state.location;
export const getDevice = (state: RootState) => state.device;
export const getAction = (state: RootState) => state.action;
export const getProfile = (state: RootState) => state.profile;
export const getPosition = (state: RootState) => state.position;
export const getServiceInfo = (state: RootState) => state.serviceInfo;
export const getHasActions = (state: RootState) => state.hasActions;
export const getRecursive = (state: RootState) => state.recursive;
export const getUser = (state: RootState) => state.user;
