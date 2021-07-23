import { Button, Form, Input } from "antd";
import { getCloud } from "../../selectors";
import { useDispatch, useSelector } from "react-redux";
import Modal from "antd/lib/modal/Modal";
import { useState } from "react";
import { requestUpdateConfig } from "../../slices/cloud";
import { v4 as uuid_v4 } from "uuid";

interface ModalFormProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
  record?: any;
}

const ModalForm: React.FC<ModalFormProps> = ({
  visible,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const okText = "Update";
  const title = "Update Config";
  const { serviceConfig } = useSelector(getCloud);

  let configItem: any = []; // auto generate form's row
  if (serviceConfig.config) {
    Object.entries(serviceConfig.config).forEach(([key, value]: any) => {
      configItem.push({ key, value });
    });
  }

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
            values["CloudGrpcAddr"] = values["CloudGrpcAddr"] + ":50001";
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        layout='vertical'
        name='form_in_modal'
        initialValues={serviceConfig.config}
      >
        {configItem.map((item: any) => {
          return (
            <Form.Item
              name={item.key}
              key={item.key}
              label={item.key}
              hidden={
                item.key === "ConfFile" ||
                item.key === "ConfigFile"
              }
            >
              <Input type='textarea' />
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
};

export function CloudConfigPopForm(props: any) {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const onCreate = (values: any) => {
    setVisible(false);
    dispatch(requestUpdateConfig(values));
  };
  return (
    <div>
      <Button
        type='primary'
        onClick={() => {
          setVisible(true);
        }}
      >
        Update
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
