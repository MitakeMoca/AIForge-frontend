<template>
	<div @click="goToModelDetail(model.modelId)" class="model-card">
		<!-- Header -->
		<div class="header">
			<h3 class="model-title">{{ model.modelName }}</h3>
			<p class="model-id">模型ID: {{ model.modelId }}</p>
		</div>

		<!-- 固定高度的描述区域 -->
		<div class="description">
			<p>{{ truncatedDescription }}</p>
		</div>

		<!-- Tags -->
		<div class="tags-container">
			<el-tag
				v-for="tag in model.tags"
				:key="tag"
				:type="getTagType(tag)"
			>
				{{ tag }}
			</el-tag>
		</div>

		<!-- 时间 & 支持信息 -->
		<div class="meta-info">
			<p class="date">{{ formattedDate }}</p>
			<div class="support">
				<span
					v-for="support in model.support"
					:key="support"
					class="support-item"
				>
					● {{ support }}
				</span>
			</div>
		</div>

		<!-- Footer 统计数据 -->
		<div class="footer">
			<span class="author">{{ model.author }}</span>
			<div class="stats">
				<div class="stat-item">
					<span class="icon">🚀</span>
					<span>{{ model.modelRunCount }} 运行</span>
				</div>
				<div class="stat-item">
					<span class="icon">❤️</span>
					<span>{{ model.modelLikeCount }} 喜欢</span>
				</div>
				<div class="stat-item">
					<span class="icon">👀</span>
					<span>{{ model.modelViewCount }} 观看</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { defineProps, computed } from 'vue';
import { ElTag } from 'element-plus';

const props = defineProps({
	model: {
		type: Object,
		default: () => ({
			modelId: '默认模型id',
			modelName: '默认模型名称',
			modelDate: '2025-03-05T18:38:05',
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

// 格式化时间
const formattedDate = computed(() => {
	const date = new Date(props.model.modelDate);
	return date.toLocaleString('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
});

// 省略长文本，确保描述区域高度一致
const truncatedDescription = computed(() => {
	return props.model.modelDescription.length > 100
		? props.model.modelDescription.slice(0, 100) + '...'
		: props.model.modelDescription;
});

// 跳转模型详情页
function goToModelDetail(modelId) {
	router.push({ name: 'ModelDetail', params: { modelId } });
}

// 设置 Tag 样式
function getTagType(tag) {
	const tagTypes = {
		产业方案: 'info',
		OCR: 'success',
		其他: 'warning',
	};
	return tagTypes[tag] || 'default';
}
</script>

<style scoped>
.model-card {
	background-color: #ffffff;
	border-radius: 12px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	padding: 20px;
	margin-bottom: 20px;
	text-align: left;
	transition: background 0.3s ease, box-shadow 0.3s ease;
	cursor: pointer;
	min-height: 320px;
	max-height: 320px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.model-card:hover {
	background-color: #f4f9ff;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.model-title {
	font-size: 20px;
	font-weight: 600;
	color: #333;
}

.model-id {
	font-size: 13px;
	color: #888;
}

.description {
	color: #555;
	font-size: 16px;
	line-height: 2;
	height: 6em;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	word-break: break-word;
}

.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 10px;
}

.meta-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.date {
	font-size: 14px;
	color: #666;
}

.support {
	font-size: 13px;
	color: #4caf50;
}

.support-item {
	margin-right: 10px;
}

.footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.author {
	font-size: 14px;
	font-weight: 500;
	color: #333;
}

.stats {
	display: flex;
	gap: 15px;
	font-size: 14px;
	color: #666;
}

.stat-item {
	display: flex;
	align-items: center;
}

.icon {
	margin-right: 5px;
	font-size: 16px;
	color: #555;
}

.el-tag {
	font-size: 13px;
}
</style>
