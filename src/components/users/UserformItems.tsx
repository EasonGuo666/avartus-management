import { Form, Input, Radio } from "antd";
import React from "react";

export default function UserformItems() {
  return (
    <div>
      <Form.Item
        name='phone'
        label='Phone'
        rules={[
          {
            min: 8,
            message: "Must be more than 8 numbers!",
          },
        ]}
      >
        <Input placeholder='phone' />
      </Form.Item>
      <Form.Item name='trust_level' label='trust_level'>
        <Radio.Group>
          <Radio.Button value='11'>user</Radio.Button>
          <Radio.Button value='5'>admin</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item name='active' label='active'>
        <Radio.Group>
          <Radio.Button value='true'>true</Radio.Button>
          <Radio.Button value='false'>false</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </div>
  );
}
