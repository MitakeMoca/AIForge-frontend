<template>
	<div class="dialog-wrapper">
		<div class="dialog">
			<div class="dialog-header">
				<h3>创建数据集</h3>
				<button class="close-btn" @click="endCreate">×</button>
			</div>

			<div class="dialog-body">
				<div class="form-item">
					<label><span class="required">数据集名称</span></label>
					<input
						type="text"
						v-model="name"
						placeholder="为您的数据集起个名字，最多40个字"
					/>
				</div>

				<div class="form-item">
					<label><span class="required">上传数据集</span></label>
					<div class="upload-area">
						<button class="upload-btn" @click="triggerFileUpload">
							<span>↑</span> 上传文件
						</button>
						<input
							type="file"
							ref="fileInput"
							style="display: none"
							@change="handleFileChange"
							multiple
							accept=".zip"
						/>
					</div>
					<ul class="file-list">
						<li v-for="file in files" :key="file.name">
							{{ file.name }} ({{ formatSize(file.size) }})
							<button
								class="delete-btn"
								@click="removeFile(file)"
							>
								×
							</button>
						</li>
					</ul>
					<div class="upload-tips">
						<p>1.最多上传10个文件</p>
						<p>2.总体积不超过50GB，文件名不超过150字</p>
					</div>
				</div>

				<div class="form-item">
					<label><span class="required">标签</span></label>
					<select v-model="formData.tag">
						<option value="" disabled selected hidden>
							请选择标签
						</option>
						<option
							v-for="option in options"
							:key="option"
							:value="option"
						>
							{{ option }}
						</option>
					</select>
				</div>

				<div class="form-item">
					<label><span class="required">简介描述</span></label>
					<textarea
						v-model="formData.description"
						placeholder="此数据集包含什么内容，可做什么用途，最多200个字"
					></textarea>
				</div>
			</div>

			<div class="dialog-footer">
				<button class="confirm-btn" @click="submitData()">确定</button>
				<button class="cancel-btn" @click="endCreate()">取消</button>
			</div>
			<el-progress
				:text-inside="true"
				:stroke-width="26"
				:percentage="uploadProgress"
				:format="progressFormat"
				v-if="uploading"
			/>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import JSZip, { forEach } from 'jszip';
import axios from 'axios';
import { ElProgress, ElButton, ElDialog } from 'element-plus';
import { getLocal } from '@/utils/local';

const options = [
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
const uploading = ref(false);
const uploadProgress = ref(0);

const progressFormat = (percentage) => {
	return percentage === 100 ? '上传完成' : `${percentage}%`;
};

//数据集名称
const name = ref('');

//数据集标签和描述
const formData = ref({
	tag: '',
	description: '',
});

import { defineEmits } from 'vue';
const emit = defineEmits(['closeCreate']);

//关闭上传数据集页面
const endCreate = () => {
	emit('closeCreatePage');
};

const fileInput = ref(null);
const files = ref([]);
const selectedFile = ref(null);

const triggerFileUpload = () => {
	fileInput.value.click();
};

const handleFileChange = (event) => {
	const uploadedFiles = Array.from(event.target.files);
	files.value = [];
	// 清空 input 元素的值
	uploadedFiles.forEach((file) => {
		const reader = new FileReader();
		reader.onload = () => {
			// 读取文件内容并存储到 files 列表中
			files.value.push(file);
		};
		reader.readAsDataURL(file);
	});
};

//这个方法用来获取用户上传文件的总大小
const totalSize = computed(() => {
	return files.value.reduce((total, file) => total + file.size, 0);
});
//这个函数用来删除所选的函数
const removeFile = (file) => {
	const index = files.value.indexOf(file);
	if (index !== -1) {
		files.value.splice(index, 1);
	}
};

const formatSize = (size) => {
	if (size < 1024) return `${size} B`;
	if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
	return `${(size / 1024 / 1024).toFixed(2)} MB`;
};

const clearFormData = (formData) => {
	for (const key of formData.keys()) {
		formData.delete(key);
	}
};

//点击确定按钮之后的逻辑处理
const submitData = async () => {
	if (!name.value.trim()) {
		// 弹出错误提示框
		ElMessage({
			message: '数据集名称不能为空',
			type: 'error',
		});
		return; // 终止函数
	}

	if (files.value.length === 0) {
		// 弹出错误提示框
		ElMessage({
			message: '请上传文件',
			type: 'error',
		});
		return; // 终止函数
	}

	if (files.value.length > 10) {
		// 弹出错误提示框
		ElMessage({
			message: '最多上传10个文件',
			type: 'error',
		});
		return; // 终止函数
	}

	//标签不能为空
	if (!formData.value.tag) {
		// 弹出错误提示框
		ElMessage({
			message: '标签不能为空',
			type: 'error',
		});
		return; // 终止函数
	}

	//简介描述不能为空
	if (!formData.value.description) {
		// 弹出错误提示框
		ElMessage({
			message: '简介描述不能为空',
			type: 'error',
		});
		return; // 终止函数
	}
	const data = {
		ProjectId: -1,
		DataSetName: name.value,
		DataType: 'ZIP',
		DataSize: parseFloat(formatSize(totalSize.value)),
		Label: formData.value.tag,
		UserId: getLocal('userId'),
		Introduction: formData.value.description,
		DataUrl: './root/data/dataset/37',
	};

	const response2 = await axios.post('/Dataset/add', data);
	uploading.value = true;
	uploadProgress.value = 0;

	const formData2 = new FormData();

	formData2.append('file', files.value[0]);
	formData2.append('UserId', getLocal('userId'));
	try {
		console.log('开始上传');
		const response = await axios.post('/Dataset/uploadFile', formData2, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			onUploadProgress: (progressEvent) => {
				const percentCompleted = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total,
				);
				uploadProgress.value = percentCompleted;
			},
		});

		console.log('上传成功', response.message);
		ElMessage({
			message: '提交成功',
			type: 'success',
		});
		clearFormData(formData2);

		//开始文件传输
	} catch (error) {
		console.error('提交失败:', error);
		ElMessage({
			message: response.data.message,
			type: 'error',
		});
	} finally {
		uploading.value = false;
		files.value = [];
	}
	emit('closeCreatePage');
};
</script>

