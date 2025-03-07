<template>
	<el-container class="manage-box" v-loading="state.loading">
		<el-header>
			<span class="logo-text">AIForge</span>
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
					<div v-if="state.currentIndex == '1'" class="user">
						<el-table
							:data="state.users"
							stripe
							style="width: 100%"
						>
							<el-table-column
								prop="userId"
								label="用户ID"
								width="350px"
							/>
							<el-table-column
								prop="username"
								label="账号"
								width="350px"
							/>
							<el-table-column
								prop="password"
								label="密码"
								width="350px"
							/>
							<el-table-column
								prop="email"
								label="电子邮箱"
								width="350px"
							/>
							<el-table-column fixed="right" label="删除">
								<template #default="scope">
									<el-button
										type="danger"
										:icon="Close"
										@click="deleteuser(scope.row.userId)"
									/>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div v-else-if="state.currentIndex == '2-1'" class="model">
						<el-table
							:data="state.models"
							stripe
							style="width: 100%"
						>
							<el-table-column
								prop="modelId"
								label="模型ID"
								width="160px"
							/>
							<el-table-column
								prop="modelName"
								label="模型名"
								width="160px"
							/>
							<el-table-column
								prop="modelFrame"
								label="框架"
								width="160px"
							/>
							<el-table-column
								prop="modelDate"
								label="模型日期"
								width="160px"
							/>
							<el-table-column
								prop="modelDescription"
								label="模型描述"
								width="160px"
							/>
							<el-table-column
								prop="modelRunCount"
								label="运行次数"
								width="160px"
							/>
							<el-table-column
								prop="modelViewCount"
								label="观看次数"
								width="160px"
							/>
							<el-table-column
								prop="modelPath"
								label="模型路径"
								width="160px"
							/>
							<el-table-column
								prop="userId"
								label="用户ID"
								width="160px"
							/>
							<el-table-column fixed="right" label="关闭">
								<template #default="scope">
									<el-button
										type="danger"
										:icon="Delete"
										@click="setprivate(scope.row.modelId)"
									/>
								</template>
							</el-table-column>
							<el-table-column fixed="right" label="私有">
								<template #default="scope">
									<el-button
										type="danger"
										:icon="Close"
										@click="setwaiting(scope.row.modelId)"
									/>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div v-else-if="state.currentIndex == '2-2'" class="model">
						<el-table
							:data="state.models"
							stripe
							style="width: 100%"
						>
							<el-table-column
								prop="modelId"
								label="模型ID"
								width="160px"
							/>
							<el-table-column
								prop="modelName"
								label="模型名"
								width="160px"
							/>
							<el-table-column
								prop="modelFrame"
								label="框架"
								width="160px"
							/>
							<el-table-column
								prop="modelDate"
								label="模型日期"
								width="160px"
							/>
							<el-table-column
								prop="modelDescription"
								label="模型描述"
								width="160px"
							/>
							<el-table-column
								prop="modelRunCount"
								label="运行次数"
								width="160px"
							/>
							<el-table-column
								prop="modelViewCount"
								label="观看次数"
								width="160px"
							/>
							<el-table-column
								prop="modelPath"
								label="模型路径"
								width="160px"
							/>
							<el-table-column
								prop="userId"
								label="用户ID"
								width="160px"
							/>
							<el-table-column fixed="right" label="关闭">
								<template #default="scope">
									<el-button
										type="danger"
										:icon="Delete"
										@click="setprivate(scope.row.modelId)"
									/>
								</template>
							</el-table-column>
							<el-table-column fixed="right" label="开启">
								<template #default="scope">
									<el-button
										type="primary"
										:icon="Check"
										@click="setpublic(scope.row.modelId)"
									/>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div v-else-if="state.currentIndex == '2-3'" class="model">
						<div
							v-for="(model, index) in state.newModels"
							:key="index"
							class="model-input-row"
						>
							<el-form
								ref="modelForm"
								label-width="70px"
								class="model-form"
							>
								<el-form-item label="模型名">
									<el-input
										v-model="model.modelName"
									></el-input>
								</el-form-item>
								<el-form-item label="模型描述">
									<el-input
										v-model="model.modelDescription"
									></el-input>
								</el-form-item>
								<el-form-item label="模型介绍">
									<el-input
										v-model="model.modelOverviewMarkdown"
									></el-input>
								</el-form-item>
								<el-form-item label="框架">
									<el-input
										v-model="model.modelFrame"
									></el-input>
								</el-form-item>
								<el-form-item label="图片ID">
									<el-input
										v-model="model.imageId"
									></el-input>
								</el-form-item>
								<el-form-item label="用户ID">
									<el-input v-model="model.userId"></el-input>
								</el-form-item>
								<el-form-item label="是否公开">
									<el-input
										v-model="model.isPublic"
									></el-input>
								</el-form-item>
								<el-form-item label="Tag">
									<el-input v-model="model.tag"></el-input>
								</el-form-item>
								<el-form-item label="模型文件">
									<el-upload
										v-model:file-list="model.modelFileList"
										accept=".zip"
										:limit="1"
										:auto-upload="false"
									>
										<i class="el-icon-upload"></i>
										<div class="el-upload__text">
											<em>上传</em>
										</div>
									</el-upload>
								</el-form-item>
								<el-form-item label="超参数">
									<div
										v-for="(
											param, index
										) in model.hyperparameters"
										:key="index"
										class="hyperparameter-row"
									>
										<span class="param-name-label"
											>参数名</span
										>
										<el-input
											v-model="param.name"
											class="param-name-input"
										></el-input>
										<span class="param-value-label"
											>参数描述</span
										>
										<el-input
											v-model="param.value"
											class="param-value-input"
										></el-input>
										<el-button
											type="text"
											icon="Delete"
											@click="
												removeHyperparameter(
													model,
													index,
												)
											"
											v-if="
												model.hyperparameters.length > 1
											"
											>删除参数</el-button
										>
									</div>
									<el-button
										type="text"
										icon="Plus"
										@click="addHyperparameter(model)"
										class="add-param-button"
										>添加参数</el-button
									>
								</el-form-item>
								<el-form-item>
									<div class="button-container">
										<el-button
											type="primary"
											@click="uploadModel(model)"
											>上传</el-button
										>
										<el-button
											type="danger"
											@click="deleteModel(index)"
											>删除</el-button
										>
									</div>
								</el-form-item>
							</el-form>
						</div>
						<el-button
							style="width: 100%"
							@click="addNewModelRow(model)"
							>添加模型</el-button
						>
					</div>
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
							<el-table-column
								prop="description"
								label="描述"
								width="120px"
							/>
							<el-table-column
								prop="userId"
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
							<el-table-column prop="userId" label="用户ID" />
							<el-table-column prop="introduction" label="介绍" />
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
import { findAllUser, deleteUser } from '@/service/user';
import {
	findAllModelPublic,
	findAllModelWaiting,
	setPublic,
	setPrivate,
	setWaiting,
	addModel,
} from '@/service/model';
import { findAllProject, deleteProject } from '@/service/project';
import { findAllDataset, deleteDataset } from '@/service/dataset';
import { createHyparaField } from '@/service/hypara.js';
const router = useRouter();
const state = reactive({
	userId: '',
	modelId: '',
	projectId: '',
	datasetId: '',
	currentIndex: 0,
	drawer: false,
	users: [],
	models: [],
	projects: [],
	datasets: [],
	newModels: [],
});
const addHyperparameter = (model) => {
	model.hyperparameters.push({ name: '', value: '' });
};
const removeHyperparameter = (model, index) => {
	model.hyperparameters.splice(index, 1);
};
const addNewModelRow = () => {
	state.newModels.push({
		modelName: '',
		modelDescription: '',
		modelOverviewMarkdown: '',
		modelFrame: '',
		imageId: 0,
		userId: '',
		isPublic: 1,
		tag: '基础模型',
		modelFileList: [],
		hyperparameters: [{ name: '', value: '' }],
	});
};
const deleteModel = (index) => {
	state.newModels.splice(index, 1);
};
const load = async () => {
	if (state.currentIndex == '1') {
		const response = await findAllUser();
		state.users = response.data;
	} else if (state.currentIndex == '2-1') {
		const response = await findAllModelPublic();
		state.models = response.data;
	} else if (state.currentIndex == '2-2') {
		const response = await findAllModelWaiting();
		state.models = response.data;
	} else if (state.currentIndex == '2-3') {
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
const deleteuser = async (UserId) => {
	const response = await deleteUser({ UserId: UserId });
	const resultCode = response.resultCode || '';
	if (resultCode == 200) {
		ElMessage.success('删除成功');
	} else {
		ElMessage.error('删除失败');
	}
	load();
};
const setprivate = async (ModelId) => {
	const response = await setPrivate({ modelId: ModelId });
	const resultCode = response.resultCode || '';
	if (resultCode == 200) {
		ElMessage.success('下架成功');
	} else {
		ElMessage.error('下架失败');
	}
	load();
};
const setpublic = async (ModelId) => {
	const response = await setPublic({ modelId: ModelId });
	const resultCode = response.resultCode || '';
	if (resultCode == 200) {
		ElMessage.success('上架成功');
	} else {
		ElMessage.error('上架失败');
	}
	load();
};
const setwaiting = async (ModelId) => {
	const response = await setWaiting({ modelId: ModelId });
	const resultCode = response.resultCode || '';
	if (resultCode == 200) {
		ElMessage.success('待审核成功');
	} else {
		ElMessage.error('待审核失败');
	}
	load();
};
const uploadHyperparameters = async (model) => {
	const hyperparametersData = model.hyperparameters.reduce((acc, param) => {
		acc[param.name] = param.value;
		return acc;
	}, {});

	try {
		const response = await createHyparaField(hyperparametersData);
		const resultCode = response.resultCode || '';
		if (resultCode === 200) {
			ElMessage.success('超参数上传成功');
			return response.data.storePath;
		}
	} catch (error) {
		console.error('上传超参数出错:', error);
		ElMessage.error('超参数上传失败');
		return null;
	}
};
const uploadModel = async (model) => {
	const formData = new FormData();
	const file = model.modelFileList[0].raw;
	formData.append('modelFile', file);
	formData.append('modelName', model.modelName);
	formData.append('modelDescription', model.modelDescription);
	formData.append('modelOverviewMarkdown', model.modelOverviewMarkdown);
	formData.append('modelFrame', model.modelFrame);
	formData.append('imageId', model.imageId);
	formData.append('userId', model.userId);
	formData.append('isPublic', model.isPublic);
	console.log(`output->model.tag`, model.tag);
	formData.append('tag', model.tag);
	const hyperparametersResult = await uploadHyperparameters(model);
	console.log(hyperparametersResult);
	formData.append('hyparaPath', hyperparametersResult);
	console.log(formData);
	const response = await addModel(formData);
	console.log(response);
	console.log(1);
	const resultCode = response.resultCode || '';
	if (resultCode === 200) {
		ElMessage.success('模型上传成功');
	} else {
		ElMessage.error('模型上传失败');
	}
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

<style scoped>
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

	.user,
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
</style>
