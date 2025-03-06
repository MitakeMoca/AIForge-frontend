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
							:class="{ chosen: this.form.ProjectType === item }"
							@click="chooseProjectType(item)"
							v-for="item in this.projectTypes"
						>
							<p class="tag-name">{{ item }}</p>
							<div class="tag-detail">
								{{ getTagDetail(item) }}
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
									@click="changeProjectType()"
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
										>
										</el-option>
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
										>添加新的数据集
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
										>
										</delete-icon>
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
											>确认</el-button
										>
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
											this.form.model
												.modelOverviewMarkdown,
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
							<p>{{ this.form.model.modelName }}</p>
							<p>参数说明详见技术文档</p>
							<el-scrollbar>
								<div
									class="parameter"
									v-for="(value, key) in this.hyperparameters"
								>
									<label
										for="classNum"
										style="font-weight: bold"
										>{{ key }} *
									</label>
									<p>{{ value }}</p>
									<input
										style="font-size: 18px"
										id="classNum"
										v-model="this.form.params[key]"
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
						您当前的VIP等级为：{{ this.vipLevel }}
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
						<el-button type="primary" @click="saveConfig()"
							>确认</el-button
						>
					</span>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script>
import PreviousStepIcon from '@/assets/icon/PreviousStepIcon.vue';
import BackIcon from '@/assets/icon/BackIcon.vue';
import TickIcon from '@/assets/icon/TickIcon.vue';
import DatasetIcon from '@/assets/icon/DatasetIcon.vue';
import DeleteIcon from '@/assets/icon/DeleteIcon.vue';
import CreateDialog from '@/components/CreateDialog.vue';
import {
	findDatasetById,
	findDatasetbyUserid,
	getAllPublicDataset,
} from '@/service/dataset.js';
import {
	findModelById,
	findModelByUserId,
	getModelDetails,
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
import TestIcon from '@/assets/icon/TestIcon.vue';
import {
	addHyparaOfProject,
	findHyparaByPath,
	findPathByProjectId,
} from '@/service/hypara.js';
import { getUser } from '@/service/user.js';
import MarkdownIt from 'markdown-it';
import { getLocal } from '@/utils/local.js';

export default {
	name: 'ProjectConfig',
	components: {
		TestIcon,
		CreateDialog,
		DeleteIcon,
		DatasetIcon,
		TickIcon,
		PreviousStepIcon,
		BackIcon,
	},
	data() {
		return {
			userId: '',
			projectId: '',
			showDatasetDialog: false, // 控制对话框显示
			showAddDatasetDialog: false,
			showDeleteSelectedDataset: false,
			saveDialog: false,
			selectedDatasetForDelete: '',
			markdownEditor: new MarkdownIt(),
			steps: [
				{
					number: 1,
					label: '选择产线',
				},
				{
					number: 2,
					label: '数据准备',
				},
				{
					number: 3,
					label: '参数准备',
				},
				{
					number: 4,
					label: '提交训练',
				},
			],
			currentStep: 1,
			projectTypes: [
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
			],
			projectTypeForChange: '',
			changeProjectTypeDialog: false,
			models: [],
			personalModels: [],
			datasetTab: 'personal',
			publicDatasets: [],
			personalDatasets: [],
			displayedDataset: [],
			vipLevel: '',
			datasetSelected: [],
			datasetSelectedCount: 0,
			hyperparameters: {
				// "learning_rate": "学习率，控制每次更新的步长",
				// "batch_size": "每次训练使用的样本数量",
				// "epoch": "训练的轮数"
			},
			form: {
				ProjectType: '',
				model: null, // 用于绑定选择的模型
				dataset: [],
				testSet: null,
				trainSet: null,
				params: {},
			},
			rules: {
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
			},
		};
	},
	async mounted() {
		console.log(`output->mounted`);
		this.userId = getLocal('userId');
		await getUser({ UserId: this.userId }).then((res) => {
			this.vipLevel = res.data.level;
		});
		await findModelByUserId(this.userId).then((res) => {
			this.personalModels = res.data;
		});
		if (this.$route.params.id) {
			this.projectId = Number(this.$route.params.id);
			await getProject({ ProjectId: this.projectId }).then(
				async (res) => {
					if (res != null) {
						let data = res.data;
						if (data.projectType) {
							this.form.ProjectType = data.projectType;
							getModelsByProjectType(data.projectType).then(
								(res) => {
									this.models = res.data;
								},
							);
							this.currentStep = 1;
						}
						if (data.modelId !== -1) {
							await findModelById(data.modelId).then((model) => {
								this.form.model = model.data;
							});
							await getParamsByModelId(
								this.form.model.modelId,
							).then((param) => {
								this.hyperparameters = param.data;
							});
							this.currentStep = 2;
						}

						if (data.train_DatasetId !== -1) {
							await findDatasetById({
								DatasetId: Number(data.train_DatasetId),
							}).then((dataset) => {
								if (dataset.data !== null) {
									this.form.dataset.push(dataset.data);
									dataset.data.selected = true;
									this.datasetSelectedCount++;
									this.form.trainSet = dataset.data;
									this.currentStep = 2;
								}
							});
						}

						if (data.test_DatasetId !== -1) {
							await findDatasetById({
								DatasetId: Number(data.test_DatasetId),
							}).then((dataset) => {
								if (dataset.data) {
									this.form.dataset.push(dataset.data);
									dataset.data.selected = true;
									this.datasetSelectedCount++;
									this.form.testSet = dataset.data;
									this.currentStep = 2;
								}
							});
						}

						await findPathByProjectId({
							ProjectId: this.projectId,
						}).then((res) => {
							let path = res.data[res.data.length - 1];

							if (path) {
								findHyparaByPath({ StorePath: path }).then(
									(params) => {
										this.form.params = params.data;
									},
								);
								this.currentStep = 3;
							}
						});
					}
				},
			);
		}

		await findDatasetbyUserid({ UserId: this.userId }).then((res) => {
			console.log(`output->DatasetbyUserid`, res);
			this.personalDatasets = res.data;
			this.displayedDataset = this.personalDatasets;
		});
		await getAllPublicDataset().then((res) => {
			console.log(`output->publicDatasets`, res);
			this.publicDatasets = res.data;
		});
		await this.initSelected();
	},
	methods: {
		goBack() {
			this.$router.push('/project');
		},
		goPay() {
			this.$notify({ message: '555' });
		},
		previousStep() {
			if (this.currentStep > 1) {
				this.currentStep--;
			}
		},
		// 获取标签详情
		getTagDetail(tagName) {
			const params = {
				tagName: tagName,
			};
			getModelDetails(params)
				.then((res) => {
					return res.data.description;
				})
				.catch((err) => {
					console.log(err);
				});
			return '暂无详细描述';
		},
		nextStep() {
			if (this.currentStep === 1) {
				if (!this.form.ProjectType) {
					this.$notify({ message: '请选择任务', type: 'warning' });
					return;
				}
				getModelsByProjectType(this.form.ProjectType).then((res) => {
					this.models = res.data;
				});
				this.currentStep++;
				return;
			}
			if (this.currentStep === 2) {
				if (!this.form.model) {
					this.$notify({
						message: '请选择您的模型',
						type: 'warning',
					});
					return;
				}
				if (this.form.dataset.length !== 2) {
					this.$notify({
						message: '请添加您的数据集',
						type: 'warning',
					});
					return;
				}
				if (!this.form.testSet) {
					this.$notify({
						message: '请选择您的测试集',
						type: 'warning',
					});
					return;
				}
				getParamsByModelId(this.form.model.modelId).then((res) => {
					this.hyperparameters = res.data;
				});
				this.form.params = {};
				this.currentStep++;
				return;
			}
			if (this.currentStep === 3) {
				this.currentStep++;
				return;
			}
			if (this.currentStep === 4) {
				this.saveDialog = true;
			}
		},
		chooseProjectType(item) {
			this.projectTypeForChange = item;
			if (this.form.ProjectType !== item) {
				this.changeProjectTypeDialog = true;
			}
		},
		changeProjectType() {
			this.form.model = null;
			this.form.dataset = [];
			this.form.testSet = {};
			this.form.params = {};
			this.form.ProjectType = this.projectTypeForChange;
			this.projectTypeForChange = '';
			this.clearSelected();
			this.changeProjectTypeDialog = false;
		},
		cancelSelect() {
			this.showDatasetDialog = false;
			this.showAddDatasetDialog = false;
		},
		handleSelect() {
			this.form.dataset = [];
			this.form.trainSet = null;
			this.form.testSet = null;
			for (let i = 0; i < this.personalDatasets.length; i++) {
				if (
					this.personalDatasets[i].selected &&
					!this.form.dataset.includes(this.personalDatasets[i])
				) {
					this.form.dataset.push(this.personalDatasets[i]);
				}
			}
			for (let i = 0; i < this.publicDatasets.length; i++) {
				if (
					this.publicDatasets[i].selected &&
					!this.form.dataset.includes(this.publicDatasets[i])
				) {
					this.form.dataset.push(this.publicDatasets[i]);
				}
			}
			if (this.form.dataset.length > 0) {
				this.showDatasetDialog = false;
				this.$notify({ message: '添加成功', type: 'success' });
			} else {
				this.$notify({
					message: '请至少选择一个数据集',
					type: 'warning',
				});
			}
		},
		selectDataset(item) {
			if (item.selected == null || item.selected === false) {
				if (this.datasetSelectedCount >= 2) {
					this.$notify({
						message: '请您共选择两个数据集',
						type: 'warning',
					});
				} else {
					item.selected = true;
					this.datasetSelectedCount++;
				}
			} else {
				item.selected = false;
				this.datasetSelectedCount--;
			}
		},
		selectAsTestSet(item) {
			this.form.testSet = item;
			if (this.form.dataset[0].dataSetId === item.dataSetId) {
				this.form.trainSet = this.form.dataset[1];
			} else {
				this.form.trainSet = this.form.dataset[0];
			}
		},
		initSelected() {
			for (let i = 0; i < this.personalDatasets.length; i++) {
				let dataset = this.personalDatasets[i];
				dataset.selected =
					this.form.dataset[0].dataSetId === dataset.dataSetId ||
					this.form.dataset[1].dataSetId === dataset.dataSetId;
			}
			for (let i = 0; i < this.publicDatasets.length; i++) {
				let dataset = this.publicDatasets[i];
				dataset.selected =
					this.form.dataset[0].dataSetId === dataset.dataSetId ||
					this.form.dataset[1].dataSetId === dataset.dataSetId;
			}
		},
		clearSelected() {
			for (let i = 0; i < this.personalDatasets.length; i++) {
				let dataset = this.personalDatasets[i];
				dataset.selected = false;
			}
			for (let i = 0; i < this.publicDatasets.length; i++) {
				let dataset = this.publicDatasets[i];
				dataset.selected = false;
			}
			this.datasetSelectedCount = 0;
		},
		deleteSelectedDataset() {
			this.showDeleteSelectedDataset = false;
			this.selectedDatasetForDelete.selected = false;
			var index = this.form.dataset.indexOf(
				this.selectedDatasetForDelete,
			);
			this.form.dataset.splice(index, 1);
			this.datasetSelectedCount--;
			if (this.selectedDatasetForDelete === this.form.testSet) {
				this.form.testSet = null;
			}
			this.selectedDatasetForDelete = '';
		},
		saveConfig() {
			updateProjectTypeOfProject({
				ProjectId: this.projectId,
				ProjectType: this.form.ProjectType,
			});

			updateModelOfProject({
				ProjectId: this.projectId,
				modelId: this.form.model.modelId,
			});

			updateDatasetOfProject({
				ProjectId: this.projectId,
				DatasetId: this.form.trainSet.dataSetId,
			});

			updateTestSetOfProject({
				ProjectId: this.projectId,
				DatasetId: this.form.testSet.dataSetId,
			});

			let params = this.form.params;
			params.ProjectId = this.projectId;
			console.log(params);
			addHyparaOfProject(params).then((res) => {
				console.log(res);
			});

			this.saveDialog = false;
			this.$router.push('/project');
		},
	},
};
</script>

<style scoped>
@import '../../assets/css/project/createProject.scss';
</style>
