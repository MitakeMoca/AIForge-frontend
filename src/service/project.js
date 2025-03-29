import axios from '../utils/axios'

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
    return axios.post(`/Project/projectType/${params.project_id}/${params.project_type}`);
}
export function updateModelOfProject(params) {
    return axios.post(`/Project/model/${params.project_id}/${params.model_id}`);
}

export function updateTrainSetOfProject(params) {
    return axios.post(`/Project/train_dataset/${params.project_id}/${params.dataset_id}`);
}

export function updateTestSetOfProject(params) {
    return axios.post(`/Project/test_dataset/${params.project_id}/${params.dataset_id}`);
}

//根据ProjectId, 获取project的全部内容
export function getProject(params) {
    return axios.get(`/Project/${params.ProjectId}`)
}

export function createDocker(project_id) {
    return axios.put(`/Project/Docker/${project_id}`);
}

export function runDocker(params) {
    return axios.post('/Project/run', params);
}

export function stopDocker(params) {
    return axios.put('/Project/stop', params);
}

//获取文件树
export function getFolderTree(project_id) {
    return axios.get(`/Project/tree/${project_id}`);
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