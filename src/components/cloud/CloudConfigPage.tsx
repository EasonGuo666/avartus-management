import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 as uuid_v4 } from "uuid";
import { getCloud } from "../../selectors";
import { verifyToken } from "../../slices/auth";
import { requestConfig } from "../../slices/cloud";
import { decodeToken } from "../../utils";
import { CloudConfigPopForm } from "./CloudConfigPopForm";

function CloudConfigPage() {
  const { serviceConfig } = useSelector(getCloud);
  const dispatch = useDispatch();
  let token: string | null = localStorage.getItem("token");
  let { uuid } = useParams<any>();

  useEffect(() => {
    const userInfo = decodeToken();
    dispatch(verifyToken({ userInfo, token }));
    dispatch(requestConfig(uuid));
  }, [uuid, dispatch, token]);

  let configList: Array<any> = [];
  function objectToArray(arraylist: Array<any>, dataObject: any) {
    Object.entries(dataObject).forEach(([key, value]: any) => {
      if (typeof value === "object") {
        arraylist.push({ key, value: " " });
        Object.entries(value).forEach(([key, value]: any) => {
          arraylist.push({ key: " ", value: `${key}:   ${value}` });
        });
      } else {
        arraylist.push({ key, value });
      }
    });
  }
  if (serviceConfig === null || undefined) {
    return null;
  } else {
    objectToArray(configList, serviceConfig);
  }
  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th>Service Config</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {configList.map((item: any) => {
            return (
              <tr key={uuid_v4()}>
                <td>{item.key} </td>
                <td>{item.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <CloudConfigPopForm />
    </div>
  );
}

export { CloudConfigPage };
