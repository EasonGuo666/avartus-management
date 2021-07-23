import { Button, Form, Input, message } from "antd";
import { useSelector } from "react-redux";
import { putRequest } from "../../saga/requests";
import { getAuth } from "../../selectors";
import { getHeaders } from "../../utils";
import { SettingsHeaderBar } from "./SettingsHeaderBar";

function ChangePswd() {
  const { user } = useSelector(getAuth);

  function checkNewPswd(newPswd: string, confPswd: string) {
    if (newPswd !== confPswd) {
      return false;
    }
    return true;
  }

  async function sendChangePswdRequest(values: any) {
    const header = getHeaders();
    var data = {
      login: {
        new_password: values.newPassword,
        cur_password: values.previousPassword,
      },
    };

    const surfixURL = "/api/v1/users/" + user.id + "/credential";

    try {
      console.log("data:", data);
      console.log("surfixUrl:", surfixURL);
      const res = await putRequest(data, surfixURL, header);
      if (res.status === 200) {
        console.log("res", res);
        message.success("please log out and login again using new password");
      }
    } catch (error) {
      message.error("input the right previous password");
      console.log(error);
    }
  }

  async function onFinish(values: any) {
    if (!checkNewPswd(values.newPassword, values.confirmPassword)) {
      message.error("please input the same password again");
      return;
    }
    console.log("here");
    await sendChangePswdRequest(values);
  }

  function onFinishFailed() {
    console.log("failed");
  }

  return (
    <div>
      <SettingsHeaderBar />
      <Form
        className='body-form  pt-4'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label='Current Password'
          name='previousPassword'
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password autoComplete='on' />
        </Form.Item>

        <Form.Item
          label='New Password'
          name='newPassword'
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password autoComplete='on' />
        </Form.Item>

        <Form.Item
          label='Confirm Password'
          name='confirmPassword'
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password autoComplete='on' />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export { ChangePswd };
