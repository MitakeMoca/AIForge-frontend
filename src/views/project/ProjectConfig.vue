<template>
	<div class="project">
		<div class="the-header">
			<div
				@click="goBack()"
				style="margin: 30px 10px 0 20px; cursor: pointer"
			>
				<BackIcon></BackIcon>
				<span style="margin: 10px">返回</span>
			</div>

			<div
				v-for="(step, index) in steps"
				:key="index"
				:class="[
					'step',
					{
						active: index + 1 === currentStep,
						completed: index + 1 < currentStep,
					},
				]"
			>
				<div style="display: flex; user-select: none">
					<div
						class="step-number"
						@click="
							currentStep =
								currentStep > step.number
									? step.number
									: currentStep
						"
					>
						{{ step.number }}
					</div>
					<div class="step-label">{{ step.label }}</div>
					<div
						v-if="index < steps.length - 1"
						class="step-line"
					></div>
				</div>
			</div>
		</div>

		<div class="the-body">
			<div class="body-center">
				<div style="height: 100%" v-if="currentStep === 1">
					<div>
						<p
							style="
								font-size: 26px;
								font-weight: bold;
								margin: 50px 100px;
							"
						>
							选择任务
						</p>
					</div>
					<div class="chooses">
						<div
							class="choose-block"
							:class="{ chosen: form.ProjectType === item }"
							@click="chooseProjectType(item)"
							v-for="item in projectTypes"
						>
							<p class="tag-name">{{ item }}</p>
							<div class="tag-detail">
								{{ tagDetails[item] }}
							</div>
						</div>
						<el-dialog
							title="修改任务类型"
							v-model="changeProjectTypeDialog"
							width="30%"
						>
							<p style="margin: 60px 0; font-size: 16px">
								修改任务类型后，会清空原有配置，确定继续吗？
							</p>
							<span slot="footer">
								<el-button
									@click="changeProjectTypeDialog = false"
									>取消</el-button
								>
								<el-button
									type="primary"
									@click="changeProjectType"
									>确认</el-button
								>
							</span>
						</el-dialog>
					</div>
				</div>

				<div style="height: 100%" v-if="currentStep === 2">
					<div>
						<p
							style="
								font-size: 26px;
								font-weight: bold;
								margin: 50px 100px;
							"
						>
							选择模型及添加数据集
						</p>
					</div>
					<div class="step2-center">
						<div class="select">
							<el-form :rules="rules" :model="form">
								<el-form-item
									size="large"
									label="选择模型"
									prop="model"
								>
									<el-select
										style="width: 400px"
										v-model="form.model"
										size="large"
										placeholder="请选择模型"
										value-key="id"
										clearable
									>
										<el-option
											v-for="model in models"
											:key="model.id"
											:label="model.model_name"
											:value="model"
										></el-option>
									</el-select>
								</el-form-item>
								<br />
								<el-form-item
									size="large"
									label="添加数据集"
									prop="dateset"
								>
									<el-button
										@click="showDatasetDialog = true"
										style="
											color: blue;
											font-size: 16px;
											cursor: pointer;
										"
									>
										已有数据集
									</el-button>
									<el-button
										@click="showAddDatasetDialog = true"
										style="
											color: blue;
											font-size: 16px;
											cursor: pointer;
										"
									>
										添加新的数据集
									</el-button>

									<el-dialog
										class="dataset"
										title="未校验数据集"
										v-model="showDatasetDialog"
										width="30%"
									>
										<div style="height: 500px">
											<div class="header">
												<div style="display: flex">
													<div
														style="
															font-size: 20px;
															margin-left: 20px;
															cursor: pointer;
															height: 42px;
														"
														:class="{
															active:
																datasetTab ===
																'personal',
														}"
														@click="
															datasetTab =
																'personal';
															displayedDataset =
																personalDatasets;
														"
													>
														<span>个人数据集</span>
													</div>
													<div
														style="
															font-size: 20px;
															margin-left: 20px;
															cursor: pointer;
															height: 42px;
														"
														:class="{
															active:
																datasetTab ===
																'public',
														}"
														@click="
															datasetTab =
																'public';
															displayedDataset =
																publicDatasets;
														"
													>
														<span>公共数据集</span>
													</div>
												</div>
												<div
													style="
														width: 90%;
														height: 0.5px;
														position: absolute;
														background: darkgray;
													"
												></div>
											</div>

											<div class="center">
												<div
													v-for="item in displayedDataset"
													class="dataset-item"
													@click="selectDataset(item)"
												>
													<div
														:class="{
															selected:
																item.selected,
														}"
														style="
															display: flex;
															height: 15px;
															width: 15px;
															border: 3px solid
																darkgray;
															border-radius: 5px;
															margin: 30px;
														"
													>
														<tick-icon
															v-if="item.selected"
														></tick-icon>
													</div>
													<p
														style="
															width: 100px;
															text-align: left;
														"
													>
														{{ item.dataset_name }}
													</p>
													<p
														style="
															width: 200px;
															margin-left: 50px;
															text-align: left;
														"
													>
														{{ item.introduction }}
													</p>
												</div>
											</div>
										</div>

										<span slot="footer">
											<el-button @click="cancelSelect()"
												>取消</el-button
											>
											<el-button
												type="primary"
												@click="handleSelect()"
											>
												<p>
													添加
													{{ datasetSelectedCount }}/2
												</p>
											</el-button>
										</span>
									</el-dialog>
								</el-form-item>
								<div
									v-for="item in form.dataset"
									style="
										text-align: left;
										margin-left: 100px;
										margin-bottom: 20px;
										display: flex;
									"
								>
									<div style="width: 250px">
										<dataset-icon
											v-if="item !== form.testSet"
										></dataset-icon>
										<test-icon
											v-if="item === form.testSet"
										></test-icon>
										<span style="margin: 0 30px 0 10px">{{
											item.dataset_name
										}}</span>
										<delete-icon
											style="cursor: pointer"
											@click="
												showDeleteSelectedDataset = true;
												selectedDatasetForDelete = item;
											"
										></delete-icon>
									</div>

									<div
										class="test"
										@click="selectAsTestSet(item)"
									>
										<span>作为测试集</span>
									</div>
								</div>
								<el-dialog
									v-model="showDeleteSelectedDataset"
									style="text-align: center; top: 10%"
									title="删除已选数据集"
									width="20%"
								>
									<p style="margin: 60px 0; font-size: 16px">
										确定要删除选择的数据集吗？
									</p>
									<span slot="footer">
										<el-button
											@click="
												showDeleteSelectedDataset = false
											"
											>取消</el-button
										>
										<el-button
											type="primary"
											@click="deleteSelectedDataset()"
										>
											确认
										</el-button>
									</span>
								</el-dialog>
							</el-form>
						</div>
						<CreateDialog
							v-if="showAddDatasetDialog"
							@closeCreatePage="showAddDatasetDialog = false"
						/>
						<div
							style="
								height: 100%;
								width: 2px;
								background: lightgray;
							"
						></div>
						<el-scrollbar>
							<div v-if="form.model" class="step2-right">
								<div
									style="text-align: left"
									v-html="
										markdownEditor.render(
											form.model.model_overview_markdown,
										)
									"
								></div>
							</div>
						</el-scrollbar>
					</div>
				</div>

				<div style="height: 100%" v-if="currentStep === 3">
					<div class="step3-center">
						<div>
							<p
								style="
									font-size: 26px;
									font-weight: bold;
									margin: 50px 100px;
								"
							>
								参数准备
							</p>
						</div>

						<div class="model-parameters">
							<h2>请设置模型参数</h2>
							<p>{{ form.model.model_name }}</p>
							<p>参数说明详见技术文档</p>
							<el-scrollbar>
								<div
									class="parameter"
									v-for="(value, key) in hyperparameters"
								>
									<label
										for="classNum"
										style="font-weight: bold"
									>
										{{ key }} *
									</label>
									<p>{{ value }}</p>
									<input
										style="font-size: 18px"
										id="classNum"
										v-model="form.params[key]"
									/>
								</div>
							</el-scrollbar>
						</div>
					</div>
				</div>

				<div style="height: 100%" v-if="currentStep === 4">
					<p
						style="
							text-align: left;
							font-size: 24px;
							margin-left: 150px;
							margin-top: 100px;
						"
					>
						您当前的VIP等级为：{{ vipLevel }}
					</p>
					<p
						style="
							text-align: left;
							width: 100px;
							font-size: 24px;
							margin-left: 150px;
							margin-top: 50px;
							color: #aca527;
							cursor: pointer;
						"
						@click="goPay()"
					>
						去升级
					</p>

					<el-form-item size="large" label="选择领域" prop="model">
						<el-select
							style="width: 400px"
							v-model.trim="form.selectedField"
							size="large"
							placeholder="请选择学科"
							filterable
							clearable
						>
							<el-option
								v-for="subject in subjects"
								:key="subject"
								:label="subject"
								:value="subject"
							></el-option>
						</el-select>
					</el-form-item>
				</div>
			</div>
			<div class="body-bottom-line"></div>
			<div class="body-bottom">
				<div class="button" @click="previousStep()">
					<p
						style="
							font-size: 16px;
							margin: 14px 35px;
							color: honeydew;
						"
					>
						上一步
					</p>
				</div>
				<div class="button" @click="nextStep()">
					<p
						v-if="currentStep !== 4"
						style="
							font-size: 16px;
							margin: 14px 35px;
							color: honeydew;
						"
					>
						下一步
					</p>
					<p
						v-if="currentStep === 4"
						style="
							font-size: 16px;
							margin: 14px 43px;
							color: honeydew;
						"
					>
						完成
					</p>
				</div>
				<el-dialog
					v-model="saveDialog"
					style="text-align: center; top: 10%"
					title="保存项目配置"
					width="20%"
				>
					<p style="margin: 60px 0; font-size: 20px">
						确定要保存项目的配置吗？
					</p>
					<span slot="footer">
						<el-button @click="saveDialog = false">取消</el-button>
						<el-button type="primary" @click="saveConfig()">
							确认
						</el-button>
					</span>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MarkdownIt from 'markdown-it';
