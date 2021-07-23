import axios from "axios";
import { BASE_URL } from "../../utils";

export function postRequest(data: any | undefined, surfix: string | undefined, header: any | undefined) {
  return axios.request({
    method: 'post',
    url: BASE_URL + surfix,
    data: data,
    headers: header
  })
}

export function getRequest(surfix: string | undefined, header: any | undefined) {
  return axios.request({
    method: 'get',
    url: BASE_URL + surfix,
    headers: header
  })
}

export function putRequest(data: any | undefined, surfix: string | undefined, header: any | undefined) {
  return axios.request({
    method: 'put',
    url: BASE_URL + surfix,
    data: data,
    headers: header
  })
}


export function deleteRequest(surfix: string | undefined, id: string | undefined, header: any | undefined) {
  return axios.request({
    method: 'delete',
    url: BASE_URL + surfix + '/' + id,
    headers: header
  })
}

export function putRequest2(data: any | undefined, surfix: string | undefined, id: string | undefined, header: any | undefined) {
  return axios.request({
    method: 'put',
    url: BASE_URL + surfix + '/' + id,
    data: data,
    headers: header
  })
}

export function getByParameterRequest(suffix: string | undefined, parameters: string | undefined, header: any | undefined) {
  return axios.request({
    method: 'get',
    url: BASE_URL + suffix + parameters,
    headers: header
  })
}