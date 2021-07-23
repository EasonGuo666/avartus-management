import { Button, Form, Input, Modal } from "antd";
import "antd/dist/antd.css";
import React, { useState } from "react";
import { useDispatch} from "react-redux";
import { createUser } from "../../slices/user";
import { ORGNIZATION_ID } from "../../utils";
import UserformItems from "./UserformItems";

const CreateUserForm = () => {
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // submit values and create
  const onFinish = (values: any) => {
    console.log("values of form: ", values);
    dispatch(createUser(values));
    form.resetFields();
  };

  const showModal2 = () => {
    setIsModalVisible2(true);
  };

  const handleOk2 = () => {
    setIsModalVisible2(false);
  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };

  return (
    <>
      <Button type='primary' onClick={showModal2}>
        Create new
      </Button>
      <Modal
        title='Create a new user:'
        visible={isModalVisible2}
        onOk={handleOk2}
        onCancel={handleCancel2}
      >
        <Form form={form} name='create' onFinish={onFinish} layout='vertical'>
          <Form.Item
            name='name'
            label='Name'
            rules={[
              {
                required: true,
                min: 4,
                message: "Must be more than 4 characters!",
              },
            ]}
          >
            <Input placeholder='Name' />
          </Form.Item>
          <Form.Item
            name='email'
            label='E-mail'
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input the email!",
              },
            ]}
          >
            <Input placeholder='email' />
          </Form.Item>
          <UserformItems />
          <Form.Item
        name='related_oid'
        label='related_oid'
      >
        <Input placeholder={ORGNIZATION_ID} type='number' disabled />
      </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export { CreateUserForm };
