<template>
	<header class="upperbar">
		<upperbar />
	</header>
	<aside class="sidebar" style="padding-top: 60px">
		<sidebar />
	</aside>
	<div class="dataset-container">
		<!-- Navigation Tabs -->
		<div class="nav-tabs">
			<div class="nav-tabs-inner">
				<div class="nav-links">
					<a
						href="#"
						:class="{
							'nav-link': true,
							active: selectedTab === '公开数据集',
						}"
						@click="thePublic()"
						>公开数据集</a
					>
					<a
						href="#"
						:class="{
							'nav-link': true,
							active: selectedTab === '我的数据集',
						}"
						@click="mine()"
						>我的数据集</a
					>
				</div>
				<div>
					<button class="preprocess-button" @click="startProcess()">
						数据集预处理
					</button>
					<button class="create-button" @click="startCreate()">
						上传数据集
					</button>
				</div>
			</div>
		</div>

		<!-- Filters and Search -->
		<div class="filters">
			<select
				v-model="category"
				class="filter-select"
				@change="toggleTagsDropdown"
			>
				<option value="全部">全部</option>
				<option v-for="tag in tags" :key="tag" :value="tag">
					{{ tag }}
				</option>
			</select>
			<div class="search-container">
				<input
					type="text"
					placeholder="搜索数据集关键字、标签"
					class="search-input"
					v-model="query"
				/>
				<SearchIcon class="search-icon" @click="showResults()" />
			</div>
		</div>
		<el-scrollbar max-height="600px" class="scroll">
			<!-- Category Tags -->
			<div class="category-tags">
				<button
					:class="{
						'category-tag': true,
						active: category === '全部',
					}"
					@click="all()"
				>
					全部
				</button>
				<button
					:class="{
						'category-tag': true,
						active: category === '计算机视觉',
					}"
					@click="computerVision()"
				>
					计算机视觉
				</button>
				<button
					:class="{
						'category-tag': true,
						active: category === '自然语言处理',
					}"
					@click="naturalLanguageProcessing()"
				>
					自然语言处理
				</button>
				<button
					:class="{
						'category-tag': true,
						active: category === '推荐系统',
					}"
					@click="recommendationSystem()"
				>
					推荐系统
				</button>
				<button
					:class="{
						'category-tag': true,
						active: category === '机器学习',
					}"
					@click="machineLearning()"
				>
					机器学习
				</button>
			</div>

			<!-- Dataset Listings -->

			<div class="dataset-list" v-if="allDataSetIsV">
				<div
					v-for="dataset in datasetByCategory"
					:key="dataset.dataset_id"
					class="dataset-card"
				>
					<div class="dataset-header">
						<div class="dataset-title-container">
							<span class="dataset-tag">精</span>
							<h3
								class="dataset-title"
								@click="goToDataPage(dataset.dataset_id)"
							>
								{{ dataset['dataset_name'] }}
							</h3>
						</div>
						<p class="dataset-description">
							介绍：{{ dataset.truncDes }}
						</p>
						<div class="dataset-meta">
							<div class="dataset-author">
								<UserIcon class="meta-icon" />
								<span>作者：{{ dataset['user_id'] }}</span>
							</div>
							<div class="dataset-stats">
								<span>分类：{{ dataset.label }}</span>
							</div>
						</div>
					</div>
					<button class="like-button">
						<HeartIcon class="heart-icon" />
						<span>{{ dataset.likes }}</span>
					</button>
				</div>
			</div>

			<!-- 我创建的数据集   -->
			<div class="mydataset-list" v-if="myDataIsVisible">
				<div
					v-for="dataset in myDatasetsByCategory"
					:key="dataset['dataset_id']"
					class="dataset-card"
				>
					<div class="dataset-header">
						<div class="dataset-title-container">
							<span class="dataset-tag">精</span>
							<h3
								class="dataset-title"
								@click="goToDataPage(dataset['dataset_id'])"
							>
								{{ dataset['dataset_name'] }}
							</h3>
						</div>
						<p class="dataset-description">
							介绍：{{ dataset.truncDes }} (详情请点击)
						</p>
						<div class="dataset-meta">
							<div class="dataset-author">
								<UserIcon class="meta-icon" />
								<span>作者：{{ dataset['user_id'] }}</span>
							</div>
							<div class="dataset-stats">
								<span>分类：{{ dataset.label }}</span>
							</div>
						</div>
					</div>
					<button class="like-button">
						<HeartIcon class="heart-icon" />
						<span>{{ dataset.likes }}</span>
					</button>
				</div>
			</div>
		</el-scrollbar>
	</div>

	<CreateDialog v-if="isCreating" @closeCreatePage="closeCreate()" />
	<ProcessDialog v-if="isProcessing" @closeCreatePage="closeProcess()" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { SearchIcon } from 'lucide-vue-next';
