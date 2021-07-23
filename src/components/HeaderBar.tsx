import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { Dropdown, Menu, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "../selectors";
import { logout } from "../slices/auth";
import "../styles/HeaderBar.css";
import { history } from "../utils";
import imgLogo from "../utils/avartusLogo.png";
import { HiddenByTrustLevel } from "./HiddenByTrustLevel";


const HeaderBar = () => {
  const [btnText, setBtnText] = useState<string>();
  const user = useSelector(getAuth).user; //username信息
  const dispatch = useDispatch();

  useEffect(() => {
    // if already logged in, use the username for button text
    if (localStorage.token) {
      setBtnText(user.name);
    } else {
      setBtnText("Login");
    }
  }, [user]);

  const handleMenuClick = (e: any) => {
    if (localStorage.token) {
      switch (e.key) {
        case "settings":
          history.push({ pathname: "/settings/profile" });
          break;
        case "logout":
          history.push({ pathname: "/login" });
          dispatch(logout());
          break;
        default:
          console.log("click on:", e.key);
          break;
      }
    } else {
      message.error("please login first");
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key='settings' icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item key='logout' icon={<LogoutOutlined />}>
        Log out
      </Menu.Item>
    </Menu>
  );

  const toHomePage = () => {
    history.push({ pathname: "/" });
  };

  const toLocationPage = () => {
    history.push({ pathname: "/location" });
  };

  const toProfilePage = () => {
    history.push({ pathname: "/profile" });
  };

  const toUsersPage = () => {
    history.push({ pathname: "/users" });
  };

  return (
    <header className='global-header absolute left-0'>
      <img src={imgLogo} alt='' className='logo' />
      <button className='logoName' onClick={toHomePage}>
        Avartus
      </button>
      <button className='headerbar-dgraph' onClick={toLocationPage}>
        Location
      </button>
      <button className='headerbar-dgraph' onClick={toProfilePage}>
        Profile
      </button>
      <button className='headerbar-dgraph' onClick={toUsersPage} hidden={!HiddenByTrustLevel()}>
        Users
      </button>
      <Dropdown overlay={menu} trigger={["click"]}>
        <button className='btn-green absolute right-2'>{btnText}</button>
      </Dropdown>
    </header>
  );
};

export default HeaderBar;
