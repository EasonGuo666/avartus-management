const Column = (Title: string, DataIndex: string, Key: string) => {
  return {
    title: Title,
    dataIndex: DataIndex,
    key: Key
  }
}

export const LocationColumns = [
  Column("Building", "Location.building", "Location.building"),
  Column("Desc", "Location.desc", "Location.desc"),
  Column("H323_IP", "Location.h323_ip", "Location.h323_ip"),
  Column("Location", "Location.location", "Location.location"),
  Column("Resource_ID", "Location.resource_id", "Location.resource_id"),
  Column("Zoom_ID", "Location.zoom_id", "Location.zoom_id"),
]

export const DeviceColumns = [
  Column("Name", "Node.name", "Node.name"),
  Column("Tag", "Node.tag", "Node.tag"),
  Column("Key", "key", "key"),
  Column("Uid", "uid", "uid"),
  Column("Dgraph Type", "dgraph.type", "dgraph.type"),
]

export const TVColumns = [
  Column("Model", "TV.model", "TV.model"),
  Column("Description", "TV.desc", "TV.desc"),
  Column("IP", "TV.ip", "TV.ip"),
  Column("Credential", "TV.credential", "TV.credential"),
]

export const SwitcherColumns = [
  Column("Model", "Switcher.model", "Switcher.model"),
  Column("Description", "Switcher.desc", "Switcher.desc"),
  Column("Responds", "Switcher.responds", "Switcher.responds"),
  Column("IP", "Switcher.ip", "Switcher.ip"),
]

export const PCColumns = [
  Column("Model", "PC.model", "PC.model"),
  Column("Description", "PC.desc", "PC.desc"),
  Column("IP", "PC.ip", "PC.ip"),
  Column("Broadcast", "PC.broadcast", "PC.broadcast"),
  Column("Mac Address", "PC.mac_address", "PC.mac_address"),
]

export const CameraColumns = [
  Column("Model", "Camera.model", "Camera.model"),
  Column("Description", "Camera.desc", "Camera.desc"),
  Column("IP", "Camera.ip", "Camera.ip"),
  Column("Speed", "Camera.speed", "Camera.speed"),
  Column("Zoom Speed", "Camera.zoom_speed", "Camera.zoom_speed"),
]

export const ProjectorColumns = [
  Column("Model", "Projector.model", "Projector.model"),
  Column("IP", "Projector.ip", "Projector.ip"),
  Column("Description", "Projector.desc", "Projector.desc"),
]

export const DSPColumns = [
  Column("Model", "DSP.model", "DSP.model"),
  Column("IP", "DSP.ip", "DSP.ip"),
  Column("Credential", "DSP.credential", "DSP.credential"),
  Column("Lower_limit", "DSP.lower_limit", "DSP.lower_limit"),
  Column("Higher_limit", "DSP.higher_limit", "DSP.higher_limit"),
  Column("Speaker", "DSP.speaker", "DSP.speaker"),
  Column("Mic1", "DSP.mic1", "DSP.mic1"),
  Column("Mic2", "DSP.mic2", "DSP.mic2"),
  Column("Responds", "DSP.responds", "DSP.responds"),
  Column("Description", "DSP.desc", "DSP.desc"),
]

export const VCColumns = [
  Column("Model", "VC.model", "VC.model"),
  Column("IP", "VC.ip", "VC.ip"),
  Column("Description", "VC.desc", "VC.desc"),
]

export const PositionColumns = [
  Column("Pan", "Position.pan", "Position.pan"),
  Column("Tilt", "Position.tilt", "Position.tilt"),
  Column("Zoom", "Position.zoom", "Position.zoom"),
  Column("Label", "Position.label", "Position.label"),
  Column("Desc", "Position.desc", "Position.desc"),
]

export const ActionColumns = [
  Column("Uuid", "Node.uuid", "Node.uuid"),
  Column("OP", "Action.op", "Action.op"),
  Column("Params", "Action.params", "Action.params"),
]

export const ProfileColumns = [
  Column("Label", "Profile.label", "Profile.label"),
]