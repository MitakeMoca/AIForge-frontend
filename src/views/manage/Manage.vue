<template>
	<el-container class="manage-box" v-loading="state.loading">
		<el-header>
			<span class="logo-text" @click="router.push('/')">AIForge</span>
			<div class="platform">
				<el-icon>
					<Cpu />
				</el-icon>
				<span class="platform-text">模型集成训练平台</span>
			</div>

			<span class="manage-header">管理界面</span>
		</el-header>
		<el-container class="manage-main">
			<el-aside class="manage-aside">
				<el-scrollbar>
					<el-menu
						@select="selectMenu"
						default-active="2"
						class="manage-aside-menu"
					>
						<el-sub-menu index="1">
							<template #title>
								<el-icon>
									<User />
								</el-icon>
								<span>用户</span>
							</template>
							<el-menu-item index="1">全部</el-menu-item>
						</el-sub-menu>
						<el-sub-menu index="2">
							<template #title>
								<el-icon>
									<Discount />
								</el-icon>
								<span>模型</span>
							</template>
							<el-menu-item index="2-1">已公开</el-menu-item>
							<el-menu-item index="2-2">待审核</el-menu-item>
							<el-menu-item index="2-3">上传模型</el-menu-item>
						</el-sub-menu>
						<el-sub-menu index="3">
							<template #title>
								<el-icon>
									<Notification />
								</el-icon>
								<span>项目</span>
							</template>
							<el-menu-item index="3">已公开</el-menu-item>
						</el-sub-menu>
						<el-sub-menu index="4">
							<template #title>
								<el-icon>
									<DataAnalysis />
								</el-icon>
								<span>数据集</span>
							</template>
							<el-menu-item index="4">已公开</el-menu-item>
						</el-sub-menu>
					</el-menu>
				</el-scrollbar>
			</el-aside>
			<el-main>
				<el-scrollbar>
					<UserManage v-if="state.currentIndex == '1'"> </UserManage>
					<PublicModelManage
						v-else-if="state.currentIndex == '2-1'"
					></PublicModelManage>
					<ReviewModelManage
						v-else-if="state.currentIndex == '2-2'"
					></ReviewModelManage>
					<UploadModelManage v-else-if="state.currentIndex == '2-3'">
					</UploadModelManage>
					<div v-else-if="state.currentIndex == '3'" class="project">
						<el-table
							:data="state.projects"
							stripe
							style="width: 100%"
						>
							<el-table-column
								prop="projectId"
								label="项目ID"
								width="120px"
							/>
							<el-table-column
								prop="projectName"
								label="项目名"
								width="120px"
							/>
							<el-table-column label="描述" width="120px">
								<template #default="scope">
									<div
										class="text-clamp"
										v-tooltip="scope.row.description"
									>
										{{ scope.row.description }}
									</div>
								</template>
							</el-table-column>
							<el-table-column
								prop="user_id"
								label="用户ID"
								width="120px"
							/>
							<el-table-column
								prop="status"
								label="项目状态"
								width="120px"
							/>
							<el-table-column
								prop="createTime"
								label="创建时间"
								width="120px"
							/>
							<el-table-column
								prop="updateTime"
								label="更新时间"
								width="120px"
							/>
							<el-table-column
								prop="visibility"
								label="项目可见性"
								width="120px"
							/>
							<el-table-column
								prop="train_DatasetId"
								label="训练数据集ID"
								width="120px"
							/>
							<el-table-column
								prop="test_DatasetId"
								label="测试数据集ID"
								width="120px"
							/>
							<el-table-column
								prop="modelId"
								label="模型ID"
								width="120px"
							/>
							<el-table-column
								prop="storePath"
								label="存储路径"
								width="120px"
							/>
							<el-table-column fixed="right" label="删除">
								<template #default="scope">
									<el-button
										type="danger"
										:icon="Delete"
										@click="
											deleteproject(scope.row.projectId)
										"
									/>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div v-else-if="state.currentIndex == '4'" class="dataset">
						<el-table
							:data="state.datasets"
							stripe
							style="width: 100%"
						>
							<el-table-column
								prop="dataSetId"
								label="数据集ID"
							/>
							<el-table-column prop="projectId" label="项目ID" />
							<el-table-column
								prop="dataSetName"
								label="数据集名称"
							/>
							<el-table-column prop="dataUrl" label="存储地址" />
							<el-table-column prop="dataType" label="数据类型" />
							<el-table-column
								prop="dataSize"
								label="数据及大小"
							/>
							<el-table-column prop="label" label="标签" />
							<el-table-column prop="user_id" label="用户ID" />
							<el-table-column label="介绍" width="200px">
								<template #default="scope">
									<div
										class="text-clamp"
										v-tooltip="scope.row.introduction"
									>
										{{ scope.row.introduction }}
									</div>
								</template>
							</el-table-column>
							<el-table-column fixed="right" label="删除">
								<template #default="scope" label="关闭">
									<el-button
										type="danger"
										:icon="Close"
										@click="
											deletedataset(scope.row.dataSetId)
										"
									/>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-scrollbar>
			</el-main>
		</el-container>
	</el-container>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import UserManage from '@/views/manage/UserManage.vue';
