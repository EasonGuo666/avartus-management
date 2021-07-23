import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { v4 as uuid_v4 } from "uuid";
import { getCloud } from "../../selectors";
import { verifyToken } from "../../slices/auth";
import { requestDetail } from "../../slices/cloud";
import { decodeToken } from "../../utils";

function CloudServiceDetailPage() {
  const { serviceDetail, serviceStatus } = useSelector(getCloud);
  const dispatch = useDispatch();
  let token: string | null = localStorage.getItem("token");
  let { uuid } = useParams<any>();
  let detailList: Array<any> = [];
  let statusList: Array<any> = [];

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
  objectToArray(detailList, serviceDetail);
  objectToArray(statusList, serviceStatus);

  useEffect(() => {
    const userInfo = decodeToken();
    dispatch(verifyToken({ userInfo, token }));
    dispatch(requestDetail(uuid));
  }, [uuid, dispatch, token]);

  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th>Service Details</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {detailList.map((item: any) => {
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
      <table className='table'>
        <thead>
          <tr>
            <th>Service Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {statusList.map((item: any) => {
            return (
              <tr key={uuid_v4()}>
                <td>{item.key} </td>
                <td>{item.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { CloudServiceDetailPage };
