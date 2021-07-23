import { Button, Form, Modal, Select } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid_v4 } from "uuid";
import { getProfile, getRecursive } from "../../selectors";
import { addRecursiveRequest } from "../../slices/recursive";
import { getRecursiveOptions } from "./getRecursiveOptions";

interface ModalFormProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({
  visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const okText = "OK";
  const title = "Link To A New Profile";
  const { recursiveUuidList } = useSelector(getRecursive);
  const { profileList } = useSelector(getProfile);

  let recursiveOptions: any = [];
  if (recursiveUuidList && profileList) {
    recursiveOptions = getRecursiveOptions(profileList, recursiveUuidList);
  }

  const [newRecursive, setNewRecursive] = useState();

  const RecursiveSelect = () => {
    return (
      <div>
        <Select
          options={recursiveOptions}
          onChange={handleRecursiveSelectChange}
          placeholder='Please choose'
        />
      </div>
    );
  };

  const handleRecursiveSelectChange = (value: any) => {
    setNewRecursive(value);
  };

  return (
    <Modal
      visible={visible}
      title={title}
      okText={okText}
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            if (newRecursive) {
              values["newRecursive"] = newRecursive;
              onCreate(values);
            }
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout='vertical' name='form_in_modal'>
        <Form.Item label='Choose a profile' required={true}>
          {RecursiveSelect()}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export function RecursiveForm() {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const onCreate = (values: any) => {
    setVisible(false);
    console.log("Recursive form", values);
    dispatch(addRecursiveRequest(values));
  };

  return (
    <div>
      <Button
        type='primary'
        onClick={() => {
          setVisible(true);
        }}
      >
        Link to a new profile
      </Button>
      <ModalForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
        key={uuid_v4()}
      />
    </div>
  );
}
