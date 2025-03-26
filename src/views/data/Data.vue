<template>
	<header class="upperbar">
		<upperbar />
	</header>
	<aside class="sidebar" style="padding-top: 60px">
		<sidebar />
	</aside>
	<div class="whole">
		<div class="dataset-container">
			<!-- Header Section -->
			<div class="header-section">
				<h1 class="title">
					{{ dataset.dataSetName }}
				</h1>
				<p class="short_des">{{ dataset.introduction }}</p>
				<div class="stats">
					<div class="stat-item">
						<span>作者</span>
						<span>{{ dataset.UserName }}</span>
					</div>
					<div class="stat-item"></div>
					<div class="stat-item">
						<span>分类</span>
						<span>{{ dataset.label }}</span>
					</div>
				</div>
			</div>

			<!-- Navigation Tabs -->

			<!-- Description Section -->
			<div v-if="currentTab === 'details'" class="content-section">
				<div class="tabs">
					<label
						v-for="tab in tabs"
						:key="tab.id"
						:class="[
							'tab-button',
							{ active: currentTab === tab.id },
						]"
						@click="currentTab = tab.id"
					>
						{{ tab.name }}{{ tab.count ? `(${tab.count})` : '' }}
					</label>
				</div>
				<h2>数据集介绍</h2>
				<p>{{ dataset.introduction }}</p>

				<!-- File List -->
				<!-- Updated File List -->
				<div class="file-list">
					<h3>文件列表</h3>
					<div class="file-list-content">
						<div class="main-files">
							<div class="main-file-item">
								<span>DataSet{{ file.name }}.zip</span>
								<span class="file-size"
									>({{ dataset.dataSize }}MB)</span
								>
								<button class="download-btn" @click="download">
									下载
								</button>
							</div>
						</div>
						<div class="detailed-files">
							<table>
								<thead>
									<tr>
										<th>File Name</th>
										<th>Size</th>
										<th>Type</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="file in limitedFiles"
										:key="file.name"
									>
										<td>{{ file.name }}</td>
										<td>{{ file.size }}</td>
										<td>{{ file.extension }}</td>
									</tr>
								</tbody>
							</table>
							<div class="see-more">
								<a href="#" @click="download">下载查看更多</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { toRefs } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { findDatasetById, findDatasetbyUserid } from '@/service/dataset';
import Sidebar from '@/components/Sidebar.vue';
import Upperbar from '@/components/Upperbar.vue';
import JSZip from 'jszip';
import { getLocal } from '@/utils/local';
import { ElMessage } from 'element-plus';

// 获取路由实例
const route = useRoute();

// 从路由参数中解构出 dataSetId
const { id } = toRefs(route.params);
// 打印 dataSetId
//将id转换为整数形式
const idValue = parseInt(id.value);

const currentTab = ref('details');

const dataset = ref({}); //用来存储当前的数据集
const file = ref({}); //用来存存储文件树对象
const files = ref([]); //用来存储zip文件下所有文件的属性

const totalSize = ref(0); //用来显示文件的总大小

const tabs = [{ id: 'details', name: '详情' }];

const truncatedDescription = ref('');
// 方法:像后端请求对应id的数据集
const fetchDataset = async () => {
	try {
		const response = await findDatasetById({
			DatasetId: idValue,
		});
		dataset.value = response.data;
		truncatedDescription.value = computed(() => {
			if (dataset.introduction) {
				return dataset.introduction.length > 50
					? dataset.introduction.slice(0, 50) + '...'
					: datasetintroduction;
			}
			return '';
		});

		// 请求用户名

		fetchUserName(dataset.value.userId);
	} catch (error) {
		console.error('Error fetching dataset:', error);
	}
};

// 方法：请求用户名

const fetchUserName = async (userId) => {
	try {
		const response = await findDatasetbyUserid({ UserId: userId });
		if (dataset.value) {
			dataset.value.UserName = response.data.username;
		}
	} catch (error) {
		console.error('Error fetching UserName:', error);
	}
};

// 递归函数
function getFiles(node) {
	if (node.type === 'file') {
		files.value.push(node);
	} else {
		node.children.forEach((child) => getFiles(child));
	}
}
//获取文件树
const fetchFileAttribute = async () => {
	try {
		const response = await axios.get('Dataset/getDatasetFiles', {
			params: {
				datasetId: idValue,
			},
		});
		console.log(response.data);
		file.value = response.data;
		getFiles(file.value);
	} catch (error) {
		console.error('Error fetching ZIP file:', error);
	}
};

files.value.forEach((file) => {
	// 将 size 转换为 MB 并保留两位小数
	const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
	file.size = `${sizeInMB} MB`;

	// 获取文件名后缀
	const nameParts = file.name.split('.');
	const fileExtension = nameParts.length > 1 ? nameParts.pop() : '';

	// 添加文件后缀作为一个新字段
	file.extension = fileExtension;
});

