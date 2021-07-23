/* eslint-disable jsx-a11y/anchor-is-valid */
import { Table } from "antd";
import "antd/dist/antd.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCloud } from "../../selectors";
import { verifyToken } from "../../slices/auth";
import {
  deleteCloudService,
  requestOfflineService,
  requestOnlineService,
} from "../../slices/cloud";
import { decodeToken } from "../../utils";
import { GrpcAuthToken } from "../GrpcAuthToken";
import { HeartbeatInterval } from "../HeartbeatInterval";
import { HiddenByTrustLevel } from "../HiddenByTrustLevel";
import { TimesyncInterval } from "../TimesyncInterval";
import { CloudLifeTime } from "./CloudLifeTime";

function CloudPage() {
  const cloud = useSelector(getCloud);
  const dispatch = useDispatch();
  let token: string | null = localStorage.getItem("token");
  const MINUTE_MS = 60000;
  const data: any = [];

  useEffect(() => {
    // verify if token is valid and expired, if it's expired, redirect to login page
    const userInfo = decodeToken();
    dispatch(verifyToken({ userInfo, token }));
    // every 60s refetch the services
    dispatch(requestOnlineService());
    dispatch(requestOfflineService()); //尝试一下加一个flag

    const interval = setInterval(() => {
      console.log("logs every minute:");
      dispatch(requestOnlineService());
      dispatch(requestOfflineService());
    }, MINUTE_MS);
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, token]); // useEffect要不要监听dispatch

  cloud.online.managers.forEach((manager: any) => {
    let child: Array<any> = [];
    cloud.online.services.forEach((service: any) => {
      if (cloud.managerMap[manager.uuid]?.includes(service.uuid)) {
        child.push({
          key: service.uuid,
          service: service.value,
          uuid: (
            <Link
              className='text-primary'
              to={{ pathname: `/service/${service.uuid}` }}
            >
              {service.uuid}
            </Link>
          ),
          onoff: <div className='text-success'>on</div>,
          config: (
            <Link
              className='text-primary'
              to={{ pathname: `/config/${service.uuid}` }}
            >
              config
            </Link>
          ),
        });
      }
    });
    data.push({
      key: manager.uuid,
      service: <div className='font-weight-bold'>{manager.value}</div>,
      uuid: (
        <Link
          className='text-primary'
          to={{ pathname: `/manager/${manager.uuid}` }}
        >
          {manager.uuid}
        </Link>
      ),
      onoff: <div className='text-success'>on</div>,
      children: child.length === 0 ? null : child,
      config: (
        <Link
          className='text-primary'
          to={{ pathname: `/config/${manager.uuid}` }}
        >
          config
        </Link>
      ),
    });
  });

  cloud.offline.managers.forEach((manager: any) => {
    let child: Array<any> = [];
    cloud.offline.services.forEach((service: any) => {
      if (cloud.managerMap[manager.uuid]?.includes(service.uuid)) {
        child.push({
          key: service.uuid,
          service: service.value,
          uuid: (
            <Link
              className='text-primary'
              to={{ pathname: `/service/${service.uuid}` }}
            >
              {service.uuid}
            </Link>
          ),
          onoff: <div className='text-danger'>off</div>,
          config: (
            <Link
              className='text-primary'
              to={{ pathname: `/config/${service.uuid}` }}
            >
              config
            </Link>
          ),
        });
      }
    });
    data.push({
      key: manager.uuid,
      service: <div className='font-weight-bold'>{manager.value}</div>,
      uuid: (
        <Link
          className='text-primary'
          to={{ pathname: `/manager/${manager.uuid}` }}
        >
          {manager.uuid}
        </Link>
      ),
      onoff: <div className='text-danger'>off</div>,
      children: child.length === 0 ? null : child,
      config: (
        <Link
          className='text-primary'
          to={{ pathname: `/config/${manager.uuid}` }}
        >
          config
        </Link>
      ),
    });
  });

  function handleDeleteClick(uuid: any) {
    console.log("delete: ", uuid);
    dispatch(deleteCloudService(uuid));
  }

  const columns = [
    {
      title: "",
      dataIndex: "onoff",
      key: "onoff",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "uuid",
      dataIndex: "uuid",
      key: "uuid",
    },
    {
      title: "",
      dataIndex: "",
      key: "x",
      render: (record: any) => (
        <button
          className='text-danger'
          onClick={() => handleDeleteClick(record["uuid"].props.children)}
          hidden={!HiddenByTrustLevel()}
        >
          Delete
        </button>
      ),
    },
    {
      title: "config",
      dataIndex: "config",
      key: "config",
      //   render:(record:any)=>(
      //     <Button
      //  href='/config/${service.uuid}'
      //     >
      //       Config
      //     </Button>
      //   ),
    },
  ];
  return (
    <>
      <CloudLifeTime />
      <HeartbeatInterval></HeartbeatInterval>
      <TimesyncInterval></TimesyncInterval>
      <GrpcAuthToken></GrpcAuthToken>
      <br />
      <Table columns={columns} dataSource={data} />
    </>
  );
}

export { CloudPage };
