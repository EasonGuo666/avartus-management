import { Button, Form, message, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRequest, putRequest } from "../../saga/requests";
import { getAuth } from "../../selectors";
import { changeUser } from "../../slices/auth";
import "../../styles/SettingsPage.css";
import { getHeaders } from "../../utils";
import { SettingsHeaderBar } from "./SettingsHeaderBar";

function UserProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector(getAuth);
  const header = getHeaders();

  const [userNamePasser, setUserNamePasser] = useState("");
  const [userName, setUserName] = useState("");

  const [phonePasser, setPhonePasser] = useState("");
  const [phone, setPhone] = useState("");

  const [activePasser, setActivePasser] = useState(true);
  const [active, setActive] = useState("hihi");

  const [oidPasser, setOidPasser] = useState("");
  const [oid, setOid] = useState("");

  async function getUserInfo() {
    const surfixURL = "/api/v1/users/" + user.id;
    try {
      const res = await getRequest(surfixURL, header);
      if (res.status === 200) {
        setUserNamePasser(res.data.user.name);
        setPhonePasser(res.data.user.phone);
        setActivePasser(res.data.user.active);
        setOidPasser(res.data.user.related_oid);
      }
    } catch (error) {
      message.error("Failed to fetch user information");
      console.log(error);
    }
  }

  getUserInfo();

  useEffect(() => {
    setUserName(userNamePasser);
    setPhone(phonePasser);
    if (activePasser === true) {
      setActive("true");
    } else {
      setActive("false");
    }
    setOid(oidPasser);
  }, [userNamePasser, phonePasser, activePasser, oidPasser]);

  async function updateProfile() {
    const data = {
      user: {
        name: userName,
        phone: phone,
      },
    };
    const surfixURL = "/api/v1/users/" + user.id;
    try {
      const res = await putRequest(data, surfixURL, header);
      if (res.status === 200) {
        message.success("Updated successfully");
        console.log("res:", res);
        const action = changeUser(res.data.user.name);
        dispatch(action);
      }
    } catch (error) {
      message.error("Failed to update user profile");
      console.log(error);
    }
  }

  const { Paragraph } = Typography;
  return (
    <div>
      <SettingsHeaderBar />
      <div className='body-form pl-5'>
        <Form labelCol={{ span: 3 }} wrapperCol={{ span: 16 }}>
          <Form.Item className='profileFormItem' label='User Name'>
            <Paragraph className='mt-2' editable={{ onChange: setUserName }}>
              {userName}
            </Paragraph>
          </Form.Item>
          <Form.Item className='profileFormItem' label='Phone'>
            <Paragraph className='mt-2' editable={{ onChange: setPhone }}>
              {phone}
            </Paragraph>
          </Form.Item>
          <Form.Item className='profileFormItem' label='Active'>
            <Paragraph className='mt-2 text-gray-400'>{active}</Paragraph>
          </Form.Item>
          <Form.Item className='profileFormItem' label='Organization'>
            <Paragraph className='mt-2 text-gray-400'>{oid}</Paragraph>
          </Form.Item>
          <Form.Item className='profileFormItem'>
            <Button type='primary' onClick={updateProfile}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export { UserProfile };