// 方法：下载文件
const download = async () => {
	try {
		console.log(idValue);
		const response = await axios.post(
			'/Dataset/downloadFiles',
			{
				DatasetId: idValue,
			},
			{
				responseType: 'blob', // 确保返回的是二进制数据
			},
		);
		console.log(response.data);
		const url = window.URL.createObjectURL(new Blob([response]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'DataSet' + file.value.name + '.zip'); // 指定下载文件的名称
		document.body.appendChild(link);
		link.click();
		link.remove();
	} catch (error) {
		ElMessage({
			message: '文件下载失败',
			type: 'error',
		});
	}
};
const limitedFiles = computed(() => {
	return files.value.slice(0, 6);
});

// 计算属性：截断描述文本
// 计算属性：截断描述文本

// 在组件挂载时调用方法
onMounted(() => {
	fetchDataset();
	fetchFileAttribute();
});
</script>

<style scoped>
@import '../../assets/css/components/Bar.scss';
.upperBar {
	position: absolute;
}

/* Add your CSS styles here */
.whole {
	width: 100%;
	background-color: #f5f5f5;
	padding: 24px;
	max-height: 100%;
}
.dataset-container {
	background-color: white;
	width: 90%;
	margin: 6% auto;
	padding: 24px;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
		Ubuntu, Cantarell, sans-serif;
}

.header-section {
	margin-bottom: 0px;
}

.title {
	font-size: 24px;
	font-weight: 600;
	color: #333;
	margin-bottom: 16px;
	display: flex;
	align-items: center;
	gap: 12px;
}
.short_des {
	font-size: 16px;
	color: #666;
	line-height: 1.5;
	text-align: left;
}

.badge {
	font-size: 14px;
	padding: 2px 8px;
	background-color: #f0f0f0;
	border-radius: 4px;
	color: #666;
}

.stats {
	display: flex;
	gap: 24px;
}

.stat-item {
	display: flex;
	align-items: center;
	gap: 8px;
	color: #666;
	font-size: 14px;
}

.tabs {
	display: flex;
	border-bottom: 1px solid #e0e0e0;
	margin-bottom: 24px;
	position: relative;
}

.tab-button {
	padding: 12px 24px;
	border: none;
	background: none;
	cursor: pointer;
	color: #666;
	font-size: 14px;
	position: relative;
}

.tab-button.active {
	color: #4834d4;
}

.tab-button.active::after {
	content: '';
	position: absolute;
	bottom: -1px;
	left: 0;
	right: 0;
	height: 2px;
	background-color: #4834d4;
}

.create-project {
	margin-left: auto;
	padding: 6px 16px;
	background-color: #4834d4;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
}

.create-project:hover {
	background-color: #3a2bb7;
}

.content-section {
	padding: 24px 0;
}

.content-section h2 {
	font-size: 25px;
	font-weight: 600;
	margin-bottom: 16px;
	color: #333;
	text-align: left;
}

.content-section p {
	color: #666;
	line-height: 1.6;
	margin-bottom: 24px;
	text-align: left;
}

.file-list {
	margin-top: 24px;
}

.file-list h3 {
	font-size: 16px;
	font-weight: 600;
	margin-bottom: 16px;
	color: #333;
}

.file-list-content {
	display: flex;
	gap: 24px;
}

.main-files {
	flex: 0 0 200px;
}

.main-file-item {
	align-items: center;
	margin-bottom: 12px;
	font-size: 14px;
	color: #333;
}

.file-size {
	margin-left: 8px;
	color: #666;
}

.download-btn {
	margin-left: auto;
	margin-top: 10px;
	padding: 2px 8px;
	background-color: #4834d4;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 12px;
}

.detailed-files {
	flex: 1;
}

table {
	width: 100%;
	border-collapse: collapse;
}

th,
td {
	padding: 12px;
	text-align: left;
	border-bottom: 1px solid #e0e0e0;
}

th {
	background-color: #f8f9fa;
	font-weight: 500;
	color: #666;
}

td {
	color: #333;
}

.see-more {
	margin-top: 16px;
	text-align: center;
}

.see-more a {
	color: #4834d4;
	text-decoration: none;
}

.see-more a:hover {
	text-decoration: underline;
}

.back {
	position: absolute;
	top: 20px;
	left: 20px;
	height: 500px;
	width: 50px;
}

#back {
	position: fixed;
	left: 50px;
	top: 80px;
	width: 90px;
	height: 45px;
	/* 在 App.vue 中的 <style> 部分 */

	font-family: Arial, sans-serif;
	font-size: 16px;
	line-height: 2;
	letter-spacing: 10px;
	text-align: center;
}
</style>
