import { combineReducers } from 'redux';

import auth from './auth'
import alert from './alert'
import cloud from './cloud'
import badger from './badger'
import location from './location'
import device from './device';
import action from './action';
import profile from './profile';
import position from './position';
import serviceInfo from './serviceInfo';
import hasActions from './hasActions';
import recursive from './recursive';
import user from './user';

const rootReducer = combineReducers({
  auth,
  alert,
  cloud,
  badger,
  location,
  device,
  action,
  profile,
  position,
  serviceInfo,
  hasActions,
  recursive,
  user
});
export default rootReducer