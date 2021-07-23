import { Button, Card, Space, Spin, Table } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getHasActions, getRecursive } from "../../selectors";
import { readAllActionRequest } from "../../slices/action";
import {
  readHasActionsRequest,
  removeHasActionsRequest,
} from "../../slices/hasActions";
import { readProfileRequest } from "../../slices/profile";
import {
  readRecursiveRequest,
  removeRecursiveRequest,
} from "../../slices/recursive";
import { PROFILE } from "../../utils";
import { ActionColumns, ProfileColumns } from "../../utils/columns";
import { HasActionsForm } from "./hasActionsForm";
import { RecursiveForm } from "./recursiveForm";
import uuidColumn from ".././uuidColumn";

function ProfileDetailPage() {
  const dispatch = useDispatch();
  const { hasActionsList, readHasActionsPending, updateHasActionsPending } =
    useSelector(getHasActions);
  const { recursiveList, readRecursivePending, updateRecursivePending } =
    useSelector(getRecursive);
  let { uuid } = useParams<any>();

  useEffect(() => {
    dispatch(readHasActionsRequest(uuid));
    dispatch(readAllActionRequest());
    dispatch(readRecursiveRequest(uuid));
    dispatch(readProfileRequest());
  }, [dispatch, uuid]);

  const getHasActionsColumns = (): any => {
    let columns = [];
    columns.push(...ActionColumns);
    columns.push({
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any) => (
        <Space size='middle'>
          <Button
            danger
            onClick={() => HandleRemoveHasActionClick(record["Node.uuid"])}
          >
            Remove
          </Button>
        </Space>
      ),
    });
    return columns;
  };

  function getRecursiveColumns(): any {
    let columns = uuidColumn(PROFILE);
    columns.push(...ProfileColumns);
    columns.push({
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any) => (
        <Space size='middle'>
          <Button
            danger
            onClick={() => HandleRemoveRecursiveClick(record["Node.uuid"])}
          >
            Remove
          </Button>
        </Space>
      ),
    });
    return columns;
  }

  function HandleRemoveHasActionClick(actionUuid: string) {
    dispatch(removeHasActionsRequest(actionUuid));
  }

  function HandleRemoveRecursiveClick(profileUuid: string) {
    dispatch(removeRecursiveRequest(profileUuid));
  }

  return (
    <div>
      <Card title="Profile's has_actions">
        <Spin spinning={readHasActionsPending || updateHasActionsPending}>
          <Table columns={getHasActionsColumns()} dataSource={hasActionsList} />
          <HasActionsForm record={hasActionsList}></HasActionsForm>
        </Spin>
      </Card>

      <br />
      <Card title="Profile's recursive">
        <Spin spinning={readRecursivePending || updateRecursivePending}>
          <Table columns={getRecursiveColumns()} dataSource={recursiveList} />
          <RecursiveForm></RecursiveForm>
        </Spin>
      </Card>
    </div>
  );
}

export { ProfileDetailPage };
