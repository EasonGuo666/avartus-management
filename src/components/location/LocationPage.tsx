import { Table, Space, Button, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getLocation } from "../../selectors";
import { deleteLocationRequest, readLocationRequest } from "../../slices/location";
import { useEffect, useState } from "react";
import { PopForm } from ".././PopForm";
import { CREATE, LOCATION, UPDATE } from "../../utils";
import { LocationColumns } from "../../utils/columns";
import uuidColumn from ".././uuidColumn";
import { LocationComplete } from ".././Complete";

function LocationPage() {
  const dispatch = useDispatch();
  const { locationList, pending } = useSelector(getLocation);

  useEffect(() => {
    dispatch(readLocationRequest());
  }, [dispatch]);

  const [locationColumns, setDataColumns] = useState([
    { title: "", dataIndex: "", key: "" },
  ]);

  useEffect(() => {
    setDataColumns(getlocationColumns());
    // eslint-disable-next-line
  }, [locationList]);

  function getlocationColumns(): any {
    let columns = uuidColumn(LOCATION);
    columns.push(...LocationColumns);
    columns.push({
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any) => (
        <Space size='middle'>
          <PopForm
            record={record}
            status={UPDATE}
            nodeType={LOCATION}
          ></PopForm>
          <Button
            danger
            onClick={() => HandleDeleteClick(record["Node.uuid"])}
            disabled={record["~Node.locate"]}
          >
            Delete
          </Button>
        </Space>
      ),
    });
    return columns;
  }

  function HandleDeleteClick(locationUuid: string) {
    dispatch(deleteLocationRequest(locationUuid));
  }

  return (
    <div>
      <Spin spinning={pending}>
        <LocationComplete children={locationList}></LocationComplete>
        <br />
        <Table columns={locationColumns} dataSource={locationList} />
        <PopForm status={CREATE} nodeType={LOCATION}></PopForm>
      </Spin>
    </div>
  );
}

export { LocationPage };
