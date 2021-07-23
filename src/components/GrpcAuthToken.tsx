import { useDispatch, useSelector } from "react-redux";
import { getServiceInfo } from "../selectors";
import {
  readGrpcAuthRequest,
  updateGrpcAuthRequest,
} from "../slices/serviceInfo";
import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";

function GrpcAuthToken() {
  const dispatch = useDispatch();
  const { grpcAuth_token } = useSelector(getServiceInfo);
  const [grpcauth, setGrpcauth] = useState("");

  useEffect(() => {
    dispatch(readGrpcAuthRequest());
  }, [dispatch]);

  function handleGrpcAuthChange(event: any) {
    setGrpcauth(event.target.value);
  }

  function onclickGrpcAuthUpdate(e: any) {
    e.preventDefault();
    dispatch(updateGrpcAuthRequest(grpcauth));
    setGrpcauth("");
  }

  return (
    <div>
      <table className='grpcAuthTable'>
        <tbody>
          <tr>
            <td width='200'>Grpc Auth Token</td>
            <td width='200'>Current Value: {grpcAuth_token}</td>
            <td>
              <Form name='input'>
                <Input
                  type='text'
                  name='grpc'
                  value={grpcauth}
                  onChange={handleGrpcAuthChange}
                  placeholder='Input text'
                  style={{ display: "inline-flex", width: "calc(65% - 4px)" }}
                  allowClear
                />
                <Button
                  style={{ display: "inline-flex", marginLeft: "8px" }}
                  onClick={onclickGrpcAuthUpdate}
                >
                  Update
                </Button>
              </Form>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export { GrpcAuthToken };
