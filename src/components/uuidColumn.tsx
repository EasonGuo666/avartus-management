import { BookOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { history } from "../utils";

function uuidColumn(nodeType: string) {
  const newColumns: any = [];
  newColumns.push({
    dataIndex: "Node.uuid",
    key: "Node.uuid",
    render: (text: any, record: any) => (
      <Button
        icon={<BookOutlined />}
        type='primary'
        onClick={() =>
          history.push({ pathname: `/${nodeType}/${record["Node.uuid"]}` })
        }
      >
        Details
      </Button>
    ),
  });
  return newColumns;
}

export default uuidColumn;
