import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Input, Menu, Modal } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 as uuid_v4 } from "uuid";
import { getDevice, getLocation } from "../selectors";
import { createDeviceRequest, updateDeviceRequest } from "../slices/device";
import {
  createLocationRequest,
  updateLocationRequest,
} from "../slices/location";
import {
  createPositionRequest,
  updatePositionRequest,
} from "../slices/position";
import { createProfileRequest, updateProfileRequest } from "../slices/profile";
import {
  CAMERA,
  CREATE,
  DEVICE,
  DSP,
  LOCATION,
  PC,
  POSITION,
  PROFILE,
  PROJECTOR,
  SWITCHER,
  TV,
  UPDATE,
  VC,
} from "../utils";
import {
  CameraColumns,
  DSPColumns,
  LocationColumns,
  PCColumns,
  PositionColumns,
  ProfileColumns,
  ProjectorColumns,
  SwitcherColumns,
  TVColumns,
  VCColumns,
} from "../utils/columns";

interface ModalFormProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
  record: any;
  status: string;
  nodeType: string;
}

const ModalForm: React.FC<ModalFormProps> = ({
  visible,
  onCreate,
  onCancel,
  record,
  status,
  nodeType,
}) => {
  const [form] = Form.useForm();
  const okText = status === UPDATE ? "Update" : "Create";
  const title = status === UPDATE ? "Update" : "Create";
  const { locationList } = useSelector(getLocation);
  const { chosenType } = useSelector(getDevice);

  let { uuid } = useParams<any>();

  let columns: any = []; // auto generate the form's row by record(table's data)
  switch (nodeType) {
    case LOCATION:
      columns = LocationColumns;
      break;
    case PROFILE:
      columns = ProfileColumns;
      break;
    case POSITION:
      columns = PositionColumns;
      break;
    case DEVICE:
      switch (chosenType) {
        case TV:
          columns = TVColumns;
          break;
        case SWITCHER:
          columns = SwitcherColumns;
          break;
        case PC:
          columns = PCColumns;
          break;
        case VC:
          columns = VCColumns;
          break;
        case DSP:
          columns = DSPColumns;
          break;
        case CAMERA:
          columns = CameraColumns;
          break;
        case PROJECTOR:
          columns = ProjectorColumns;
          break;
        case POSITION:
          columns = PositionColumns;
          break;
      }
  }

  var baseUuid: string; //a general called uuid, device's base is location, action's base is device, etc.
  var baseLocation: string;

  // following codes help to create a droplist's menu
  let menu: any = [];

  if (locationList) {
    for (var eachLocation of locationList) {
      baseUuid = eachLocation["Node.uuid"];
      baseLocation = eachLocation["Location.location"];
      menu.push({ baseUuid, baseLocation });
    }
  }

  const handleMenuClick = (e: any) => {
    let newTxt: any;
    let newBase: any;
    newBase = locationList.find(
      (location: any) => location["Node.uuid"] === e.key
    );
    newTxt = newBase["Location.location"];
    setMenuTxt(newTxt);
    setCurrentBaseUuid(e.key);
  };

  const [menuTxt, setMenuTxt] = useState(() => "Choose a new location here");

  const [currentBaseUuid, setCurrentBaseUuid] = useState(uuid);

  const menuForUpdate = (
    <Menu onClick={handleMenuClick}>
      {menu.map((item: any) => (
        <Menu.Item key={item.baseUuid}>{item.baseLocation}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Modal
      visible={visible}
      title={title}
      okText={okText}
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            if (nodeType === DEVICE) {
              values["locate"] = currentBaseUuid;
            }
            if (chosenType === PC) {
              values["PC.model"] = "standard";
            }
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout='vertical'
        name='form_in_modal'
        initialValues={record}
      >
        <Form.Item
          name='Node.uuid'
          key='Node.uuid'
          label='Node.uuid'
          hidden={true}
        >
          <Input type='textarea' />
        </Form.Item>

        {columns.map((item: any) => {
          switch (nodeType) {
            case LOCATION:
              return (
                <Form.Item
                  name={item.key}
                  key={item.key}
                  label={item.key}
                  rules={[
                    {
                      required:
                        item.key === "Location.location" ||
                        item.key === "Location.building",
                      message: "Not Empty",
                    },
                  ]}
                >
                  <Input
                    type={
                      item.key === "Location.resource_id"
                        ? "number"
                        : "textarea"
                    }
                  />
                </Form.Item>
              );
            case POSITION:
              if (status === CREATE) {
                return (
                  <Form.Item
                    name={item.key}
                    key={item.key}
                    label={item.key}
                    rules={[
                      {
                        required: true,
                        message: "Not Empty",
                      },
                    ]}
                    initialValue={
                      item.key === "Position.pan" ||
                      item.key === "Position.tilt" ||
                      item.key === "Position.zoom"
                        ? "0"
                        : ""
                    }
                  >
                    <Input
                      type={
                        item.key === "Position.pan" ||
                        item.key === "Position.tilt" ||
                        item.key === "Position.zoom"
                          ? "number"
                          : "textarea"
                      }
                    />
                  </Form.Item>
                );
              } else
                return (
                  <Form.Item
                    name={item.key}
                    key={item.key}
                    label={item.key}
                    rules={[
                      {
                        required: true,
                        message: "Not Empty",
                      },
                    ]}
                  >
                    <Input
                      type={
                        item.key === "Position.pan" ||
                        item.key === "Position.tilt" ||
                        item.key === "Position.zoom"
                          ? "number"
                          : "textarea"
                      }
                    />
                  </Form.Item>
                );
            case PROFILE:
              return (
                <Form.Item
                  name={item.key}
                  key={item.key}
                  label={item.key}
                  rules={[
                    {
                      required: item.key === "Profile.label",
                      message: "Not Empty",
                    },
                  ]}
                >
                  <Input type='textarea' />
                </Form.Item>
              );
          }
          switch (chosenType) {
            case CAMERA:
              if (status === CREATE) {
                return (
                  <Form.Item
                    name={item.key}
                    key={item.key}
                    label={item.key}
                    rules={[
                      {
                        required: true,
                        message: "Not Empty",
                      },
                    ]}
                    initialValue={
                      item.key === "Camera.speed" ||
                      item.key === "Camera.zoom_speed"
                        ? item.key === "Camera.speed"
                          ? "6"
                          : "7"
                        : ""
                    }
                  >
                    <Input
                      type={
                        item.key === "Camera.speed" ||
                        item.key === "Camera.zoom_speed"
                          ? "number"
                          : "textarea"
                      }
                    />
                  </Form.Item>
                );
              } else
                return (
                  <Form.Item
                    name={item.key}
                    key={item.key}
                    label={item.key}
                    rules={[
                      {
                        required: true,
                        message: "Not Empty",
                      },
                    ]}
                  >
                    <Input
                      type={
                        item.key === "Camera.speed" ||
                        item.key === "Camera.zoom_speed"
                          ? "number"
                          : "textarea"
                      }
                    />
                  </Form.Item>
                );
            case PC:
              if (status === CREATE) {
                return (
                  <Form.Item
                    name={item.key}
                    key={item.key}
                    label={item.key}
                    rules={[
                      {
                        required: true,
                        message: "Not Empty",
                      },
                    ]}
                    initialValue={item.key === "PC.model" ? "standard" : ""}
                  >
                    <Input type='textarea' disabled={item.key === "PC.model"} />
                  </Form.Item>
                );
              } else
                return (
                  <Form.Item
                    name={item.key}
                    key={item.key}
                    label={item.key}
                    rules={[
                      {
                        required: true,
                        message: "Not Empty",
                      },
                    ]}
                  >
                    <Input type='textarea' disabled={item.key === "PC.model"} />
                  </Form.Item>
                );
            default:
              return (
                <Form.Item
                  name={item.key}
                  key={item.key}
                  label={item.key}
                  rules={[
                    {
                      required:
                        item.key.indexOf("desc") > 0 ||
                        item.key.indexOf("ip") > 0 ||
                        item.key.indexOf("model") > 0,
                      message: "Not Empty",
                    },
                  ]}
                >
                  <Input
                    type={
                      item.key === "DSP.lower_limit" ||
                      item.key === "DSP.higher_limit"
                        ? "number"
                        : "textarea"
                    }
                  />
                </Form.Item>
              );
          }
        })}
        <Form.Item
          hidden={
            status === CREATE ||
            nodeType === LOCATION ||
            nodeType === POSITION ||
            nodeType === PROFILE
          }
        >
          <Dropdown overlay={menuForUpdate} trigger={["click"]}>
            <Button>
              {menuTxt}
              <DownOutlined />
            </Button>
          </Dropdown>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export function PopForm(props: any) {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const onCreate = (values: any) => {
    setVisible(false);
    if (props.status === UPDATE) {
      console.log("PopForm update", values);
      switch (props.nodeType) {
        case LOCATION:
          dispatch(updateLocationRequest(values));
          break;
        case DEVICE:
          dispatch(updateDeviceRequest(values));
          break;
        case PROFILE:
          dispatch(updateProfileRequest(values));
          break;
        case POSITION:
          dispatch(updatePositionRequest(values));
          break;
        default:
          break;
      }
    } else if (props.status === CREATE) {
      console.log("PopForm create", values);
      switch (props.nodeType) {
        case LOCATION:
          dispatch(createLocationRequest(values));
          break;
        case DEVICE:
          dispatch(createDeviceRequest(values));
          break;
        case PROFILE:
          dispatch(createProfileRequest(values));
          break;
        case POSITION:
          dispatch(createPositionRequest(values));
          break;
        default:
          break;
      }
    }
  };

  const buttonText = props.status === UPDATE ? "Update" : "Create New";

  return (
    <div>
      <Button
        type='primary'
        onClick={() => {
          setVisible(true);
        }}
      >
        {buttonText}
      </Button>
      <ModalForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
        key={uuid_v4()}
        record={props.record}
        status={props.status}
        nodeType={props.nodeType}
      />
    </div>
  );
}
