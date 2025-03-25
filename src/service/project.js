import axios from '../utils/axios'

//我是奶龙

// 返回所有的Project列表
export function findAllProject() {
    return axios.get('/Project/findall')
}

// 根据UserId返回该用户所拥有的Project列表
export function findProjectbyUserid(params) {
    return axios.get(`/Project/findByUserId/${params.UserId}`, params)
}

//根据ProjectId删除对应project
export function deleteProject(params) {
    return axios.post('/Project/delete', params)
}

// 我给你发一个项目名称,表示我要新建一个这个项目,没有配置信息
export function createProject(params) {
    console.log("调用创建项目",params);
    return axios.put('/Project/', params);
}

export function updateProjectTypeOfProject(params) {
    return axios.put('/Project/update/projectType', params);
}
export function updateModelOfProject(params) {
    return axios.put('/Project/update/model', params);
}

export function updateDatasetOfProject(params) {
    return axios.put('/Project/update/train_dataset', params);
}

export function updateTestSetOfProject(params) {
    return axios.put('/Project/update/test_dataset', params);
}

//我不是奶龙
//根据ProjectId, 获取project的全部内容
export function getProject(params) {
    return axios.post('/Project/findbyid', params)
}

export function createDocker(params) {
    return axios.put('/Project/create', params);
}

export function runDocker(params) {
    return axios.put('/Project/run', params);
}

export function stopDocker(params) {
    return axios.put('/Project/stop', params);
}

//获取文件树
export function getFolderTree(params) {
    return axios.post('/Project/tree', params);
}

export function getFile(params) {
    return axios.post('/Project/getfile', params);
}

export function getPicture(params) {
    return axios.get('/Pic/downloadbypath', {
        params: params, // 将路径作为查询参数
        responseType: "blob", // 指定响应类型为 blob
    });
}

export function project2model(params) {
    return axios.put('/Project/transfor/model', params);
}