<template>
	<div @click="goToModelDetail(model.modelId)" class="model-card">
		<div class="header">
			<h3 class="model-title">{{ model.modelName }}</h3>
			<p class="model-id">模型ID: {{ model.modelId }}</p>
		</div>
		<div class="description">
			<p>{{ model.modelDescription }}</p>
		</div>

		<div class="tags-container">
			<el-tag
				v-for="tag in model.tags"
				:key="tag"
				:type="getTagType(tag)"
			>
				{{ tag }}
			</el-tag>
		</div>

		<!-- Model Date -->
		<div class="date">
			<p>{{ formattedDate }}</p>
			<!-- 显示格式化后的日期 -->
		</div>

		<!-- Support -->
		<div class="support">
			<span
				v-for="support in model.support"
				:key="support"
				class="support-item"
				>● {{ support }}</span
			>
		</div>

		<div class="footer">
			<span class="author">{{ model.author }}</span>
			<div class="stats">
				<div class="stat-item">
					<span class="icon">🚀</span>
					<span>{{ model.modelRunCount }}运行</span>
				</div>
				<div class="stat-item">
					<span class="icon">❤️</span>
					<span>{{ model.modelLikeCount }}喜欢</span>
				</div>
				<div class="stat-item">
					<span class="icon">👀</span>
					<span>{{ model.modelViewCount }}观看</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { defineProps, onMounted, ref, computed } from 'vue';
import { ElTag } from 'element-plus';
import { getAllTagsByModelid } from '@/service/model';
import { getModelLikeCount } from '@/service/ModelDetail';

const props = defineProps({
	model: {
		type: Object,
		default: () => ({
			modelId: '默认模型id',
			modelName: '默认模型名称',
			modelDate: '2025-03-05T18:38:05', // 假设是ISO 8601日期格式
			modelDescription: '默认模型描述',
			author: '默认作者',
			modelRunCount: 0,
			modelLikeCount: 0,
			modelViewCount: 0,
			tags: [],
			support: [],
		}),
	},
});

const router = useRouter();
// 格式化时间，之前的时间格式太奇怪了
const formattedDate = computed(() => {
	const date = new Date(props.model.modelDate);
	const options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	};
	return date.toLocaleString('zh-CN', options);
});

onMounted(async () => {
	await fetchTagsAndLikes();
});

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

async function getModelFavorCount(modelId) {
	try {
		const likeCountResponse = await getModelLikeCount(modelId);
		if (likeCountResponse.resultCode === 200) {
			props.model.modelLikeCount = likeCountResponse.data;
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
