import axios from '../utils/axios';
// 查询所有类型的标签
export async function getAllModelTags(){
  try {
    const response = await axios.get('/Model/getAllTags');
    return response;
  } catch (error) {
    console.error('获取所有标签出错：', error);
    throw error;
  }
}
// 增加模型浏览量的函数
export async function incrementModelViewCount(modelId) {
  try {
    const response = await axios.post(`/Model/${modelId}/incrementModelViewCount`);
    return response.data;
  } catch (error) {
    console.error('增加模型浏览量出错：', error);
    throw error;
  }
}
// 查询所有公开的模型简介的函数
export async function getAllModelSummaries() {
    try {
      const response = await axios.get('/Model/allPublic');
      return response;
    } catch (error) {
      console.error('获取所有公开的模型简介出错：', error);
      throw error;
    }
  }
  // 查询所有模型简介的函数按更新时间排序
  export async function getAllModelSummariesSortByTime() {
    try {
      const response = await axios.get('/Model/modelsummariesSortByTime');
      return response;
    } catch (error) {
      console.error('获取所有模型简介按更新时间排序出错：', error);
      throw error;
    }
  }
  // 查询所有模型简介的函数按点赞数量排序
  export async function getAllModelSummariesSortByLike() {
    try {
      const response = await axios.get('/Model/modelsummariesSortByLike');
      return response;
    } catch (error) {
      console.error('获取所有模型简介按点赞数量排序出错：', error);
      throw error;
    }
  }
  // 查询所有模型简介的函数按浏览量排序
  export async function getAllModelSummariesSortByView() {
    try {
      const response = await axios.get('/Model/modelsummariesSortByView');
      return response;
    } catch (error) {
      console.error('获取所有模型简介按浏览量排序出错：', error);
      throw error;
    }
  }