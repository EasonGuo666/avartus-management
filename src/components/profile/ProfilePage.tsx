import { Button, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../selectors";
import { deleteProfileRequest, readProfileRequest } from "../../slices/profile";
import { CREATE, PROFILE, UPDATE } from "../../utils";
import { ProfileColumns } from "../../utils/columns";
import { ProfileComplete } from ".././Complete";
import { PopForm } from ".././PopForm";
import uuidColumn from ".././uuidColumn";

function ProfilePage() {
  const dispatch = useDispatch();
  const { profileList, pending } = useSelector(getProfile);

  useEffect(() => {
    dispatch(readProfileRequest());
  }, [dispatch]);

  const [profileColumns, setProfileColumns] = useState([
    { title: "", dataIndex: "", key: "" },
  ]);

  useEffect(() => {
    setProfileColumns(getProfileColumns());
    // eslint-disable-next-line
  }, [profileList]);

  function getProfileColumns(): any {
    let columns = uuidColumn(PROFILE);
    columns.push(...ProfileColumns);
    columns.push({
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any) => (
        <Space size='middle'>
          <PopForm record={record} status={UPDATE} nodeType={PROFILE}></PopForm>
          <Button danger onClick={() => HandleDeleteClick(record["Node.uuid"])}>
            Delete
          </Button>
        </Space>
      ),
    });
    return columns;
  }

  function HandleDeleteClick(profileUuid: string) {
    dispatch(deleteProfileRequest(profileUuid));
  }

  return (
    <div>
      <Spin spinning={pending}>
        <ProfileComplete children={profileList}></ProfileComplete>
        <Table columns={profileColumns} dataSource={profileList} />
        <PopForm status={CREATE} nodeType={PROFILE}></PopForm>
      </Spin>
    </div>
  );
}

export { ProfilePage };
