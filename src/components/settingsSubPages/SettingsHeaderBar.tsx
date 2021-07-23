import {
  CheckCircleOutlined,
  EditOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import "../../styles/SettingsPage.css";
import { history } from "../../utils";

function SettingsHeaderBar() {
  const handleOpenPanel = (e: any) => {
    switch (e.key) {
      case "profile":
        history.push("/settings/profile");
        break;
      case "password":
        history.push("/settings/password");
        break;
      case "enable2FA":
        history.push("/settings/enable2FA");
        break;
      case "newSettingItem":
        history.push("/settings/newSettingItem");
        break;
    }
  };

  return (
    <Menu
      className='top-navbar'
      mode='horizontal'
      onClick={(e) => handleOpenPanel(e)}
    >
      <Menu.Item key='profile'>
        <UserOutlined />
        &nbsp; Profile
      </Menu.Item>

      <Menu.Item key='password'>
        <EditOutlined />
        &nbsp; Password
      </Menu.Item>

      <Menu.Item key='enable2FA'>
        <CheckCircleOutlined />
        &nbsp; Enable 2FA
      </Menu.Item>

      <Menu.Item key='newSettingItem'>
        <SettingOutlined />
        &nbsp; New Setting Item
      </Menu.Item>
    </Menu>
  );
}

export { SettingsHeaderBar };
