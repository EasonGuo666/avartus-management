import { Button, Card, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPosition } from "../../selectors";
import { deletePositionRequest, readPositionRequest } from "../../slices/position";
import { CREATE, POSITION, UPDATE } from "../../utils";
import { PositionColumns } from "../../utils/columns";
import { PopForm } from ".././PopForm";

function PositionPage() {
  const dispatch = useDispatch();
  const { positionList, pending } = useSelector(getPosition);
  let { uuid } = useParams<any>(); // camera's uuid

  useEffect(() => {
    dispatch(readPositionRequest(uuid));
  }, [dispatch, uuid]);

  const [positionColumns, setDataColumns] = useState([
    { title: "test", dataIndex: "test", key: "test" },
  ]);

  useEffect(() => {
    setDataColumns(getPositionColumns());
    // eslint-disable-next-line
  }, [positionList]);

  function getPositionColumns(): any {
    let columns = [];
    columns.push({
      title: "Uuid",
      dataIndex: "Node.uuid",
      key: "Node.uuid",
    });
    columns.push(...PositionColumns);
    columns.push({
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any) => (
        <Space size='middle'>
          <PopForm
            record={record}
            status={UPDATE}
            nodeType={POSITION}
          ></PopForm>
          <Button danger onClick={() => HandleDeleteClick(record["Node.uuid"])}>
            Delete
          </Button>
        </Space>
      ),
    });
    return columns;
  }

  function HandleDeleteClick(positionUuid: string) {
    dispatch(deletePositionRequest(positionUuid));
  }

  return (
    <div>
      <Spin spinning={pending}>
        <Card title='Positions Info'>
          <Table columns={positionColumns} dataSource={positionList} />
          <PopForm status={CREATE} nodeType={POSITION}></PopForm>
        </Card>
      </Spin>
    </div>
  );
}

export { PositionPage };
