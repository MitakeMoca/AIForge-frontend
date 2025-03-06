//ModelCard.vue
<template>
	<div @click="goToModelDetail(model.modelId)" class="model-card">
		<div class="header">
			<h3>模型{{ model.modelId }}</h3>
			<h3>{{ model.modelName }}</h3>
		</div>
		<div class="description">
			<p>{{ model.modelDescription }}</p>
		</div>

		<el-tag v-for="tag in model.tags" :key="tag" :type="getTagType(tag)">
			{{ tag }}
		</el-tag>

		<div class="date">
			<p>{{ model.modelDate }}</p>
		</div>
		<div class="support">
			<span v-for="support in model.support" :key="support"
				>● {{ support }}</span
			>
		</div>
		<div class="footer">
			<span class="author">{{ model.author }}</span>
			<div class="stats">
				<div class="stats">
					<div class="stat-item">
						<span class="icon">🚀</span>
						<span
							><i class="el-icon-view"></i>
							{{ model.modelRunCount }}运行
						</span>
					</div>
					<div class="stat-item">
						<span class="icon">❤️</span>
						<span
							><i class="el-icon-star-on"></i>
							{{ model.modelLikeCount }}喜欢
						</span>
					</div>
					<div class="stat-item">
						<span class="icon">👀</span>
						<span
							><i class="el-icon-download"></i>
							{{ model.modelViewCount }}观看
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { defineProps, onMounted, ref } from 'vue';
import { ElButton, ElTag } from 'element-plus';
import { getAllTagsByModelid } from '@/service/model';
import { getModelLikeCount } from '@/service/ModelDetail';

const props = defineProps({
	model: {
		type: Object,
		default: () => ({
			modelId: '默认模型id',
			modelName: '默认模型名称',
			modelDate: '默认模型时间',
			modelDescription: '默认模型描述',
			author: '默认作者',
			modelRunCount: 0,
			modelLikeCount: 0,
			modelViewCount: 0,
			tags: [],
		}),
	},
});

const router = useRouter();
// const tags = ref([]);
// const modelLikeCount = ref(0);

onMounted(async () => {
	await fetchTagsAndLikes();
	// tags.value = await getTags(props.model.modelId);
	// getModelFavorCount(props.model.modelId);
});

//获取模型收藏数量
async function getModelFavorCount(modelId) {
	try {
		// console.log("查询该id的收藏数:" + modelId);
		const likeCountResponse = await getModelLikeCount(modelId);
		if (likeCountResponse.resultCode === 200) {
			props.model.modelLikeCount = likeCountResponse.data; // 确保数据结构正确
		} else {
			console.error(
				'Error fetching like count:',
				likeCountResponse.message,
			);
		}
	} catch (err) {
		console.error('Failed to load model 收藏数:', err);
	}
}
//获取模型标签和收藏数量，便于筛选
async function fetchTagsAndLikes() {
	try {
		props.model.tags = await getTags(props.model.modelId);
		await getModelFavorCount(props.model.modelId);
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}
async function getTags(modelId) {
	try {
		const response = await getAllTagsByModelid(modelId);
		return response.data || [];
	} catch (err) {
		console.error("Failed to get model's tags:", err);
		return [];
	}
}
function goToModelDetail(modelId) {
	router.push({ name: 'ModelDetail', params: { modelId } });
}

function getTagType(tag) {
	const tagTypes = {
		产业方案: 'info',
		OCR: 'success',
		其他: 'warning',
		默认标签: 'default',
	};
	return tagTypes[tag] || 'default';
}
</script>

<style scoped>
@import '../assets/css/ModelCard.scss';
</style>
