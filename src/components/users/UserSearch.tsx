import { AutoComplete, Input } from "antd";
import "antd/dist/antd.css";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid_v4 } from "uuid";
import { getUser } from "../../selectors";
import {
  requestUserByEmail,
  requestUserByName,
  requestUserList,
} from "../../slices/user";

const { Search } = Input;

function UserSearchByName() {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const { userList } = useSelector(getUser);
  const searchResult = (input: string) => {
    let searchOptions: any = [];
    Object.entries(userList).forEach(([key, value]: any) => {
      if (value.name.toLowerCase().includes(input.toLowerCase())) {
        searchOptions.push({ key: uuid_v4(), value: value.name });
      }
    });
    return searchOptions;
  };

  const handleSearch = (searchText: string) => {
    setOptions(searchText ? searchResult(searchText) : []);
  };

  const onSelect = (value1: string) => {
    console.log("user search by name", value1);
    dispatch(requestUserByName(value1));
  };
  const onSearch = (value: string) => {
    console.log("user search by name", value);
    if (value.length === 0) {
      dispatch(requestUserList());
    } else {
      dispatch(requestUserByName(value));
    }
  };
  return (
    <div>
      <AutoComplete
        dropdownMatchSelectWidth={252}
        style={{ width: 300 }}
        options={options}
        onSelect={onSelect}
        onSearch={handleSearch}
        notFoundContent='No result'
      >
        <Search
          placeholder='input name'
          allowClear
          enterButton='Search by Name'
          size='middle'
          onSearch={onSearch}
          style={{ width: 350 }}
        />
      </AutoComplete>
    </div>
  );
}

function UserSearchByEmail() {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const { userList } = useSelector(getUser);
  const onSearch = (value: string) => {
    console.log("user search by email", value);
    if (value.length === 0) {
      dispatch(requestUserList());
    } else {
      dispatch(requestUserByEmail(value));
    }
  };

  const searchResult = (input: string) => {
    let searchOptions: any = [];
    Object.entries(userList).forEach(([key, value]: any) => {
      if (value.email.toLowerCase().includes(input.toLowerCase())) {
        searchOptions.push({ key: uuid_v4(), value: value.email });
      }
    });
    return searchOptions;
  };

  const handleSearch = (searchText: string) => {
    setOptions(searchText ? searchResult(searchText) : []);
  };

  const onSelect = (value1: string) => {
    console.log("user search by email", value1);
    dispatch(requestUserByEmail(value1));
  };

  return (
    <div>
      <AutoComplete
        dropdownMatchSelectWidth={252}
        style={{ width: 300 }}
        options={options}
        onSelect={onSelect}
        onSearch={handleSearch}
        notFoundContent='No result'
      >
        <Search
          placeholder='input email'
          allowClear
          enterButton='Search by E-mail'
          size='middle'
          onSearch={onSearch}
          style={{ width: 350 }}
        />
      </AutoComplete>
    </div>
  );
}

export { UserSearchByName, UserSearchByEmail };
