import axios from '@/utils/axios'

// 获取模型详情
export function getTagDetail(tag_name) {
    return axios.get(`/Tags/${tag_name}`);
}
