import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 as uuid_v4 } from "uuid";
import { getBadger } from "../../selectors";
import {
  addBadger,
  deleteBadger,
  requestBadger,
  requestBadgerByKey,
} from "../../slices/badger";

function BadgerManager() {
  const { badgerInfo } = useSelector(getBadger);
  let badgerList: Array<any> = [];

  function objectToArray(arraylist: Array<any>, dataObject: any) {
    Object.entries(dataObject).forEach(([key, value]: any) => {
      //let temp = JSON.parse(value.replaceAll('/',''));
      if (typeof value === "object") {
        arraylist.push({ key, value: " " });
        Object.entries(value).forEach(([key1, value1]: any) => {
          arraylist.push({ value: value1 });
        });
      } else {
        if (typeof value === "string") {
          arraylist.push({ key, value });
        }
      }
    });
  }
  objectToArray(badgerList, badgerInfo);

  const dispatch = useDispatch();
  const [readKey, setReadKey] = useState("");
  const [inputs, setInputs] = useState({
    key: "",
    value: "",
    ttl: "",
  });
  const [deleteKey, setDeleteKey] = useState("");
  let { uuid } = useParams<any>();

  useEffect(() => {
    dispatch(requestBadger(uuid));
  }, [uuid, dispatch]);

  const handleChange1 = (e: any) => {
    setReadKey(e.target.value);
  };

  const handleChange2 = (e: any) => {
    const { name, value } = e.target;
    setInputs((data) => ({ ...data, [name.toString()]: value }));
  };

  const handleChange3 = (e: any) => {
    setDeleteKey(e.target.value);
  };

  const handleSearch = (input: string) => {
    // if the input is empty, read all keys
    if (input.length === 0) {
      dispatch(requestBadger(uuid));
    } else {
      dispatch(requestBadgerByKey(input));
    }
  };

  function handleAdd() {
    dispatch(addBadger(inputs));
  }

  const handleDelete = (deleteInput: string) => {
    // if the input is empty,
    dispatch(deleteBadger(deleteInput));
  };

  return (
    <div>
      <div>Enter key or prefix: </div>
      <Input type='text' onChange={handleChange1} style={{ width: 200 }} />
      <Button onClick={() => handleSearch(readKey)}>Search</Button>
      <br />
      <br />
      <div>Add key-value pair: </div>
      <Input
        type='text'
        name='key'
        onChange={handleChange2}
        style={{ width: 200 }}
        value={badgerInfo.addKey}
        placeholder='key'
        allowClear
      />
      <Input
        type='text'
        name='value'
        onChange={handleChange2}
        style={{ width: 200 }}
        placeholder='value'
        allowClear
      />
      <Input
        type='number'
        name='ttl'
        onChange={handleChange2}
        style={{ width: 200 }}
        placeholder='TTL (optional)'
        allowClear
      />
      <Button onClick={handleAdd}>Add</Button>
      <br />
      <br />
      <div>Delete by Key: </div>
      <Input type='text' onChange={handleChange3} style={{ width: 200 }} allowClear/>
      <Button onClick={() => handleDelete(deleteKey)}>Delete</Button>
      <br />
      <br />
      <table className='table'>
        <thead>
          <tr>
            <th>Results:</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {badgerList.map((item: any) => {
            return (
              <tr key={uuid_v4()}>
                <td>{item.key} </td>
                <td>{item.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <hr />
      <br />
      <br />
    </div>
  );
}

export { BadgerManager };
