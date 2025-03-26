import axios from '../utils/axios'

export function getHyparaByProjectId(params) {
    return axios.get(`/Hypara/getHyparaByProjectId/${params.ProjectId}`)
}

export function findHyparaByPath(params) {
    return axios.post('/Hypara/getbypath', params)
}

export function addHyparaOfProject(params) {
    return axios.post('/Hypara/add', params);
}

// 新增超参数信息
export function createHyparaField(params) {
    return axios.put('/Hypara/', {hyperparameters: params});
}