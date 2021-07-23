export const BASE_URL = 'https://avartus.cmu.edu.au';

export const SURFIX_URL: Record<string, string> = {
  'auth': '/api/v1/auth',
  'valid': '/api/v1/valid',
  'graph': '/api/v1/graph',
  'cloud': '/api/v1/cloud',
  'heartbeat': '/api/v1/cloud/heartbeat_interval',
  'timesync': '/api/v1/cloud/time_sync_interval',
  'grpcauth': '/api/v1/cloud/grpc_auth_token',
  'users': '/api/v1/users',
  'user_search_name': '/api/v1/users?name=',
  'user_search_email': '/api/v1/users?email='
} as const;

const Options = (option: string) => {
  return {
    value: option,
    label: option
  }
}

export const ORGNIZATION_ID = '1';

export const UPDATE = 'update';

export const CREATE = 'create';

export const LOCATION = 'location';

export const DEVICE = 'device';

export const ACTION = 'action';

export const PROFILE = 'profile';

export const POSITION = 'position';

export const PC = 'PC';

export const PCActions = [Options("on")]

export const TV = 'TV';

export const TVActions = [
  Options("on"),
  Options("off"),
  Options("mute"),
  Options("status"),
  Options("feature")]

export const SWITCHER = 'Switcher';

export const SWITCHERActions = [
  Options("mute"),
  Options("unmute"),
  Options("route"),
  Options("feature"),
  Options("status"),
  Options("hdcp_in")
]

export const DSP = 'DSP';

export const DSPActions = [
  Options("mute"),
  Options("unmute"),
  Options("get_mute"),
  Options("set_volume"),
  Options("feature")
]

export const CAMERA = 'Camera';

export const CAMERAActions = [
  Options("up"),
  Options("down"),
  Options("left"),
  Options("right"),
  Options("set_position"),
  Options("stop"),
  Options("zoom"),
  Options("zoom_stop"),
  Options("get_position")
]

export const PROJECTOR = 'Projector';

export const PROJECTORActions = [
  Options("on"), Options("off"), Options("mute"), Options("unmute"), Options("switch_input"), Options("status")
]

export const VC = 'VC';

export const VCActions = [Options("on"), Options("off")]


