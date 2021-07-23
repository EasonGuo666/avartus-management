import React, { useState } from "react";
import { Input, AutoComplete } from "antd";
import { SelectProps } from "antd/es/select";
import { Link } from "react-router-dom";
import { LOCATION, PROFILE } from "../utils";

const searchResult = (query: string, data: any, nodeType: string) => {
  let matchItem = [];
  switch (nodeType) {
    case LOCATION:
      for (var eachLocation of data) {
        if (
          eachLocation.label1.toLowerCase().includes(query.toLowerCase()) ||
          eachLocation.label2.toLowerCase().includes(query.toLowerCase())
        ) {
          matchItem.push({
            category: eachLocation.label2,
            key: eachLocation.key,
          });
        }
      }
      break;
    case PROFILE:
      for (var eachProfile of data) {
        if (eachProfile.label.toLowerCase().includes(query.toLowerCase())) {
          matchItem.push({
            category: eachProfile.label,
            key: eachProfile.key,
          });
        }
      }
      break;
  }

  let searchOptions: any = [];
  Object.values(matchItem).forEach((item: any) => {
    searchOptions.push({
      value: item.category,
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>
            <Link to={{ pathname: `/${nodeType}/${item.key}` }}>
              {item.category}
            </Link>
          </span>
        </div>
      ),
    });
  });
  return searchOptions;
};

export const LocationComplete: React.FC = (data: any) => {
  let completeItem: any = []; // auto generate the form's row by record(table's data)
  Object.values(data.children).forEach((value: any) => {
    completeItem.push({
      key: value["Node.uuid"],
      label1: value["Location.building"],
      label2: value["Location.location"],
    });
  });

  const [options, setOptions] = useState<SelectProps<object>["options"]>([]);

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value, completeItem, LOCATION) : []);
  };

  const onSelect = (value: string) => {
    console.log("onSelect", value);
  };

  return (
    <AutoComplete
      dropdownMatchSelectWidth={252}
      style={{ width: 300 }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
      notFoundContent='No result'
    >
      <Input.Search size='large' placeholder='search here' enterButton />
    </AutoComplete>
  );
};

export const ProfileComplete: React.FC = (data: any) => {
  let completeItem: any = []; // auto generate the form's row by record(table's data)
  if (data.children) {
     Object.values(data.children).forEach((value: any) => {
       completeItem.push({
         key: value["Node.uuid"],
         label: value["Profile.label"],
       });
     });
  }

  const [options, setOptions] = useState<SelectProps<object>["options"]>([]);

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value, completeItem, PROFILE) : []);
  };

  const onSelect = (value: string) => {
    console.log("onSelect", value);
  };

  return (
    <AutoComplete
      dropdownMatchSelectWidth={252}
      style={{ width: 300 }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
      notFoundContent='No result'
    >
      <Input.Search size='large' placeholder='search here' enterButton />
    </AutoComplete>
  );
};