import { reactive } from 'vue';
import CreateDialog from '@/components/dataset/CreateDialog.vue';
import ProcessDialog from '@/components/dataset/ProcessDialog.vue';
import Sidebar from '@/components/Sidebar.vue';
import Upperbar from '@/components/Upperbar.vue';
import { useRouter } from 'vue-router'; // 获取路由实例
import {
	findAllDataset,
	getAllPublicDataset,
	findDatasetbyUserid,
} from '@/service/dataset';
import { getLocal } from '@/utils/local';
import HeartIcon from '@/assets/icon/HeartIcon.vue';
const router = useRouter();

//全部的标签
const tags = [
	'计算机视觉',
	'目标检测',
	'语义分割',
	'实例分割',
	'图像分类',
	'关键点检测',
	'OCR识别',
	'人体姿态估计',
	'图像超分辨率',
	'风格迁移',
	'图像翻译',
	'动作迁移',
	'生成',
	'人脸识别',
	'自然语言处理',
	'舆情分析',
	'智能问答',
	'对话系统',
	'观点抽取',
	'文本审核',
	'文言语音',
	'文言标签',
	'文本纠错',
	'知识图谱',
	'推荐系统',
	'机器学习',
];

const datasets = ref([]);

//以下的这个容器会存放所有的数据集

const loading = ref(true);
const error = ref(null);
// 这个方法用来获取所有的数据集
const fetchAllDataset = async () => {
	try {
		const response = await findAllDataset();
		console.log(`output->response`, response);
		datasets.value = response.data; // 将数据存入 dataset 响应式变量

		loading.value = false; // 数据加载完成
		datasets.value = datasets.value.map((dataset) => ({
			...dataset,
			truncDes:
				dataset.introduction.length > 60
					? dataset.introduction.substring(0, 60) + '...'
					: dataset.introduction,
		}));
		//之后再向后端发送请求，获取当前UserId所对应的UserName
		// 遍历每个数据集，根据 UserId 获取 UserName

		for (const data of datasets.value) {
			try {
				const userResponse = await findDatasetbyUserid({
					UserId: data['user_id'],
				});

				data.userName = userResponse.data.username; // 将 UserName 添加到数据集中
			} catch (userErr) {
				console.error(
					`获取 UserName 失败, UserId: ${data.userId}`,
					userErr,
				);
			}
		}
	} catch (err) {
		error.value = '加载数据失败，请稍后重试';
		loading.value = false;
	}
};

// 这个方法用来获取当前用户所创建的所有数据集
const myDatasets = computed(() => {
	return datasets.value.filter(
		(item) => item['user_id'] === getLocal('userId'),
	);
});
console.log(myDatasets);

const myDataIsVisible = computed(() => {
	return selectedTab.value === '我的数据集';
});

const allDataSetIsV = computed(() => {
	return selectedTab.value === '公开数据集';
});

//以下三个函数对应点击“公开数据集”、“我的数据集”、“我喜欢的”时的变化
const selectedTab = ref('公开数据集');
function thePublic() {
	selectedTab.value = '公开数据集';
}
function mine() {
	selectedTab.value = '我的数据集';
}

// 以下函数对应点击“全部”、“计算机视觉”、“自然语言处理”、“推荐系统”、“机器学习”时的变化
const category = ref('全部');
function all() {
	category.value = '全部';
}
function computerVision() {
	category.value = '计算机视觉';
}
function naturalLanguageProcessing() {
	category.value = '自然语言处理';
}
function recommendationSystem() {
	category.value = '推荐系统';
}
function machineLearning() {
	category.value = '机器学习';
}

const query = ref('');
//当搜索框中有内容时，这个函数用来完成搜索功能
const filteredDatasets = ref([...datasets.value]);

const showResults = () => {
	resultsVisible.value = true;
	filteredDatasets.value = datasets.value.filter((dataset) => {
		return (
			dataset.dataSetName.includes(query.value) ||
			dataset.label.includes(query.value) ||
			dataset.userId.includes(query.value)
		);
	});
};

//接下来是通过函数获取数据集中对应类别的数据集
const computerVisionDatasets = computed(() => {
	return datasets.value.filter((item) => item.label === '计算机视觉');
});
const naturalLanguageProcessingDatasets = computed(() => {
	return datasets.value.filter((item) => item.label === '自然语言处理');
});
const recommendationSystemDatasets = computed(() => {
	return datasets.value.filter((item) => item.label === '推荐系统');
});
const machineLearningDatasets = computed(() => {
	return datasets.value.filter((item) => item.label === '机器学习');
});

//这个函数是当选择其他标签时的变化
const otherDatasets = computed(() => {
	return datasets.value.filter((item) => item.label === category.value);
});

// 以下是通过函数获取数据集中对应标签的数据集
const datasetByCategory = computed(() => {
	console.log(`output->datasets`, datasets);
	if (category.value === '全部') {
		return datasets.value;
	} else if (category.value === '计算机视觉') {
		return computerVisionDatasets.value;
	} else if (category.value === '自然语言处理') {
		return naturalLanguageProcessingDatasets.value;
	} else if (category.value === '推荐系统') {
		return recommendationSystemDatasets.value;
	} else if (category.value === '机器学习') {
		return machineLearningDatasets.value;
	} else {
		return otherDatasets.value;
	}
});

