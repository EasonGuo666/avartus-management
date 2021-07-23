import { DownOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Menu, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getDevice, getLocation } from "../../selectors";
import {
  deleteDeviceRequest,
  findSpecificDevice,
  readAllChosenDeviceRequest,
  readDeviceRequest,
} from "../../slices/device";
import { readLocationRequest } from "../../slices/location";
import {
  CAMERA,
  CREATE,
  DEVICE,
  DSP,
  PC,
  PROJECTOR,
  SWITCHER,
  TV,
  UPDATE,
  VC,
} from "../../utils";
import {
  CameraColumns,
  DeviceColumns,
  DSPColumns,
  PCColumns,
  ProjectorColumns,
  SwitcherColumns,
  TVColumns,
  VCColumns,
} from "../../utils/columns";
import { PopForm } from ".././PopForm";
import uuidColumn from ".././uuidColumn";

function DevicePage() {
  const dispatch = useDispatch();
  const { deviceList, chosenDevices, chosenType, pending } =
    useSelector(getDevice);
  const { locationList } = useSelector(getLocation);
  let { uuid } = useParams<any>(); // device's location's uuid
  const [flag, setFlag] = useState(false);
  const [buttonTxt, setButtonTxt] = useState("Device type");
  const [dataSource, setDataSource] = useState(deviceList);

  useEffect(() => {
    dispatch(readLocationRequest());
    dispatch(readDeviceRequest(uuid));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, uuid]);

  useEffect(() => {
    if (flag === false) {
      setDataSource(deviceList);
    }
  }, [dataSource, deviceList, flag]);

  useEffect(() => {
    if (flag === true) {
      setDataSource(chosenDevices);
    }
  }, [flag, chosenDevices]);

  const [dataColumns, setDataColumns] = useState(DeviceColumns);

  useEffect(() => {
    if (flag === true) {
      setDataColumns(getDeviceColumns());
    }
    // eslint-disable-next-line
  }, [flag, chosenDevices]);

  const getDeviceColumns = (): any => {
    let newColumns = uuidColumn(DEVICE);
    switch (chosenType) {
      case TV:
        newColumns.push(...TVColumns);
        break;
      case SWITCHER:
        newColumns.push(...SwitcherColumns);
        break;
      case PC:
        newColumns.push(...PCColumns);
        break;
      case CAMERA:
        newColumns.push(...CameraColumns);
        newColumns.push({
          title: "Position",
          dataIndex: "Position",
          key: "Position",
          render: (text: any, cameraRecord: any) => (
            <Link
              className='text-primary'
              to={{ pathname: `/camera/${cameraRecord["Node.uuid"]}` }}
            >
              Position Info
            </Link>
          ),
        });
        break;
      case PROJECTOR:
        newColumns.push(...ProjectorColumns);
        break;
      case DSP:
        newColumns.push(...DSPColumns);
        break;
      case VC:
        newColumns.push(...VCColumns);
        break;
      default:
        newColumns.push(...DeviceColumns);
    }

    newColumns.push({
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (text: any, record: any) => (
        <Space size='middle'>
          <PopForm record={record} status={UPDATE} nodeType={DEVICE}></PopForm>
          <Button
            danger
            onClick={() => HandleDeleteClick(record["Node.uuid"])}
            disabled={record["~Action.target"]}
          >
            Delete
          </Button>
        </Space>
      ),
    });
    return newColumns;
  };

  function HandleDeleteClick(deviceUuid: string) {
    dispatch(deleteDeviceRequest(deviceUuid));
  }

  // set the flag to true, meaning that one item in the type menu has been clicked
  const handleMenuClick = (e: any) => {
    dispatch(findSpecificDevice(e.key));
    dispatch(readAllChosenDeviceRequest());
    setFlag(true);
    setButtonTxt(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key={TV}>{TV}</Menu.Item>
      <Menu.Item key={SWITCHER}>{SWITCHER}</Menu.Item>
      <Menu.Item key={CAMERA}>{CAMERA}</Menu.Item>
      <Menu.Item key={PC}>{PC}</Menu.Item>
      <Menu.Item key={PROJECTOR}>{PROJECTOR}</Menu.Item>
      <Menu.Item key={DSP}>{DSP}</Menu.Item>
      <Menu.Item key={VC}>{VC}</Menu.Item>
    </Menu>
  );

  let locationName = "";
  for (var location of locationList) {
    if (location["Node.uuid"] === uuid) {
      locationName = location["Location.location"];
      break;
    }
  }
  locationName += " Devices";

  return (
    <div>
      <Spin spinning={pending}>
        <Card title={locationName}>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button>
              {buttonTxt}
              <DownOutlined />
            </Button>
          </Dropdown>
          <Table columns={dataColumns} dataSource={dataSource} />
          <div hidden={chosenType === ""}>
            <PopForm status={CREATE} nodeType={DEVICE}></PopForm>
          </div>
        </Card>
      </Spin>
    </div>
  );
}

export { DevicePage };
