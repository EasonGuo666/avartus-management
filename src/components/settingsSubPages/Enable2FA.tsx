import { Button, Checkbox, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRequest, postRequest, putRequest } from "../../saga/requests";
import { getAuth } from "../../selectors";
import "../../styles/SettingsPage.css";
import { getHeaders } from "../../utils";
import { SettingsHeaderBar } from "./SettingsHeaderBar";

function Enable2FA() {
  const { user } = useSelector(getAuth);
  const [showQRcode, setShowQRcode] = useState(false);
  const [showPswdInput, setShowPswdInput] = useState(false);
  const [authKey, setAuthKey] = useState("");
  const [arr, setArr] = useState(Buffer.alloc(0));
  const [blobUrl, setBlobUrl] = useState("");

  function checkBoxDefault() {
    if (user.otp === "true") {
      return true;
    }
    return false;
  }

  function convertDataURLToBinaryBuffer(dataURI: any) {
    return Buffer.from(dataURI, "base64");
  }

  function convertBinaryArrayToBlob(binArray: any) {
    var blob = new Blob([binArray], { type: "image/png" });
    return URL.createObjectURL(blob);
  }

  useEffect(() => {
    if (user.otp === "false") {
      console.log("server end otp is off");
    } else {
      console.log("server end otp is on");
    }
  }, [user.otp]);

  useEffect(() => {
    setBlobUrl(convertBinaryArrayToBlob(arr));
  }, [arr]);

  async function sendEnable2FARequest() {
    const header = getHeaders();
    const surfixURL = "/api/v1/otp/" + user.email;
    try {
      console.log("surfixUrl:", surfixURL);
      const res = await getRequest(surfixURL, header);
      if (res.status === 200) {
        console.log("res:", res);
        //res.data is the base64URL, show it here
        setAuthKey(res.data.result.otp_key);
        setArr(convertDataURLToBinaryBuffer(res.data.result.otp_qr));
        message.success("Input OTP code to enable Two-factor authentication");
      }
    } catch (error) {
      message.error("Failed to turn on 2FA");
      console.log(error);
    }
  }

  async function handleChange(e: any) {
    // when the user otp is off, then if checkbox is ticked, update the server
    if (user.otp === "false") {
      if (e.target.checked === true) {
        console.log("hihi");
        await sendEnable2FARequest();
        setShowQRcode(true);
      } else {
        setShowQRcode(false);
      }
    }
    // when the user otp is on, then if checkbox is ticked, only send Password and leave the otp_key blank
    if (user.otp === "true") {
      if (e.target.checked === true ) {
        setShowPswdInput(false);
      } else {
        setShowPswdInput(true);
      }
    }
  }

  async function updateOTP(currentPswd: string, otp_key: string) {
    const header = getHeaders();
    const surfixURL = "/api/v1/users/" + user.id + "/credential";
    var data = {
      login: {
        cur_password: currentPswd,
        otp_key: otp_key,
      },
    };
    console.log("data:", data);
    console.log("surfixURL:", surfixURL);
    try {
      const res = await putRequest(data, surfixURL, header);
      if (res.status === 200) {
        message.success("OTP Updated!!");
      }
    } catch (error) {
      message.error("Failed to update OTP");
      console.log(error);
    }
  }

  async function onFinish(values: any) {
    console.log("values:", values);
    const header = getHeaders();
    const surfixURL = "/api/v1/otp";
    var data = {
      otp_key: authKey,
      otp_code: values.otp_code,
    };
    console.log("data:", data);
    console.log("surfixURL:", surfixURL);
    try {
      const res = await postRequest(data, surfixURL, header);
      if (res.status === 200) {
        console.log("res:", res);
        updateOTP(values.currentPswd, authKey);
        message.success("Two-factor authentication enabled");
      }
    } catch (error) {
      message.error("Failed to turn on 2FA");
      console.log(error);
    }
  }

  function onFinishFailed() {
    console.log("failed");
  }

  async function disableOTP(values: any) {
    await updateOTP(values.currentPswd, "");
  }

  return (
    <div>
      <SettingsHeaderBar />
      <Checkbox
        className='body-form'
        onChange={handleChange}
        defaultChecked={checkBoxDefault()}
      >
        Enable two-factor authentication
      </Checkbox>
      <div>
        {showQRcode ? (
          <Form
            className='body-form'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 10 }}
          >
            <img src={blobUrl} alt='' className='QRcode' />
            <Form.Item
              label='Current Password'
              name='currentPswd'
              rules={[
                { required: true, message: "Please input your otp code!" },
              ]}
            >
              <Input.Password autoComplete='on' />
            </Form.Item>
            <Form.Item
              label='Otp Code'
              name='otp_code'
              rules={[
                { required: true, message: "Please input your otp code!" },
              ]}
            >
              <Input.Password autoComplete='on' />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Verify
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div></div>
        )}
      </div>
      <div>
        {showPswdInput ? (
          <Form
            className='body-form'
            onFinish={disableOTP}
            onFinishFailed={onFinishFailed}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 10 }}
          >
            <Form.Item
              label='Current Password'
              name='currentPswd'
              rules={[
                { required: true, message: "Please input your otp code!" },
              ]}
            >
              <Input.Password autoComplete='on' />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Disable 2FA
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export { Enable2FA };
