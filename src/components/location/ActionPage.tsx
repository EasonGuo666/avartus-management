import { Button, Card, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAction, getDevice } from "../../selectors";
import { deleteActionRequest, readActionRequest } from "../../slices/action";
import { readAllChosenDeviceRequest } from "../../slices/device";
import { CREATE, UPDATE } from "../../utils";
import { ActionColumns } from "../../utils/columns";

import { ActionForm } from "./actionForm";

function ActionPage() {
  const dispatch = useDispatch();
  const { chosenDevices, chosenType } = useSelector(getDevice);
  const { actionList, pending } = useSelector(getAction);
  let { uuid } = useParams<any>();

  useEffect(() => {
    dispatch(readAllChosenDeviceRequest());
    dispatch(readActionRequest(uuid));
  }, [dispatch, uuid]);

  const [actionColumns, setActionColumns] = useState([
    { title: "example", dataIndex: "example", key: "example" },
  ]);

  useEffect(() => {
    setActionColumns(getActionColumns());
    // eslint-disable-next-line
  }, [actionList]);

  const getActionColumns = (): any => {
    let columns = [];
    columns.push(...ActionColumns);
    columns.push({
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any) => (
        <Space size='middle'>
          <ActionForm record={record} status={UPDATE}></ActionForm>
          <Button
            danger
            onClick={() => HandleDeleteClick(record["Node.uuid"])}
            disabled={record["~Profile.has_actions"]}
          >
            Delete
          </Button>
        </Space>
      ),
    });
    return columns;
  };

  function HandleDeleteClick(actionUuid: string) {
    dispatch(deleteActionRequest(actionUuid));
  }

  let deviceDesc = "";
  if (chosenDevices) {
    for (var device of chosenDevices) {
      if (device["Node.uuid"] === uuid) {
        deviceDesc = device[chosenType + ".desc"];
        break;
      }
    }
  }

  return (
    <div>
      <Spin spinning={pending}>
        <Card title={deviceDesc}>
          <Table columns={actionColumns} dataSource={actionList} />
          <ActionForm
            status={CREATE}></ActionForm>
        </Card>
      </Spin>
    </div>
  );
}

export { ActionPage };
