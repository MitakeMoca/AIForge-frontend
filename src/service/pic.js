import axios from '@/utils/axios'
import { baseURL } from '@/utils/axios'

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

export async function addPicture(params) {
  const ret = await axios.post('/Pic/', params, {
    headers: {
    'Content-Type': 'multipart/form-data',
    }}
  )
  console.log(`output->ret`,ret)
  return `${baseURL}${ret.data.file_path}`
}