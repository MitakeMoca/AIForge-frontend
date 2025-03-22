import axios from '../utils/axios'

// 根据pub返回指定pub的Model列表，公开是pub = 1，私有是pub = 0
export function findAllModel(pub) {
  return axios.post('/Model/findAll', pub)
}

export function findModelById(id) {
    return axios.get(`/Model/findbymodelid/${id}`)
}
// 根据关键字模糊查询模型（同时对框架、名称、描述搜索）
export function findModelByKeyword(params) {
    return axios.post('/Model/unionSearch', params)
}
export function findModelByUserId(userId) {
    return axios.get(`/Model/getModelsByUserId/${userId}`)
}
// 返回公开的Model列表
export function findAllModelPublic() {
  return axios.get('/Model/allPublic', {})
}

// 返回待审核的Model列表
export function findAllModelWaiting() {
  return axios.get('/Model/allWaiting', {})
}

// 返回私有的Model列表
export function findAllModelPrivate() {
  return axios.get('/Model/allPrivate', {})
}

// 根据UserId和pub返回指定pub的该用户所拥有的Model列表
export function findModelbyUserid(params) {
  return axios.post('/Model/findModelbyUserid', params)
}

// 根据ModelId和pub将指定module状态变公开或私密
export function updateModel(params) {
  return axios.post('/Model/updateModel', params)
}

export function setPublic(params) {
  return axios.put('/Model/setPublic', params)
}

export function setPrivate(params) {
  return axios.put('/Model/setPrivate', params)
}

export function setWaiting(params) {
  return axios.put('/Model/setWaiting', params)
}

// 获取基础模型列表
export function getAllBasicModels(params) {
  return axios.post('/backend/Model/getAllBasicModels', params)
}

export async function getAllTagsByModelid(modelId)
{
  try{
    const response = await axios.get(`/Model/findTagsByModelId/${modelId}`);
    return response;

  }catch(error)
  {
    console.error("Error fetching model details:", error);
        throw error;
  }
}

//根据模型ID获取模型详情
export function getModelById(modelId) {
  return axios.get(`/Model/findbymodelid/${modelId}`);
}


// 获取收藏模型列表
export async function getCollectedMdels(userId) {
  try {
        const response = await axios.get(`/favors/getFavoredModelsByUserId/${userId}`);
        return response;
    } catch (error) {
        console.error("Error fetching model details:", error);
        throw error;
    }
}
//获取我的模型
export async function getMyModels(userId) {
  try {
        const response = await axios.get(`/Model/getModelsByUserId/${userId}`);
        return response;
    } catch (error) {
        console.error("Error fetching model details:", error);
        throw error;
    }
}

export function getModelsByProjectType(projectType) {
    return axios.get(`/Model/getModelIdsByTagName/${projectType}`);
}

// 获取指定标签筛选后的基础模型列表，比如在多选框选中”语言模型“、”多模态“等等
export function getSelectedBasicModels(params)
{
    return axios.post('/backend/Model/getSelectedBasicModels', params)
}

// 获取指定标签筛选后的收藏模型列表，
export function getSelectedCollectedModels(params)
{
    return axios.post('/backend/Model/getSelectedCollectedModels', params)
}

// 根据指定的id从个人收藏中删除某个模型
export async function deleteFavor(modelId, userId) {

  try
  {
    return axios.delete(`/favors/deleteFavor/${modelId}/${userId}`)
  }catch (error) {
        console.error("Error fetching model details:", error);
        throw error;
    }
  
}

// 根据指定的id从个人收藏中删除某个模型
export async function deleteModel(modelId) {

  try
  {
    return axios.delete(`/Model/delete/${modelId}`)
  }catch (error) {
        console.error("Error fetching model details:", error);
        throw error;
    }
  
}

// 修改模型的状态（例如暂停、恢复）
export function updatePipelineStatus(id, status) {
  return axios.post('/backend/Model/updateStatus', { id, status })
}

// 获取筛选条件的选项
export function getModelTypes() {
  return axios.get('/backend/Model/getModelTypes')
}

// 添加模型到收藏
export function addToFavorites(id) {
  return axios.post('/backend/Model/addToFavorites', { id })
}

export function getParamsByModelId(modelId) {
    return axios.get(`/Model/getHyparaPathByModelId/${modelId}`);
}
//添加模型
export function addModel(params) {
  console.log(params)
  return axios.put('/Model/', params, {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
  });
}

// 获取模型详情
export function getModelDetails(params) {
  return axios.post('/Model/getTagDescrip', params);
}



