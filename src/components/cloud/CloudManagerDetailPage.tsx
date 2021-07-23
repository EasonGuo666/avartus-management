import { DownOutlined } from "@ant-design/icons/lib/icons";
import { Button, Dropdown, Menu } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { CloudServiceDetailPage } from "..";
import { sendConfigurations } from "../../slices/cloud";
import { BadgerManager } from "./BadgerManager";

function CloudManagerDetailPage() {
  const dispatch = useDispatch();
  const [buttonTxt, setButtonTxt] = useState("Configurations");
  const [config, setConfig] = useState("");

  const handleMenuClick = (e: any) => {
    setButtonTxt(e.key);
    setConfig(e.key);
  };
  const handleSend = (input: string) => {
    dispatch(sendConfigurations(input));
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key='devices'>devices</Menu.Item>
      <Menu.Item key='locations'>locations</Menu.Item>
      <Menu.Item key='profiles'>profiles</Menu.Item>
      <Menu.Item key='all'>all</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <BadgerManager />
      <br />
      <br />
      <b>Manager Send Configurations : </b>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button>
          {buttonTxt}
          <DownOutlined />
        </Button>
      </Dropdown>
      <Button onClick={() => handleSend(config)}>Send</Button>
      <br />
      <br />
      <br />
      <CloudServiceDetailPage />
    </div>
  );
}

export { CloudManagerDetailPage };
