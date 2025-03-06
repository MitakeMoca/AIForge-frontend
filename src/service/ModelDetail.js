import axios from '../utils/axios';

//查询是否收藏模型
export const getIsFavor = async(modelId,userId) =>{
    try{
        const response = await axios.get(`/favors/isFavor/${modelId}/${userId}`);
        return response;
    } catch (error) {
        console.error("Error fetching model details:", error);
        throw error;
    }
};
//添加收藏模型
export const addFavor = async (modelId,userId) =>{
    try{
        const response = await axios.post(`/favors/addFavor/${modelId}/${userId}`);
        return response;
    } catch (error) {
        console.error("Error fetching model details:", error);
        throw error;
    }
};
//取消收藏模型
export const cancelFavor = async(modelId,userId)=>{
    try{
        const response = await axios.delete(`/favors/deleteFavor/${modelId}/${userId}`);
        return response;
    } catch (error) {
        console.error("Error fetching model details:", error);
        throw error;
    }
};
// 获取模型详细信息
export const getModelDetail = async (modelId) => {
    try {
        const response = await axios.get(`/Model/findbymodelid/${modelId}`);
        return response;
    } catch (error) {
        console.error("Error fetching model details:", error);
        throw error;
    }
};
//增加模型浏览量
export const incrementModelViewCount = async(modelId)=>{
    try{
        const response = await axios.post(`/Model/model/${modelId}/incrementModelViewCount?modelId=${modelId}`);
        return response;
    }catch(error){
        console.error("观看数增加失败:", error);
        throw error;
    }
};
//获取模型收藏人数
export const getModelLikeCount = async (modelId) => {
    try {
        const response = await axios.get(`/favors/favorCountByModelId/${modelId}`);
        // console.log("模型"+modelId+"的收藏数为"+response.data);
        return response; // 确保返回数据部分
    } catch (error) {
        console.error("获取模型收藏数量失败:", error);
        throw error;
    }
};
//获取模型详情
// export async function getModelDetail(modelId) {
//     try {
//       const response = await axios.get(`/findbymodelid/${modelId}`);
//       return response;
//     } catch (error) {
//       console.error('获取模型详情:', error);
//       throw error;
//     }
//   }