import { getLocal } from '@/utils/local.js';
import { subjects } from '@/assets/data.ts';

import PreviousStepIcon from '@/assets/icon/PreviousStepIcon.vue';
import BackIcon from '@/assets/icon/BackIcon.vue';
import TickIcon from '@/assets/icon/TickIcon.vue';
import DatasetIcon from '@/assets/icon/DatasetIcon.vue';
import DeleteIcon from '@/assets/icon/DeleteIcon.vue';
import CreateDialog from '@/components/CreateDialog.vue';
import TestIcon from '@/assets/icon/TestIcon.vue';

import {
	findDatasetById,
	findDatasetbyUserid,
	getAllPublicDataset,
} from '@/service/dataset.js';
import {
	findModelById,
	findModelByUserId,
	getModelsByProjectType,
} from '@/service/model.js';
import {
	getProject,
	updateTrainSetOfProject,
	updateModelOfProject,
	updateProjectTypeOfProject,
	updateTestSetOfProject,
} from '@/service/project.js';
import { getHyparaByModelId } from '@/service/hypara.js';
import { getTagDetail } from '@/service/tag.js';
import {
	addHyparaOfProject,
	findHyparaByPath,
	getHyparaByProjectId,
} from '@/service/hypara.js';
import { getUser } from '@/service/user.js';
import { ElNotification, ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();

const userId = ref(getLocal('userId'));
const projectId = ref('');
const showDatasetDialog = ref(false);
const showAddDatasetDialog = ref(false);
const showDeleteSelectedDataset = ref(false);
const saveDialog = ref(false);
const selectedDatasetForDelete = ref('');
const markdownEditor = new MarkdownIt();

const steps = [
	{ number: 1, label: '选择产线' },
	{ number: 2, label: '数据准备' },
	{ number: 3, label: '参数准备' },
	{ number: 4, label: '领域选择' },
];

const currentStep = ref(1);
const projectTypes = [
	'多模态模型',
	'基础模型',
	'产业方案',
	'创意工坊',
	'视觉检测跟踪',
	'光学字符识别',
	'视觉分类',
	'视觉分割',
	'视觉编辑',
	'三维视觉',
	'生成式',
	'文本编辑',
	'生成文本',
	'词语切分',
	'摘要',
	'翻译',
	'文本分析',
	'文本理解',
	'文本对话',
	'识别',
	'合成',
	'声音克隆',
	'时间戳预测',
	'语音处理',
	'因感度计算',
	'图像描述',
	'视觉定位',
	'多模态表征',
	'蛋白质结构预测',
	'时序预测',
];
const projectTypeForChange = ref('');
const changeProjectTypeDialog = ref(false);
const models = ref([]);
const personalModels = ref([]);
const datasetTab = ref('personal');
const publicDatasets = ref([]);
const personalDatasets = ref([]);
const displayedDataset = ref([]);
const vipLevel = ref('');
const datasetSelectedCount = ref(0);

const form = ref({
	ProjectType: '',
	model: null,
	dataset: [],
	testSet: null,
	trainSet: null,
	params: {},
	model_id: 0,
	selectedField: 'No field',
});

const hyperparameters = ref({});

const rules = {
	model: [
		{
			required: true,
			message: '模型选择不能为空',
			trigger: ['blur', 'change'],
		},
	],
	dataset: [
		{
			required: true,
			message: '数据集不能为空',
			trigger: ['blur', 'change'],
		},
	],
};

onMounted(async () => {
	const resUser = await getUser({ UserId: userId.value });
	console.log(`output->resUser`, resUser);
	vipLevel.value = resUser.data.level;
	const resModels = await findModelByUserId(userId.value);
	personalModels.value = resModels.data;

	if (route.params.id) {
		projectId.value = Number(route.params.id);
		const resProject = await getProject({ ProjectId: projectId.value });
		if (resProject?.data) {
			const data = resProject.data;
			console.log(`output->data`, data);
			if (data.project_type) {
				form.value.ProjectType = data['project_type'];
				const res = await getModelsByProjectType(data['project_type']);
				models.value = res.data;
				currentStep.value = 1;
			}
			if (data['model_id'] !== -1) {
				const modelRes = await findModelById(data['model_id']);
				console.log(`output->modelRes`, modelRes);
				form.value.model = modelRes.data;
				const paramRes = await getHyparaByModelId(form.value.model.id);
				hyperparameters.value = paramRes.data;
				currentStep.value = 2;
			}
			console.log(`output->data`, data);
			if (data.train_dataset_id !== -1) {
				const dsRes = await findDatasetById(data.train_dataset_id);
				if (dsRes.data) {
					form.value.dataset.push(dsRes.data);
					dsRes.data.selected = true;
					datasetSelectedCount.value++;
					form.value.trainSet = dsRes.data;
					currentStep.value = 2;
				}
			}
			if (data.test_dataset_id !== -1) {
				const dsRes = await findDatasetById(data.test_dataset_id);
				if (dsRes.data) {
					form.value.dataset.push(dsRes.data);
					dsRes.data.selected = true;
					datasetSelectedCount.value++;
					form.testSet = dsRes.data;
					currentStep.value = 2;
				}
			}
			const pathRes = await getHyparaByProjectId({
				ProjectId: projectId.value,
			});
			let path = null;
			if (pathRes.data.length) pathRes.data[pathRes.data.length - 1];
			if (path) {
				const hyRes = await findHyparaByPath({ StorePath: path });
				form.value.params = hyRes.data;
				currentStep.value = 3;
			}
		}
	}

	const personalDsRes = await findDatasetbyUserid({ UserId: userId.value });
	console.log(`output->personalDsRes`, personalDsRes);
	personalDatasets.value = personalDsRes.data;
	displayedDataset.value = personalDatasets.value;
	const publicDsRes = await getAllPublicDataset();
	console.log(`output->publicDsRes`, publicDsRes);
	publicDatasets.value = publicDsRes.data;
	initSelected();
	fetchTagDetail();
});

function goBack() {
	router.push('/project');
}
function goPay() {
	ElNotification({ message: '555' });
}
function previousStep() {
	if (currentStep.value > 1) currentStep.value--;
}
const tagDetails = ref({});
async function fetchTagDetail(tagName) {
	for (let tag in projectTypes) {
		const description = (await getTagDetail(projectTypes[tag])).data
			.description;
		tagDetails.value[projectTypes[tag]] = description;
	}
}

function nextStep() {
	if (currentStep.value === 1) {
		if (!form.value.ProjectType)
			return ElNotification({ message: '请选择任务', type: 'warning' });
		getModelsByProjectType(form.value.ProjectType).then((res) => {
			models.value = res.data;
		});
		currentStep.value++;
	} else if (currentStep.value === 2) {
		if (!form.value.model)
			return ElNotification({
				message: '请选择您的模型',
				type: 'warning',
			});
		if (form.value.dataset.length !== 2)
			return ElNotification({
				message: '请添加您的数据集',
				type: 'warning',
			});
		if (!form.value.testSet)
			return ElNotification({
				message: '请选择您的测试集',
				type: 'warning',
			});
		getHyparaByModelId(form.value.model.id).then((res) => {
			hyperparameters.value = res.data;
			delete hyperparameters.value[''];
			console.log(`output->hyparares`, res);
		});
		form.value.params = {};
		currentStep.value++;
	} else if (currentStep.value === 3) {
		currentStep.value++;
	} else if (currentStep.value === 4) {
		saveDialog.value = true;
	}
}
function chooseProjectType(item) {
	projectTypeForChange.value = item;
	if (form.value.ProjectType !== item) changeProjectTypeDialog.value = true;
}
function changeProjectType() {
	form.value.model = null;
	form.value.dataset = [];
	form.value.testSet = {};
	form.value.params = {};
	form.value.ProjectType = projectTypeForChange.value;
	projectTypeForChange.value = '';
	clearSelected();
	changeProjectTypeDialog.value = false;
}
function cancelSelect() {
	showDatasetDialog.value = false;
	showAddDatasetDialog.value = false;
}
function handleSelect() {
	form.value.dataset = [];
	form.value.trainSet = null;
	form.value.testSet = null;
	[...personalDatasets.value, ...publicDatasets.value].forEach((ds) => {
		if (ds.selected && !form.value.dataset.includes(ds))
			form.value.dataset.push(ds);
	});
	if (form.value.dataset.length > 0) {
		showDatasetDialog.value = false;
		ElNotification({ message: '添加成功', type: 'success' });
	} else {
		ElNotification({ message: '请至少选择一个数据集', type: 'warning' });
	}
}
function selectDataset(item) {
	if (!item.selected) {
		if (datasetSelectedCount.value >= 2) {
			ElNotification({
				message: '请您共选择两个数据集',
				type: 'warning',
			});
		} else {
			item.selected = true;
			datasetSelectedCount.value++;
		}
	} else {
		item.selected = false;
		datasetSelectedCount.value--;
	}
}
function selectAsTestSet(item) {
	form.value.testSet = item;
	form.value.trainSet = form.value.dataset.find(
		(d) => d.dataset_id !== item.dataset_id,
	);
}
function initSelected() {
	[...personalDatasets.value, ...publicDatasets.value].forEach((ds) => {
		ds.selected = form.value.dataset.some(
			(d) => d.dataset_id === ds.dataset_id,
		);
	});
}
function clearSelected() {
	[...personalDatasets.value, ...publicDatasets.value].forEach(
		(ds) => (ds.selected = false),
	);
	datasetSelectedCount.value = 0;
}
function deleteSelectedDataset() {
	showDeleteSelectedDataset.value = false;
	selectedDatasetForDelete.value.selected = false;
	const index = form.value.dataset.indexOf(selectedDatasetForDelete.value);
	if (index !== -1) form.value.dataset.splice(index, 1);
	datasetSelectedCount.value--;
	if (selectedDatasetForDelete.value === form.value.testSet)
		form.value.testSet = null;
	selectedDatasetForDelete.value = '';
}
function saveConfig() {
	console.log(`output->form.value`, form.value);
	updateProjectTypeOfProject({
		project_id: projectId.value,
		project_type: form.value.ProjectType,
	});
	updateModelOfProject({
		project_id: projectId.value,
		model_id: form.value.model.id,
	});
	updateTrainSetOfProject({
		project_id: projectId.value,
		dataset_id: form.value.trainSet.dataset_id,
	});
	updateTestSetOfProject({
		project_id: projectId.value,
		dataset_id: form.value.testSet.dataset_id,
	});
	const params = {
		params: { ...form.value.params },
		project_id: projectId.value,
	};
	addHyparaOfProject(params);
	saveDialog.value = false;
	router.push('/project');
	ElMessage({
		message: '创建项目成功',
		type: 'success',
	});
}
</script>

<style scoped>
.project {
	width: 100%;
	height: 100%;
	background: white;
}

.the-header {
	width: 100%;
	height: 100px;
	background: rgba(70, 130, 180, 0.1);
	display: flex;
}

.the-body {
	width: 100%;
	height: 72%;
}

.body-bottom-line {
	margin-left: 10%;
	width: 80%;
	height: 1px;
	background: gray;
}

.body-center {
	height: 95%;
	width: 100%;
}

.chooses {
	margin-top: 50px;
	margin-left: 200px;
	height: 75%;
	overflow-y: auto;
	display: flex;
	flex-wrap: wrap;

	.choose-block {
		width: 25%;
		height: 128px;
		margin-right: 60px;
		margin-bottom: 40px;
		text-align: left;
		border: 1px solid darkgrey;
		border-radius: 10px;
		transition: box-shadow 0.1s ease;
		box-shadow: 0 2px 5px rgba(0, 155, 222, 0.2);
		cursor: pointer;
	}

	.choose-block:hover {
		box-shadow: 0 5px 15px rgba(0, 155, 222, 0.3);
	}

	.chosen {
		border: 1px solid mediumblue;
	}

	.tag-name {
		margin-left: 25px;
		font-size: 20px;
		font-weight: bolder;
	}
	.choose-block:hover > .tag-name {
		color: #2592eb;
	}
	.tag-detail {
		max-height: 64px; /* 根据需要调整最大高度 */
		margin-left: 25px;
		margin-right: 6px;
		font-size: 16px;
		overflow: hidden; /* 超出隐藏 */
		text-overflow: ellipsis; /* 显示省略号 */
		display: -webkit-box; /* 使用弹性盒子模型 */
		-webkit-box-orient: vertical; /* 设置盒子的子元素排列方式为垂直 */
		-webkit-line-clamp: 2; /* 限制文本在3行以内显示 */
		line-height: 1.4; /* 行高，根据需要调整 */
	}
}

.step2-center {
	width: 100%;
	height: 80%;
	display: flex;
}

.step2-right {
	width: 700px;
	height: 100%;
	margin-left: 20px;
}

.step3-center {
	width: 100%;
	height: 80%;
}

.select {
	margin-left: 10%;
	width: 40%;
}

.body-bottom {
	margin-top: 20px;
	margin-left: 40%;
	display: flex;
}

.button {
	display: flex;
	width: 120px;
	height: 50px;
	margin-right: 50px;
	position: relative;
	background: #2563eb;
	border-radius: 8px;
}

.button:hover {
	background: #4a90e2;
}

.body-leftSide:hover {
	background: #cfcfcf;
}

.step {
	display: flex;
	margin: 30px 120px 0 80px;
	flex-direction: column;
	align-items: center;
	position: relative;
}

.step-number {
	cursor: pointer;
	background-color: #fff;
	border: 2px solid #ccc;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20px;
}

.step-label {
	font-size: 18px;
	margin: 10px;
}

.step.active .step-number {
	border-color: #4a90e2;
	color: #4a90e2;
}

.step.completed .step-label {
	color: #4a90e2;
}

.step.completed .step-number {
	background-color: #4a90e2;
	color: #fff;
}

.step-line {
	width: 120px;
	height: 1px;
	background-color: #ccc;
	position: absolute;
	top: 30%;
	left: 120%;
}

.dataset {
	.active {
		color: #6495ed;
		font-weight: bold;
		border-bottom: 4px solid #6495ed;
	}

	.header {
		height: 55px;
	}

	.center {
		height: 400px;
		overflow: hidden;
		overflow-y: scroll;
	}

	.selected {
		border: 3px solid #2563eb !important;
	}

	.dataset-item {
		display: flex;
		width: 100%;
		height: 80px;
		margin: 10px;
		cursor: pointer;
		transition: 0.3s;
	}

	.dataset-item:hover {
		background: rgba(240, 248, 255, 0.7);
	}
}

.model-parameters {
	max-width: 400px;
	margin-left: 200px;
	height: 75%;
	text-align: left;

	.parameter {
		margin-bottom: 20px;
	}

	.parameter label {
		display: block;
		margin-bottom: 5px;
	}

	.parameter input {
		width: 100%;
		padding: 8px;
		height: 45px;
		box-sizing: border-box;
		border-radius: 7px;
	}

	.parameter p {
		font-size: 0.9em;
		color: #555;
	}
}

.test {
	margin-left: 30px;
	width: 100px;
	height: 25px;
	border: solid 1px darkgray;
	border-radius: 5px;
	display: flex;
	> span {
		font-size: 14px;
		margin-left: 10px;
		color: #aca527;
		cursor: pointer;
	}
	transition: transform 0.3ms ease;
}
.test:hover {
	transform: scale(1.03);
	background: rgba(160, 160, 160, 0.1);
}

.button {
	cursor: pointer;
}
</style>
