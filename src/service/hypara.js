import axios from '../utils/axios'

export function getHyparaByProjectId(params) {
    return axios.get(`/Hypara/getHyparaByProjectId/${params.ProjectId}`)
}

export function findHyparaByPath(store_path) {
    return axios.get(`/Hypara/path/${store_path}`)
}

export function addHyparaOfProject(params) {
    let project_id = params.project_id
    delete params.project_id
    console.log(`output->params`, params)
    return axios.post(`/Hypara/add/${project_id}`, params);
}

// 新增超参数信息
export function createHyparaField(params) {
    return axios.put('/Hypara/', {hyperparameters: params});
}

export function getHyparaByModelId(modelId) {
    return axios.get(`/Hypara/getHyparaPathByModelId/${modelId}`);
}

export function getHyparaByPath(store_path) {
    return axios.get(`Hypara/path/${store_path}`)
}

export function getHyparasByProjectId(project_id) {
    return axios.get(`Hypara/project/${project_id}`)
}