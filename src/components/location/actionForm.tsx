import { Button, Cascader, Form, Input, Modal, Select } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid_v4 } from "uuid";
import { getDevice } from "../../selectors";
import { createActionRequest, updateActionRequest } from "../../slices/action";
import {
  CAMERA,
  CAMERAActions,
  CREATE,
  DSP,
  DSPActions,
  PC,
  PCActions,
  PROJECTOR,
  PROJECTORActions,
  SWITCHER,
  SWITCHERActions,
  TV,
  TVActions,
  UPDATE,
  VC,
  VCActions,
} from "../../utils";
import { useParams } from "react-router-dom";
import { getTargetOptions } from "./getTargetOptions";


interface ModalFormProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
  record: any;
  status: string;
}

const ModalForm: React.FC<ModalFormProps> = ({
  visible,
  onCreate,
  onCancel,
  record,
  status,
}) => {
  const [form] = Form.useForm();
  const okText = status === UPDATE ? "Update" : "Create";
  const title = status === UPDATE ? "Update" : "Create";

  const { allChosenDeviceList, chosenType } = useSelector(getDevice);

  let { uuid } = useParams<any>();
  const [target, setTarget] = useState(uuid);
  const [actionOp, setActionOp] = useState(
    status === UPDATE ? record["Action.op"] : ""
  );

  let actionOptions: any = [];
  switch (chosenType) {
    case TV:
      actionOptions = TVActions;
      break;
    case SWITCHER:
      actionOptions = SWITCHERActions;
      break;
    case PROJECTOR:
      actionOptions = PROJECTORActions;
      break;
    case PC:
      actionOptions = PCActions;
      break;
    case DSP:
      actionOptions = DSPActions;
      break;
    case CAMERA:
      actionOptions = CAMERAActions;
      break;
    case VC:
      actionOptions = VCActions;
      break;
    default:
      break;
  }

  const handleHasActionsSelectChange = (value: any) => {
    setActionOp(value);
  };

  const actionOpSelect = () => {
    return (
      <div>
        <Select
          options={actionOptions}
          onChange={handleHasActionsSelectChange}
          defaultValue={actionOp}
          placeholder='Please select'
        />
      </div>
    );
  };

  let targetOptions: any = [];
  if (allChosenDeviceList) {
    targetOptions = getTargetOptions(allChosenDeviceList, uuid);
  }

  const targetCascader = () => {
    return (
      <div>
        <Cascader
          options={targetOptions}
          onChange={handleTargetCascaderChange}
          placeholder='Please choose'
          defaultValue={[uuid]}
        />
      </div>
    );
  };

  const handleTargetCascaderChange = (value: any) => {
    setTarget(value[value.length - 1]);
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
            values["target"] = target;
            if (actionOp) {
              values["Action.op"] = actionOp;
              onCreate(values);
            }
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
        initialValues={record}
      >
        <Form.Item
          hidden={true}
          name='Node.uuid'
          key='Node.uuid'
          label='Node.uuid'
        >
          <Input type='textarea' />
        </Form.Item>
        <Form.Item label='Action.op' required={true}>
          {actionOpSelect()}
        </Form.Item>
        <Form.Item
          name='Action.params'
          key='Action.params'
          label='Action.params'
        >
          <Input type='textarea' />
        </Form.Item>
        <Form.Item label='Target' hidden={status === CREATE}>
          {targetCascader()}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export function ActionForm(props: any) {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const onCreate = (values: any) => {
    setVisible(false);
    if (props.status === UPDATE) {
      console.log("ActionForm update", values);
      dispatch(updateActionRequest(values));
    } else if (props.status === CREATE) {
      console.log("Action create", values);
      dispatch(createActionRequest(values));
    }
  };

  const buttonText = props.status === UPDATE ? "Update" : "Create New";

  return (
    <div>
      <Button
        type='primary'
        onClick={() => {
          setVisible(true);
        }}
      >
        {buttonText}
      </Button>
      <ModalForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
        key={uuid_v4()}
        record={props.record}
        status={props.status}
      />
    </div>
  );
}
