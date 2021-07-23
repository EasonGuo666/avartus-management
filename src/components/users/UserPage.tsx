import { Space, Table } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid_v4 } from "uuid";
import { getUser } from "../../selectors";
import { deleteUser, requestUserList } from "../../slices/user";
import { CreateUserForm } from "./CreateForm";
import { UpdateUserForm } from "./UpdateForm";
import { UserSearchByEmail, UserSearchByName } from "./UserSearch";

function UserPage() {
  const dispatch = useDispatch();
  const { userList } = useSelector(getUser);

  useEffect(() => {
    dispatch(requestUserList());
  }, [dispatch]);

  function handleDeleteClick(id: string) {
    console.log("delete: ", id);
    dispatch(deleteUser(id));
  }

  // add a key to each child data object(incase creating table needs)
  let arrayList: Array<any> = [];
  Object.entries(userList).forEach(([key, value]: any) => {
    const ob = {
      ...value,
      key: uuid_v4(),
    };
    arrayList.push(ob);
  });

  console.log("arr: ", arrayList);

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "trust_level",
      dataIndex: "trust_level",
      key: "trust_level",
    },
    {
      title: "active",
      dataIndex: "active",
      key: "active",
      render: (val: boolean) => (val ? "true" : "false"),
    },
    {
      title: "related_oid",
      dataIndex: "related_oid",
      key: "related_oid",
    },
    {
      title: "last_seen_at",
      dataIndex: "last_seen_at",
      key: "last_seen_at",
    },
    {
      title: "created_at",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "updated_at",
      dataIndex: "updated_at",
      key: "updated_at",
    },
    {
      title: "",
      dataIndex: "",
      key: "x",
      render: (record: any) => (
        <Space size='middle'>
          <UpdateUserForm record={record} />
          <button
            className='text-danger'
            onClick={() => handleDeleteClick(record["id"])}
          >
            Delete
          </button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <br />
      <CreateUserForm />
      <br />
      <br />
      <br />
      <span className='flex space-x-24'>
        <UserSearchByName />
        <UserSearchByEmail />
      </span>
      <br />
      <br />
      <Table columns={columns} dataSource={arrayList} />
    </div>
  );
}
export { UserPage };
