<template>
	<div style="width: 100%">
		<div
			v-for="(model, index) in state.newModels"
			:key="index"
			class="model-input-row"
		>
			<el-form ref="modelForm" label-width="70px" class="model-form">
				<el-form-item label="模型名">
					<el-input v-model="model.modelName"></el-input>
				</el-form-item>
				<el-form-item label="模型描述">
					<el-input v-model="model.modelDescription"></el-input>
				</el-form-item>
				<el-form-item label="模型介绍">
					<el-input v-model="model.modelOverviewMarkdown"></el-input>
				</el-form-item>
				<el-form-item label="框架">
					<el-input v-model="model.modelFrame"></el-input>
				</el-form-item>
				<el-form-item label="图片ID">
					<el-input v-model="model.imageId"></el-input>
				</el-form-item>
				<el-form-item label="用户ID">
					<el-input v-model="model.userId"></el-input>
				</el-form-item>
				<el-form-item label="是否公开">
					<el-input v-model="model.isPublic"></el-input>
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
						v-for="(param, index) in model.hyperparameters"
						:key="index"
						class="hyperparameter-row"
					>
						<span class="param-name-label">参数名</span>
						<el-input
							v-model="param.name"
							class="param-name-input"
						></el-input>
						<span class="param-value-label">参数描述</span>
						<el-input
							v-model="param.value"
							class="param-value-input"
						></el-input>
						<el-button
							type="text"
							icon="Delete"
							@click="removeHyperparameter(model, index)"
							v-if="model.hyperparameters.length > 1"
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
						<el-button type="primary" @click="uploadModel(model)"
							>上传</el-button
						>
						<el-button type="danger" @click="deleteModel(index)"
							>删除</el-button
						>
					</div>
				</el-form-item>
			</el-form>
		</div>
		<el-button style="width: 100%" @click="addNewModelRow(model)"
			>添加模型</el-button
		>
	</div>
</template>

<script setup>
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { addModel } from '@/service/model';
import { createHyparaField } from '@/service/hypara.js';

const state = reactive({
	newModels: [
		{
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
		},
	],
});

// 添加新的超参数
const addHyperparameter = (model) => {
	model.hyperparameters.push({ name: '', value: '' });
};

// 移除超参数
const removeHyperparameter = (model, index) => {
	model.hyperparameters.splice(index, 1);
};

// 添加新的模型行
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

// 删除模型
const deleteModel = (index) => {
	state.newModels.splice(index, 1);
};

// 上传模型
const uploadModel = async (model) => {
	const formData = new FormData();
	const file = model.modelFileList[0].raw;
	formData.append('model_file', file);
	formData.append('model_name', model.modelName);
	formData.append('model_description', model.modelDescription);
	formData.append('model_overview', model.modelOverviewMarkdown);
	formData.append('frame', model.modelFrame);
	formData.append('image_id', model.imageId);
	formData.append('user_id', model.userId);
	formData.append('pub', model.isPublic);
	formData.append('tag', model.tag);

	// 上传超参数，返回超参数存储的路径
	const hyperparametersResult = await uploadHyperparameters(model);
	formData.append('hypara_path', hyperparametersResult);
	console.log(model);

	const response = await addModel(formData);
	const resultCode = response.resultCode || '';
	if (resultCode === 200) {
		ElMessage.success('模型上传成功');
	} else {
		ElMessage.error('模型上传失败');
	}
};

// 上传超参数
const uploadHyperparameters = async (model) => {
	const hyperparametersData = model.hyperparameters.reduce((acc, param) => {
		acc[param.name] = param.value;
		return acc;
	}, {});

	try {
		// 需要实现的超参数上传逻辑
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
</script>
