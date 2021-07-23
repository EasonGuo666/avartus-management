import { Button, Form, Modal, Cascader } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid_v4 } from "uuid";
import { getAction } from "../../selectors";
import { addHasActionsRequest } from "../../slices/hasActions";
import { getActionOptions } from "./getActionOptions";

interface ModalFormProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
  record: any;
}

const ModalForm: React.FC<ModalFormProps> = ({
  visible,
  onCreate,
  onCancel,
  record,
}) => {
  const [form] = Form.useForm();
  const okText = "OK";
  const title = "Link To A New Action";
  const { actionTree } = useSelector(getAction);

  let actionOptions: any = [];
  if (actionTree) {
    let newHasActionsList: any = [];
    for (var action of record) {
      newHasActionsList.push(action["Node.uuid"]);
    }
    actionOptions = getActionOptions(actionTree, newHasActionsList);
  }

  const [newAction, setNewAction] = useState();

  const hasActionsCascader = () => {
    return (
      <div>
        <Cascader
          options={actionOptions}
          onChange={handleHasActionsCascaderChange}
          placeholder='Please choose'
        />
      </div>
    );
  };

  const handleHasActionsCascaderChange = (value: any) => {
    setNewAction(value[value.length - 1]);
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
            if (newAction) {
              values["newAction"] = newAction;
              onCreate(values);
            }
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout='vertical' name='form_in_modal'>
        <Form.Item label='Choose an action' required={true}>
          {hasActionsCascader()}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export function HasActionsForm(props: any) {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const onCreate = (values: any) => {
    setVisible(false);
    console.log("has_actions form", values);
    dispatch(addHasActionsRequest(values));
  };

  return (
    <div>
      <Button
        type='primary'
        onClick={() => {
          setVisible(true);
        }}
      >
        Link to a new action
      </Button>
      <ModalForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
        record={props.record}
        key={uuid_v4()}
      />
    </div>
  );
}
