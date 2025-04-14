import axios from '../utils/axios'

export function downloadByPath(file_path) {
  return axios.get(`Pic/path/${encodeURIComponent(file_path)}`, {
    responseType: "blob", 
  })
}

export function downloadByUserId(params) {
  return axios.get(`/Pic/download`, {
    params: params, // 通过 params 添加查询参数
    responseType: "blob", // 如果返回的是文件内容，指定返回类型为 blob
  })
}