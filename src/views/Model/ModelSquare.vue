<template>
	<header class="upperbar">
		<upperbar />
	</header>
	<el-container
		class="main"
		style="height: 80vh; min-height: 100%; padding-top: 60px"
	>
		<aside class="sidebar">
			<sidebar />
		</aside>
		<el-aside
			width="250px"
			style="background-color: #f5f7fa; padding: 20px"
		>
			<h2>模型库</h2>
			<div style="height: 20px"></div>

			<el-row :gutter="10" v-if="false">
				<el-col
					:span="12"
					v-for="tag in tags"
					:key="tag"
					style="margin-bottom: 10px"
				>
					<el-button
						:type="
							selectedTags.includes(tag) ? 'primary' : 'default'
						"
						@click="filterByTag(tag)"
						style="width: 100%"
					>
						{{ tag }}
					</el-button>
				</el-col>
			</el-row>

			<div class="modelTagClass" style="margin: 10px">热门任务</div>
			<el-row :gutter="10">
				<el-col
					v-for="(tag, index) in tags.slice(0, 3)"
					:key="tag"
					:span="12"
					style="margin-bottom: 10px"
				>
					<el-button
						:type="
							selectedTags.includes(tag) ? 'primary' : 'default'
						"
						@click="filterByTag(tag)"
						style="width: 100%"
					>
						{{ tag }}
					</el-button>
				</el-col>
			</el-row>

			<div class="modelTagClass" style="margin: 10px">模型类型</div>
			<el-row :gutter="10">
				<el-col
					v-for="(tag, index) in tags.slice(3, 6)"
					:key="tag"
					:span="12"
					style="margin-bottom: 10px"
				>
					<el-button
						:type="
							selectedTags.includes(tag) ? 'primary' : 'default'
						"
						@click="filterByTag(tag)"
						style="width: 100%"
					>
						{{ tag }}
					</el-button>
				</el-col>
			</el-row>
			<div class="modelTagClass" style="margin: 10px">计算机视觉</div>
			<el-row :gutter="10">
				<el-col
					v-for="(tag, index) in tags.slice(6, 12)"
					:key="tag"
					:span="12"
					style="margin-bottom: 10px"
				>
					<el-button
						:type="
							selectedTags.includes(tag) ? 'primary' : 'default'
						"
						@click="filterByTag(tag)"
						style="width: 100%"
					>
						{{ tag }}
					</el-button>
				</el-col>
			</el-row>

			<div class="modelTagClass" style="margin: 10px">自然语言处理</div>
			<el-row :gutter="10">
				<el-col
					v-for="(tag, index) in tags.slice(12, 20)"
					:key="tag"
					:span="12"
					style="margin-bottom: 10px"
				>
					<el-button
						:type="
							selectedTags.includes(tag) ? 'primary' : 'default'
						"
						@click="filterByTag(tag)"
						style="width: 100%"
					>
						{{ tag }}
					</el-button>
				</el-col>
			</el-row>
			<div class="modelTagClass" style="margin: 10px">语音</div>
			<el-row :gutter="10">
				<el-col
					v-for="(tag, index) in tags.slice(20, 26)"
					:key="tag"
					:span="12"
					style="margin-bottom: 10px"
				>
					<el-button
						:type="
							selectedTags.includes(tag) ? 'primary' : 'default'
						"
						@click="filterByTag(tag)"
						style="width: 100%"
					>
						{{ tag }}
					</el-button>
				</el-col>
			</el-row>
			<div class="modelTagClass" style="margin: 10px">多模态</div>
			<el-row :gutter="10">
				<el-col
					v-for="(tag, index) in tags.slice(26, 30)"
					:key="tag"
					:span="12"
					style="margin-bottom: 10px"
				>
					<el-button
						:type="
							selectedTags.includes(tag) ? 'primary' : 'default'
						"
						@click="filterByTag(tag)"
						style="width: 100%"
					>
						{{ tag }}
					</el-button>
				</el-col>
			</el-row>
			<div class="modelTagClass" style="margin: 10px">科学计算</div>
			<el-row :gutter="10">
				<el-col
					v-for="(tag, index) in tags.slice(30, 31)"
					:key="tag"
					style="margin-bottom: 10px"
				>
					<el-button
						:type="
							selectedTags.includes(tag) ? 'primary' : 'default'
						"
						@click="filterByTag(tag)"
						style="width: 100%"
					>
						{{ tag }}
					</el-button>
				</el-col>
			</el-row>
			<div class="modelTagClass" style="margin: 10px">时序技术</div>
			<el-row :gutter="10">
				<el-col
					v-for="(tag, index) in tags.slice(31, 32)"
					:key="tag"
					style="margin-bottom: 10px"
				>
					<el-button
						:type="
							selectedTags.includes(tag) ? 'primary' : 'default'
						"
						@click="filterByTag(tag)"
						style="width: 100%"
					>
						{{ tag }}
					</el-button>
				</el-col>
			</el-row>
		</el-aside>

		<el-container>
			<el-header
				style="
					background-color: #f5f7fa;
					padding: 10px;
					display: flex;
					align-items: center;
					justify-content: space-between;
				"
			>
				<div style="display: flex; align-items: center">
					<!-- <el-input
            placeholder="请使用顶部搜索框"
            style="width: 300px; margin-left: 30px; margin-right: 20px"
          ></el-input> -->
					<div style="text-align: center">
						<el-button
							@click="clearSelectedTags"
							style="width: 100px; margin: 30px"
							type="danger"
						>
							清空选中标签
						</el-button>
					</div>
					<el-select
						v-model="selected"
						placeholder="选择排序方式"
						style="width: 300px; margin-right: 20px"
						@change="handleSelectionChange"
					>
						<el-option label="按综合排序" value="综合"></el-option>
						<el-option
							label="按更新时间"
							value="更新时间"
						></el-option>
						<el-option
							label="按点赞数量"
							value="点赞数量"
						></el-option>
						<el-option label="按浏览量" value="浏览量"></el-option>
					</el-select>
				</div>
				<el-button type="primary" @click="handleShareMyModel"
					>分享我的模型</el-button
				>
			</el-header>

			<el-main style="padding: 20px">
				<div class="model-square">
					<div v-if="filteredModels.length === 0">
						<p>暂无符合条件的模型，请重新选择标签</p>
					</div>
					<div v-else>
						<div class="grid">
							<div
								v-for="model in filteredModels"
								:key="model.modelId"
								class="grid-item"
							>
								<ModelCard :model="model" />
							</div>
						</div>
					</div>
				</div>
			</el-main>
		</el-container>
	</el-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import ModelCard from '@/components/model/ModelCard.vue';
