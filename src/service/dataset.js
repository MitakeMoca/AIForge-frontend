import axios from '../utils/axios'

// 返回所有的Dataset列表
export function findAllDataset() {
  return axios.get('/Dataset/')
}

export function getAllPublicDataset() {
  return axios.get('/Dataset/public')
}

// 根据关键字模糊查询数据集
export function findDatasetByKeyword(keyword) {
  return axios.get(`Dataset/searchPublicDatasets?keyword=${keyword}`)
}

// 根据UserId返回该用户所拥有的Dataset列表
export function findDatasetbyUserid(params) {
  return axios.get(`Dataset/findByUserId/${params.UserId}`, params)
}

export function findDatasetById(id) {
  console.log(`output->dataset_id`,id)
  return axios.get(`/Dataset/${id}`);
}

//根据DatasetId删除对应dataset
export function deleteDataset(params) {
  return axios.post('/Dataset/delete', params)
}

export function downloadData(dataset_id) {
  return axios.get(`/Dataset/download/{dataset_id}`, {
    responseType: 'blob'
  });
}

export function add_dataset(params) {
  return axios.put('/Dataset/', params, {
    responseType: 'blob'
  });
}

export function get_dataset_files(dataset_id) {
  return axios.get(`/Dataset/files/${dataset_id}`);
}