import PublicModelManage from '@/views/manage/PublicModelManage.vue';
import ReviewModelManage from '@/views/manage/ReviewModelManage.vue';
import UploadModelManage from '@/views/manage/UploadModelManage.vue';
import {
	User,
	Discount,
	Notification,
	DataAnalysis,
	Check,
	Close,
	Delete,
	Back,
	Cpu,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import {
	findAllModelPublic,
	findAllModelWaiting,
	addModel,
} from '@/service/model';
import { findAllProject, deleteProject } from '@/service/project';
import { findAllDataset, deleteDataset } from '@/service/dataset';
const router = useRouter();
const state = reactive({
	userId: '',
	modelId: '',
	projectId: '',
	datasetId: '',
	currentIndex: 1,
	drawer: false,
	users: [],
	models: [],
	projects: [],
	datasets: [],
	newModels: [],
});
const load = async () => {
	if (state.currentIndex == '2-3') {
		state.models = [];
	} else if (state.currentIndex == '3') {
		const response = await findAllProject();
		state.projects = response.data;
	} else if (state.currentIndex == '4') {
		const response = await findAllDataset();
		state.datasets = response.data;
	}
};
const selectMenu = (index) => {
	state.currentIndex = index;
	load();
};
const deleteproject = async (ProjectId) => {
	const response = await deleteProject({ ProjectId: ProjectId });
	const resultCode = response.resultCode || '';
	if (resultCode == 200) {
		ElMessage.success('删除成功');
	} else {
		ElMessage.error('删除失败');
	}
	load();
};
const deletedataset = async (DataSetId) => {
	const response = await deleteDataset({ DataSetId: DataSetId });
	const resultCode = response.resultCode || '';
	if (resultCode == 200) {
		ElMessage.success('删除成功');
	} else {
		ElMessage.error('删除失败');
	}
	load();
};

const back = () => {
	router.push({
		path: '/home',
	});
};
</script>

<style>
.manage-box {
	position: relative;
	height: 100%;
	width: 100%;
	background-color: #f4f7fc;

	.el-header {
		display: flex;
		width: 100%;
		height: 60px;
		line-height: 60px;
		background-color: #34495e;
		justify-content: center;
		align-items: center;
		border-bottom: 2px solid #ccc;
	}

	.manage-header {
		font-size: 30px;
		color: #ffffff;
		font-weight: bold;
	}

	.logo-text {
		font-family: 'Arial', sans-serif;
		font-size: 24px;
		font-weight: bold;
		color: #4e81ff;
		position: absolute;
		left: 30px;
		cursor: pointer;
		vertical-align: middle;
	}

	.logo-text:hover {
		color: #3a6bb7;
	}

	.platform {
		line-height: 60px;
		font-size: 0;
		position: absolute;
		left: 160px;
	}

	.platform > i {
		vertical-align: middle;
	}

	.platform-text {
		vertical-align: middle;
		color: white;
		font-size: 20px;
		margin-left: 4px;
	}

	.manage-main {
		display: flex;
		height: calc(100% - 60px);
		width: 100%;
	}

	.manage-aside {
		width: 250px;
		background-color: #ffffff;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
	}

	.manage-aside-menu {
		margin: 10px 0;
	}

	.el-menu {
		background-color: #fff; /* 菜单背景色 */
		border-right: 1px solid #eee; /* 菜单右边框 */
	}

	.el-menu-item {
		font-size: 16px;
		color: #34495e; /* 深灰色文字 */
	}

	.el-menu-item:hover {
		background-color: #f1f1f1; /* 鼠标悬浮效果 */
	}

	.el-main {
		width: 100%;
		padding: 20px;
		overflow-y: auto; /* 防止内容溢出 */
	}

	.model,
	.project,
	.dataset {
		width: 100%;
	}

	.el-table th,
	.el-table td {
		padding: 15px; /* 增加表格内边距 */
		font-size: 16px; /* 更大的字体 */
		text-align: center; /* 表格内容居中 */
	}

	.el-table-column {
		font-weight: 600; /* 增加列名的粗体 */
	}

	.el-table tr:nth-child(even) {
		background-color: #f9f9f9; /* 奇偶行背景色 */
	}

	.el-table-button {
		border-radius: 5px;
	}

	.model-input-row {
		padding: 20px;
		margin-bottom: 20px;
		border-radius: 8px;
		background-color: #ffffff;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
	}

	.model-form {
		width: 100%;
	}

	.add-param-button,
	.button-container {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.button-container {
		margin-top: 20px;
	}
}

.text-clamp {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 5; /* 限制最多显示2行 */
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: break-word;
	cursor: pointer;
}
</style>
