import axios from '@/utils/axios'

// 获取模型详情
export function getTagDetail(params) {
    return axios.get(`/Tags/${params.tagName}`);
}