<style scoped>
.dialog-wrapper {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.el-progress--line {
	margin-top: 20px;
	width: 100%;
	z-index: 1001;
}

.dialog {
	width: 480px;
	background: white;
	border-radius: 8px;
	padding: 24px;
}

.dialog-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
}

.dialog-header h3 {
	margin: 0;
	font-size: 16px;
	color: #333;
}

.close-btn {
	border: none;
	background: none;
	font-size: 20px;
	color: #999;
	cursor: pointer;
	padding: 4px;
}

.form-item {
	margin-bottom: 20px;
}

.form-item label {
	display: block;
	margin-bottom: 8px;
	font-size: 14px;
	color: #333;
}

.required::before {
	content: '*';
	color: #f56c6c;
	margin-right: 4px;
}

input[type='text'],
select,
textarea {
	width: 100%;
	padding: 8px 12px;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	font-size: 14px;
	box-sizing: border-box;
}

.upload-area {
	border: 1px dashed #dcdfe6;
	border-radius: 4px;
	padding: 20px;
	text-align: center;
}

.upload-btn {
	background: none;
	border: none;
	color: #666;
	cursor: pointer;
	font-size: 14px;
}

.upload-btn span {
	margin-right: 8px;
}

.upload-tips {
	margin-top: 8px;
	font-size: 12px;
	color: #999;
}

.upload-tips p {
	margin: 4px 0;
}

.radio-group {
	margin-bottom: 8px;
}

.radio {
	margin-right: 20px;
	cursor: pointer;
}

.radio input {
	margin-right: 4px;
}

.tip-text {
	font-size: 12px;
	color: #999;
	margin: 4px 0;
}

textarea {
	height: 100px;
	resize: vertical;
}

.dialog-footer {
	margin-top: 24px;
	text-align: center;
}

.confirm-btn,
.cancel-btn {
	padding: 8px 32px;
	border-radius: 4px;
	font-size: 14px;
	cursor: pointer;
	margin: 0 8px;
}

.confirm-btn {
	background: #4318ff;
	color: white;
	border: none;
}

.cancel-btn {
	background: white;
	border: 1px solid #dcdfe6;
	color: #333;
}

.file-list {
	display: flex;
	flex-wrap: wrap; /* 如果文件多于一行，可以换行显示 */
	list-style: none; /* 去掉列表的默认样式 */
	padding: 0;
}

.file-list li {
	margin-right: 10px; /* 每个文件条目之间的间距 */
	font-size: 12px; /* 设置字体大小 */
}

.delete-btn {
	background: none;
	border: none;
	color: red;
	font-size: 16px;
	cursor: pointer;
	padding: 0;
}
</style>
