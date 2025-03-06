import axios from '../utils/axios'

// 根据pub返回指定pub的Model列表，公开是pub = 1，私有是pub = 0
export function downloadByPath(params) {
  return axios.post(`/Pic/downloadbypath`, params)
}

export function downloadByUserId(params) {
  return axios.get(`/Pic/download`, {
    params: params, // 通过 params 添加查询参数
    responseType: "blob", // 如果返回的是文件内容，指定返回类型为 blob
  })
}