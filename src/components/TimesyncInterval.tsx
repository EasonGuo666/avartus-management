import { useDispatch, useSelector } from "react-redux";
import { getServiceInfo } from "../selectors";
import {
  readTimesyncRequest,
  updateTimesyncRequest,
} from "../slices/serviceInfo";
import { useEffect, useState } from "react";
import { Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";

function TimesyncInterval() {
  const dispatch = useDispatch();
  const { timesync_interval } = useSelector(getServiceInfo);
  const [timesync, setTimesync] = useState("");
  const [buttonTxt, setButtonTxt] = useState("3");

  const handleMenuClick = (e: any) => {
    setButtonTxt(e.key);
    setTimesync(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key='3'>3 hours</Menu.Item>
      <Menu.Item key='6'>6 hours</Menu.Item>
      <Menu.Item key='9'>9 hours</Menu.Item>
      <Menu.Item key='12'>12 hours</Menu.Item>
      <Menu.Item key='15'>15 hours</Menu.Item>
      <Menu.Item key='18'>18 hours</Menu.Item>
      <Menu.Item key='21'>21 hours</Menu.Item>
      <Menu.Item key='24'>24 hours</Menu.Item>
    </Menu>
  );

  useEffect(() => {
    dispatch(readTimesyncRequest());
  }, [dispatch]);

  function onclickTimesyncUpdate(e: any) {
    e.preventDefault();
    dispatch(updateTimesyncRequest(timesync));
  }

  return (
    <div>
      <table className='timesyncTable'>
        <tbody>
          <tr>
            <td width='200'>Time Sync Interval</td>
            <td width='200'>Current Value: {timesync_interval}</td>
            <td>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button>
                  {buttonTxt}
                  &nbsp;hours
                  <DownOutlined />
                </Button>
              </Dropdown>
              <Button onClick={onclickTimesyncUpdate}>Update</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export { TimesyncInterval };