import sidebar from '../../components/Sidebar.vue';
import upperbar from '../../components/Upperbar.vue';
import { getAllModelSummaries } from '../../service/ModelSquare';
import { getAllTagsName } from '@/service/model';
import { getLocal, setLocal } from '@/utils/local';

// 定义响应式变量
const userId = ref('larry');
const router = useRouter();
const selectedButton = ref('');
const selected = ref('综合');
const models = ref([]);
const error = ref(null);
const tags = ref([]);
const selectedTags = ref([]);

// 根据选中标签筛选模型
const filteredModels = computed(() => {
	console.log('根据标签筛选模型' + selectedTags.value);
	if (selectedTags.value.length === 0) {
		return models.value;
	}
	return models.value.filter((model) => {
		return (
			model.tags &&
			Array.isArray(model.tags) &&
			selectedTags.value.every((tag) => model.tags.includes(tag))
		);
	});
});

// 筛选标签的逻辑
function filterByTag(tag) {
	const index = selectedTags.value.indexOf(tag);
	if (index > -1) {
		selectedTags.value.splice(index, 1); // 如果已选中，则移除
		console.log('取消选中' + tag);
	} else {
		selectedTags.value.push(tag); // 如果未选中，则添加
		console.log('增加选中' + tag);
	}
}

// 清空所有筛选标签
function clearSelectedTags() {
	selectedTags.value = [];
	console.log('清空所有筛选标签');
}

// 分享我的模型 -> 跳转
function handleShareMyModel() {
	router.push({ name: 'model', query: { activeTab: 'myModels' } });
}

// 更换排序方式
function handleSelectionChange() {
	sortModels(selected.value);
}

// 模型展示的四种排序
function sortModels(order) {
	if (!models.value || models.value.length === 0) return;

	models.value.sort((a, b) => {
		if (order === '综合') {
			return a.modelId - b.modelId;
		} else if (order === '更新时间') {
			return new Date(b.modelDate) - new Date(a.modelDate);
		} else if (order === '点赞数量') {
			return b.modelLikeCount - a.modelLikeCount;
		} else if (order === '浏览量') {
			return b.modelViewCount - a.modelViewCount;
		}
		return 0; // 默认不排序
	});
}

// 获取所有模型类型的标签
async function fetchAllModelTags() {
	try {
		const response = await getAllTagsName();
		if (response && response.resultCode === 200) {
			tags.value = response.data;
		} else {
			error.value = response?.message || 'Unexpected error';
		}
	} catch (err) {
		error.value = 'Failed to load model summaries SortByView';
	}
}

// 获取所有模型
async function fetchModels() {
	try {
		const response = await getAllModelSummaries();
		if (response && response.resultCode === 200) {
			models.value = response.data;
		} else {
			error.value = response?.message || 'Unexpected error';
		}
	} catch (err) {
		error.value = 'Failed to load model summaries';
	}
}

// 检查用户是否已登录，未登录则跳转到home
function checkUserLogin() {
	userId.value = getLocal('userId');

	if (!userId.value) {
		console.log('用户未登录'); // 替换为实际的登录页面路径
		window.location.href = '/home';
	}
}

// 打开页面时获取模型和标签
onMounted(() => {
	checkUserLogin();
	fetchModels();
	fetchAllModelTags();
});
</script>

<style scoped>
@import '../../assets/css/ModelSquare.scss';
@import '../../assets/css/components/Bar.scss';
</style>
