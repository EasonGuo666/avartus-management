import { Button, Form, Input, Modal } from "antd";
import "antd/dist/antd.css";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../slices/user";
import UserformItems from "./UserformItems";

// User update popform component:
const UpdateUserForm: React.FC<any> = ({ record }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // submit values and create
  const onSubmit = (values: any) => {
    console.log("values of form: ", values);
    dispatch(updateUser({ id: record["id"], values: values }));
  };

  const onCancel = () => {
    setIsVisible(false);
  };
  const showForm = () => {
    setIsVisible(true);
  };

  const onOk = () => {
    setIsVisible(false);
  };

  return (
    <>
      <Button type='primary' onClick={showForm}>
        Update
      </Button>
      <Modal
        title='Update the user:'
        visible={isVisible}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Form
          form={form}
          name='update'
          onFinish={onSubmit}
          layout='vertical'
          initialValues={record}
        >
          {/* form item name should be consistant with data index */}
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
          <Form.Item name='email' label='E-mail'>
            <Input placeholder='email' disabled />
          </Form.Item>
          <UserformItems />
          <Form.Item name='related_oid' label='related_oid'>
            <Input placeholder='related_oid' type='number' disabled />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export { UpdateUserForm };
