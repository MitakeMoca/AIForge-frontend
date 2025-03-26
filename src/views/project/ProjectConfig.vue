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
								{{ showTagDetail(item) }}
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
							<el-form :rules="rules" :model="form" ref="form">
								<el-form-item
									size="large"
									label="选择模型"
									prop="model"
								>
									<el-select
										style="width: 400px"
										value-key="modelId"
										v-model="form.model"
										size="large"
										placeholder="请选择模型"
										clearable
									>
										<el-option
											v-for="model in models"
											:key="model.modelId"
											:label="model.modelName"
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
														{{ item.dataSetName }}
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
											item.dataSetName
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
											form.model.modelOverviewMarkdown,
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
							<p>{{ form.model.modelName }}</p>
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
	getParamsByModelId,
} from '@/service/model.js';
import {
	getProject,
	updateDatasetOfProject,
	updateModelOfProject,
	updateProjectTypeOfProject,
	updateTestSetOfProject,
} from '@/service/project.js';
import { getTagDetail } from '@/service/tag.js';
import {
	addHyparaOfProject,
	findHyparaByPath,
	getHyparaByProjectId,
} from '@/service/hypara.js';
import { getUser } from '@/service/user.js';

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
	{ number: 4, label: '提交训练' },
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

const form = reactive({
	ProjectType: '',
	model: null,
	dataset: [],
	testSet: null,
	trainSet: null,
	params: {},
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
			if (data.projectType) {
				form.ProjectType = data['project_type'];
				const res = await getModelsByProjectType(data['project_type']);
				models.value = res.data;
				currentStep.value = 1;
			}
			if (data['model_id'] !== -1) {
				const modelRes = await findModelById(data['model_id']);
				form.model = modelRes.data;
				const paramRes = await getParamsByModelId(
					form.model['model_id'],
				);
				hyperparameters.value = paramRes.data;
				currentStep.value = 2;
			}
			console.log(`output->data`, data);
			if (data.train_dataset_id !== -1) {
				const dsRes = await findDatasetById({
					DatasetId: Number(data.train_dataset_id),
				});
				if (dsRes.data) {
					form.dataset.push(dsRes.data);
					dsRes.data.selected = true;
					datasetSelectedCount.value++;
					form.trainSet = dsRes.data;
					currentStep.value = 2;
				}
			}
			if (data.test_dataset_id !== -1) {
				const dsRes = await findDatasetById({
					DatasetId: Number(data.test_dataset_id),
				});
				if (dsRes.data) {
					form.dataset.push(dsRes.data);
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
				form.params = hyRes.data;
				currentStep.value = 3;
			}
		}
	}

	const personalDsRes = await findDatasetbyUserid({ UserId: userId.value });
	personalDatasets.value = personalDsRes.data;
	displayedDataset.value = personalDatasets.value;
	const publicDsRes = await getAllPublicDataset();
	publicDatasets.value = publicDsRes.data;
	initSelected();
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
function showTagDetail(tagName) {
	getTagDetail({ tagName })
		.then((res) => res.data.description)
		.catch(() => '暂无详细描述');
	return '暂无详细描述';
}
function nextStep() {
	if (currentStep.value === 1) {
		if (!form.ProjectType)
			return ElNotification({ message: '请选择任务', type: 'warning' });
		getModelsByProjectType(form.ProjectType).then(
			(res) => (models.value = res.data),
		);
		currentStep.value++;
	} else if (currentStep.value === 2) {
		if (!form.model)
			return ElNotification({
				message: '请选择您的模型',
				type: 'warning',
			});
		if (form.dataset.length !== 2)
			return ElNotification({
				message: '请添加您的数据集',
				type: 'warning',
			});
		if (!form.testSet)
			return ElNotification({
				message: '请选择您的测试集',
				type: 'warning',
			});
		getParamsByModelId(form.model.modelId).then(
			(res) => (hyperparameters.value = res.data),
		);
		form.params = {};
		currentStep.value++;
	} else if (currentStep.value === 3) {
		currentStep.value++;
	} else if (currentStep.value === 4) {
		saveDialog.value = true;
	}
}
function chooseProjectType(item) {
	projectTypeForChange.value = item;
	if (form.ProjectType !== item) changeProjectTypeDialog.value = true;
}
function changeProjectType() {
	form.model = null;
	form.dataset = [];
	form.testSet = {};
	form.params = {};
	form.ProjectType = projectTypeForChange.value;
	projectTypeForChange.value = '';
	clearSelected();
	changeProjectTypeDialog.value = false;
}
function cancelSelect() {
	showDatasetDialog.value = false;
	showAddDatasetDialog.value = false;
}
function handleSelect() {
	form.dataset = [];
	form.trainSet = null;
	form.testSet = null;
	[...personalDatasets.value, ...publicDatasets.value].forEach((ds) => {
		if (ds.selected && !form.dataset.includes(ds)) form.dataset.push(ds);
	});
	if (form.dataset.length > 0) {
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
	form.testSet = item;
	form.trainSet = form.dataset.find((d) => d.dataSetId !== item.dataSetId);
}
function initSelected() {
	[...personalDatasets.value, ...publicDatasets.value].forEach((ds) => {
		ds.selected = form.dataset.some((d) => d.dataSetId === ds.dataSetId);
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
	const index = form.dataset.indexOf(selectedDatasetForDelete.value);
	if (index !== -1) form.dataset.splice(index, 1);
	datasetSelectedCount.value--;
	if (selectedDatasetForDelete.value === form.testSet) form.testSet = null;
	selectedDatasetForDelete.value = '';
}
function saveConfig() {
	updateProjectTypeOfProject({
		ProjectId: projectId.value,
		ProjectType: form.ProjectType,
	});
	updateModelOfProject({
		ProjectId: projectId.value,
		modelId: form.model.modelId,
	});
	updateDatasetOfProject({
		ProjectId: projectId.value,
		DatasetId: form.trainSet.dataSetId,
	});
	updateTestSetOfProject({
		ProjectId: projectId.value,
		DatasetId: form.testSet.dataSetId,
	});
	const params = { ...form.params, ProjectId: projectId.value };
	addHyparaOfProject(params);
	saveDialog.value = false;
	router.push('/project');
}
</script>

<style scoped>
@import '../../assets/css/project/createProject.scss';
</style>
