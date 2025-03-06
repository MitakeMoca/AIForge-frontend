import axios from '../utils/axios'

export function findPathByProjectId(params) {
    return axios.post('/Hypara/findbyprojectid', params)
}

export function findHyparaByPath(params) {
    return axios.post('/Hypara/getbypath', params)
}

export function addHyparaOfProject(params) {
    return axios.post('/Hypara/add', params);
}

export function getHyparaByProjectId(params) {
    return axios.post('/Hypara/getbyid', params);
}

export function createHyparaField(params) {
    return axios.post('/Hypara/createHyparaField', params);
}