//为myDatasets这个容器写一个和上面的函数一样的功能,用来通过标签过滤
const myDatasetsByCategory = computed(() => {
	if (category.value === '全部') {
		console.log(`output->myDatasets.value`, myDatasets.value);
		return myDatasets.value;
	} else if (category.value === '计算机视觉') {
		return myDatasets.value.filter((item) => item.label === '计算机视觉');
	} else if (category.value === '自然语言处理') {
		return myDatasets.value.filter((item) => item.label === '自然语言处理');
	} else if (category.value === '推荐系统') {
		return myDatasets.value.filter((item) => item.label === '推荐系统');
	} else if (category.value === '机器学习') {
		return myDatasets.value.filter((item) => item.label === '机器学习');
	} else {
		return myDatasets.value.filter((item) => item.label === category.value);
	}
});

//用来打开或关闭创建数据集界面
const isCreating = ref(false);
const isProcessing = ref(false);
function startCreate() {
	isCreating.value = true;
}
function closeCreate() {
	isCreating.value = false;
}
function startProcess() {
	isProcessing.value = true;
}
function closeProcess() {
	isProcessing.value = false;
}

//这个方法用来打开数据集详情界面
// 定义方法
const goToDataPage = (id) => {
	router.push({
		name: 'Data-view',
		params: { id: id },
	});
};

// 在组件挂载时调用 fetchDataset
onMounted(() => {
	//这个函数会在页面加载时就调用，获取所有的数据集
	fetchAllDataset();
});
</script>

<style scoped>
@import '../../assets/css/components/Bar.scss';
.upperBar {
	position: absolute;
}

.dataset-container {
	width: 100%;
	padding-left: 2%;
	padding-right: 2%;
	padding-top: 60px;
	margin-top: 5px;
	max-height: 70%;
}

.nav-tabs {
	border-bottom: 1px solid #e5e7eb;
}

.nav-tabs-inner {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem 0;
}

.nav-links {
	display: flex;
	gap: 2rem;
}

.nav-link {
	color: #6b7280;
	padding: 0.5rem 0;
	text-decoration: none;
}

.nav-link.active {
	color: #4f46e5;
	border-bottom: 2px solid #4f46e5;
}

.preprocess-button {
	background-color: #4caf50;
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	border: none;
	cursor: pointer;
	margin-right: 20px;
}

.create-button {
	background-color: #4f46e5;
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	border: none;
	cursor: pointer;
}

.filters {
	display: flex;
	justify-content: space-between; /* 一个居左一个居右 */
	align-items: center; /* 使元素垂直居中 */
	gap: 1rem;
	margin-top: 1.5rem;
	margin-bottom: 1.5rem;
}

.filter-select {
	border: 1px solid #e5e7eb;
	border-radius: 0.375rem;
	padding: 0.5rem 1rem;
	width: 20%;
}

.search-container {
	position: relative;
	flex-grow: 0.4;
}

.search-input {
	width: 90%;
	padding: 0.5rem 2.5rem 0.5rem 1rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.375rem;
}

.search-icon {
	position: absolute;
	right: 0.75rem;
	top: 50%;
	transform: translateY(-50%);
	color: #9ca3af;
}

.category-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	margin-bottom: 2rem;
}

.category-tag {
	color: #6b7280;
	padding: 0.25rem 1rem;
	border-radius: 9999px;
	border: none;
	cursor: pointer;
}

.category-tag.active {
	background-color: #4f46e5;
	color: white;
}

.dataset-list {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.mydataset-list {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.dataset-card {
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	padding: 1.5rem;
	display: flex;
	justify-content: space-between;
}

.dataset-header {
	flex-grow: 1;
}

.dataset-title-container {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 0.5rem;
}

.dataset-tag {
	background-color: #fef3c7;
	color: #d97706;
	padding: 0.125rem 0.375rem;
	border-radius: 0.25rem;
	font-size: 0.875rem;
}

.dataset-title {
	font-size: 1.125rem;
	font-weight: 500;
	margin: 0;
}

.dataset-title:hover {
	color: blue;
	cursor: pointer;
}

.dataset-date {
	color: #6b7280;
	font-size: 0.875rem;
}

.dataset-description {
	color: #4b5563;
	margin-bottom: 1rem;
	text-align: left;
	padding-left: 2%;
}

.dataset-meta {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.dataset-author,
.dataset-stats {
	display: flex;
	align-items: center;
	gap: 1rem;
	color: #6b7280;
	font-size: 0.875rem;
}

.meta-icon {
	width: 1rem;
	height: 1rem;
}

.like-button {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	color: #6b7280;
	background: none;
	border: none;
	cursor: pointer;
}

.heart-icon {
	width: 1.25rem;
	height: 1.25rem;
}

.scoller {
	max-height: 70%;
}
</style>
