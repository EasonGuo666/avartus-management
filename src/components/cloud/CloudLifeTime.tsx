import { DownOutlined } from "@ant-design/icons/lib/icons";
import { Button, Dropdown, Input, Menu } from "antd";
import { useState } from "react";
import { useDispatch} from "react-redux";
import { sendLifeTime } from "../../slices/cloud";

function CloudLifeTime() {
  const dispatch = useDispatch();
  const [buttonTxt, setButtonTxt] = useState("Devices");
  const [device, setDevice] = useState("");
  const [time, setTime] = useState(0);


  const handleMenuClick = (e: any) => {
    setButtonTxt(e.key);
    setDevice(e.key);
  };
  const handleChange = (e: any) => {
    setTime(e.target.value);
  };
  const handleSend = (input1: string, input2: number) => {
    dispatch(sendLifeTime({ device: input1, lifetime: input2 }));
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key='tv_service'>tv_service</Menu.Item>
      <Menu.Item key='projector_service'>projector_service</Menu.Item>
      <Menu.Item key='switcher_service'>switcher_service</Menu.Item>
      <Menu.Item key='camera_service'>camera_service</Menu.Item>
      <Menu.Item key='dsp_service'>dsp_service</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div>Change Lifetime: </div>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button>
          {buttonTxt}
          <DownOutlined />
        </Button>
      </Dropdown>
      <Input
        type='number'
        onChange={handleChange}
        style={{ width: 200 }}
        placeholder='Input time'
      />
      <Button onClick={() => handleSend(device, time)}>Send</Button>
      <br />
      <br />
    </div>
  );
}

export { CloudLifeTime };
