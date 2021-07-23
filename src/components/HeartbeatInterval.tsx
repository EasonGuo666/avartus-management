import { useDispatch, useSelector } from "react-redux";
import { getServiceInfo } from "../selectors";
import {
  readHeartbeatRequest,
  updateHeartbeatRequest,
} from "../slices/serviceInfo";
import { useEffect, useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";

function HeartbeatInterval() {
  const dispatch = useDispatch();
  const { heartbeat_interval } = useSelector(getServiceInfo);
  const [heartbeat, setHeartbeat] = useState("");
  const [buttonTxt, setButtonTxt] = useState("1");

  const handleMenuClick = (e: any) => {
    setButtonTxt(e.key);
    setHeartbeat(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key='1'>1 min</Menu.Item>
      <Menu.Item key='2'>2 min</Menu.Item>
      <Menu.Item key='3'>3 min</Menu.Item>
      <Menu.Item key='4'>4 min</Menu.Item>
      <Menu.Item key='5'>5 min</Menu.Item>
      <Menu.Item key='6'>6 min</Menu.Item>
      <Menu.Item key='7'>7 min</Menu.Item>
      <Menu.Item key='8'>8 min</Menu.Item>
      <Menu.Item key='9'>9 min</Menu.Item>
      <Menu.Item key='10'>10 min</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    dispatch(readHeartbeatRequest());
  }, [dispatch]);

  function onclickHeartbeatUpdate(e: any) {
    e.preventDefault();
    dispatch(updateHeartbeatRequest(heartbeat));
  }

  return (
    <div>
      <table className='heartbeatTable'>
        <tbody>
          <tr>
            <td width='200'>Heartbeat Interval</td>
            <td width='200'>Current Value: {heartbeat_interval}</td>
            <td>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button>
                  {buttonTxt}
                  &nbsp;min
                  <DownOutlined />
                </Button>
              </Dropdown>
              <Button onClick={onclickHeartbeatUpdate}>Update</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export { HeartbeatInterval };
