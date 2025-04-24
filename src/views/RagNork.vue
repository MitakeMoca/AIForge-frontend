<template>
	<header class="upperbar">
		<upperbar />
	</header>
	<aside class="sidebar" style="padding-top: 60px">
		<sidebar />
	</aside>
	<div class="ragnork-container">
		<div class="flow-container">
			<span class="buttons">
				<button
					@click="openKnowledgeDialog"
					style="background-color: #4caf50; margin-right: 30px"
				>
					添加知识领域
				</button>
				<button
					@click="openOtherModelDialog"
					style="background-color: #4f46e5"
				>
					添加辅助模型
				</button>
			</span>
			<VueFlow
				v-model:nodes="nodes"
				v-model:edges="edges"
				:fit-view="true"
				:zoom-on-scroll="false"
				:default-viewport="{ zoom: 0.8 }"
				:min-zoom="0.2"
			>
				<template #node-default="nodeProps">
					<div
						class="node"
						:class="'ragnork-' + nodeProps.data.norkType"
						@click="handleNodeClick(nodeProps)"
					>
						<div
							class="node-content"
							v-if="nodeProps.data.norkType == 'main'"
						>
							{{
								selectedMainModel
									? selectedMainModel.model_name
									: '请选择主模型'
							}}
						</div>
						<div v-else class="node-content">
							{{ nodeProps.data.label }}
						</div>
						<div
							class="node-handles"
							style="position: relative; top: -48px"
						>
							<!-- 左侧 Handle -->
							<Handle
								v-if="
									nodeProps.data.norkType != 'RAG' &&
									nodeProps.data.norkType != 'other'
								"
								type="target"
								:position="Position.Left"
								:id="`in-${nodeProps.id}`"
								style="left: -10px"
							/>
							<!-- 右侧 Handle -->
							<Handle
								v-if="nodeProps.data.norkType != 'other'"
								type="source"
								:position="Position.Right"
								:id="`out-${nodeProps.id}`"
								style="right: -10px"
							/>
							<!-- 上侧 Handle -->
							<Handle
								v-if="nodeProps.data.norkType == 'main'"
								type="source"
								:position="Position.Top"
								:id="`top-${nodeProps.id}`"
								style="top: -60px"
							/>
							<!-- 下侧 Handle -->
							<Handle
								v-if="nodeProps.data.norkType == 'other'"
								type="source"
								:position="Position.Bottom"
								:id="`top-${nodeProps.id}`"
								style="bottom: -60px"
							/>
						</div>
					</div>
				</template>
			</VueFlow>
		</div>

		<el-dialog
			v-model="inputDialogVisible"
			title="请输入 Prompt"
			width="30%"
			:before-close="handleClose"
		>
			<el-input
				v-model="inputValue"
				type="textarea"
				:rows="4"
				placeholder="请输入内容"
			></el-input>
			<span slot="footer" class="input-dialog-footer">
				<button @click="saveInput" style="background-color: #4caf50">
					保存输入
				</button>
				<button @click="runRagnork" style="background-color: #4f46e5">
					运行 RAGnork
				</button>
			</span>
		</el-dialog>

		<el-dialog
			v-model="mainModelDialogVisible"
			title="选择主模型"
			width="30%"
		>
			<el-select v-model="selectedMainModel" placeholder="请选择一个模型">
				<el-option
					v-for="model in mainModelList"
					:key="model.id"
					:label="model.model_name"
					:value="model"
				></el-option>
			</el-select>
			<span slot="footer" class="main-dialog-footer">
				<button
					@click="cancelMainModel"
					style="background-color: #4caf50"
				>
					保存
				</button>
			</span>
		</el-dialog>

		<el-dialog v-model="outputDialogVisible" title="输出内容" width="30%">
			<div>
				<p v-if="!outputText">正在推理中...</p>
				<p v-else>{{ outputText }}</p>
			</div>
			<span slot="footer" class="main-dialog-footer">
				<button
					@click="closeOutputDialog"
					style="background-color: #4f46e5"
				>
					关闭
				</button>
			</span>
		</el-dialog>

		<el-dialog
			v-model="knowledgeDialogVisible"
			title="选择知识领域"
			width="30%"
		>
			<el-select
				filterable
				v-model="selectedKnowledgeArea"
				placeholder="请选择一个知识领域"
			>
				<el-option
					v-for="area in availableKnowledgeAreas.filter(
						(area) =>
							!selectedKnowledgeAreas
								.map((a) => a)
								.includes(area),
					)"
					:key="area.id"
					:label="area.name"
					:value="area"
				></el-option>
			</el-select>
			<span slot="footer" class="main-dialog-footer">
				<button
					@click="addKnowledgeArea"
					style="background-color: #4caf50"
				>
					添加
				</button>
				<button
					@click="cancelKnowledgeArea"
					style="background-color: #4f46e5"
				>
					取消
				</button>
			</span>
		</el-dialog>

		<el-dialog
			v-model="othermodelDialogVisible"
			title="选择知识领域"
			width="30%"
		>
			<el-select
				filterable
				v-model="selectedModel"
				placeholder="请选择一个辅助模型"
			>
				<el-option
					v-for="area in otherAvailableModels.filter(
						(area) =>
							!otherSelectedModels.map((a) => a).includes(area),
					)"
					:key="area.id"
					:label="area.model_name"
					:value="area"
				></el-option>
			</el-select>
			<span slot="footer" class="main-dialog-footer">
				<button
					@click="addOtherModel"
					style="background-color: #4caf50"
				>
					添加
				</button>
				<button
					@click="cancelOtherModel"
					style="background-color: #4f46e5"
				>
					取消
				</button>
			</span>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { VueFlow, Handle, Position } from '@vue-flow/core';
import { ElButton, ElDialog } from 'element-plus';
import Sidebar from '@/components/Sidebar.vue';
import Upperbar from '@/components/Upperbar.vue';
import { findAllModel, RAGnork } from '@/service/model.js';
import { subjects } from '@/assets/data.ts';

onMounted(async () => {
	await fetchModelList();
	availableKnowledgeAreas.value = subjects;
	console.log(
		`output->availableKnowledgeAreas.value`,
		availableKnowledgeAreas.value,
	);
});

const availableModels = ref([]);
const selectedModels = ref([]);

const nodes = ref([
	{
		id: 'input',
		type: 'default',
		position: { x: 700, y: 350 },
		data: { label: '输入节点', norkType: 'input' },
	},
	{
		id: 'main',
		type: 'default',
		position: { x: 1000, y: 350 },
		data: { label: '主模型节点', norkType: 'main' },
	},
	{
		id: 'output',
		type: 'default',
		position: { x: 1300, y: 350 },
		data: { label: '输出节点', norkType: 'output' },
	},
]);

const edges = ref([
	{ id: 'e1-2', source: 'input', target: 'main' },
	{ id: 'e2-3', source: 'main', target: 'output' },
]);

const handleNodeClick = (nodeProps) => {
	const { id, data } = nodeProps;
	switch (data.norkType) {
		case 'input':
			inputDialogVisible.value = true;
			break;
		case 'main':
			mainModelDialogVisible.value = true; // 显示主模型的弹窗
			break;
		case 'output':
			outputDialogVisible.value = true;
			break;
		default:
			alert(`节点 ${id} 被点击，但未定义具体功能`);
	}
};

// 输入节点的部分
const inputDialogVisible = ref(false); // 控制弹窗的显示
const inputValue = ref(''); // 用户输入的内容

const saveInput = () => {
	// 保存输入内容的逻辑
	console.log('保存输入内容:', inputValue.value);
	inputDialogVisible.value = false;
};

const runRagnork = async () => {
	// 运行 RAGnork 的逻辑
	outputText.value = '';
	inputDialogVisible.value = false;
	outputText.value = (await RAGnork(inputValue.value)).data;
};

// 主模型节点的部分
const mainModelDialogVisible = ref(false); // 控制主模型弹窗的显示
const mainModelList = ref([]); // 主模型列表
const selectedMainModel = ref(null); // 选中的主模型

const fetchModelList = async () => {
	try {
		// 模拟从后端获取模型列表
		const data = await findAllModel();
		mainModelList.value = data.data;
		otherAvailableModels.value = data.data;
	} catch (error) {
		console.error('获取模型列表失败:', error);
		mainModelList.value = [];
	}
};

const cancelMainModel = () => {
	mainModelDialogVisible.value = false;
};

// 输出节点的部分
const outputDialogVisible = ref(false); // 控制输出弹窗的显示
const outputText = ref('我就是一个 Agent'); // 输出的文本内容
const closeOutputDialog = () => {
	outputDialogVisible.value = false;
};

// 添加知识领域的部分
const knowledgeDialogVisible = ref(false); // 控制知识领域弹窗的显示
const availableKnowledgeAreas = ref([]); // 所有知识领域
const selectedKnowledgeAreas = ref([]); // 已选择的知识领域
const selectedKnowledgeArea = ref(null); // 当前选中的知识领域
const fieldCnt = ref(0);

const openKnowledgeDialog = () => {
	knowledgeDialogVisible.value = true;
};

const addKnowledgeArea = () => {
	if (selectedKnowledgeArea.value) {
		const newNode = {
			id: `knowledge-${selectedKnowledgeArea.value}`,
			type: 'default',
			position: { x: 350, y: 50 + fieldCnt.value * 150 },
			data: {
				label: selectedKnowledgeArea.value,
				norkType: 'RAG',
			},
		};
		const newEdge = {
			id: `ki-${selectedKnowledgeArea.value}`,
			source: newNode.id,
			target: 'input',
		};
		fieldCnt.value = fieldCnt.value + 1;
		nodes.value.push(newNode);
		edges.value.push(newEdge);
		selectedKnowledgeAreas.value.push(selectedKnowledgeArea.value);
		selectedKnowledgeArea.value = null; // 清空当前选中项
		knowledgeDialogVisible.value = false;
	} else {
		alert('请选择一个知识领域');
	}
};

const cancelKnowledgeArea = () => {
	knowledgeDialogVisible.value = false;
};

// 添加辅助模型的部分
const othermodelDialogVisible = ref(false); // 控制知识领域弹窗的显示
const otherAvailableModels = ref([]); // 所有知识领域
const otherSelectedModels = ref([]); // 已选择的知识领域
const selectedModel = ref(null); // 当前选中的知识领域
const modelCnt = ref(0);

const openOtherModelDialog = () => {
	othermodelDialogVisible.value = true;
};

const addOtherModel = () => {
	if (selectedModel.value) {
		const newNode = {
			id: `other-model-${selectedModel.value.id}`,
			type: 'default',
			position: { x: 600 + modelCnt.value * 105, y: 50 },
			data: {
				label: selectedModel.value.model_name,
				norkType: 'other',
			},
		};
		const newEdge = {
			id: `om-${selectedModel.value.id}`,
			source: newNode.id,
			target: 'main',
			targetHandle: 'top-main',
		};
		modelCnt.value = modelCnt.value + 1;
		nodes.value.push(newNode);
		edges.value.push(newEdge);
		otherSelectedModels.value.push(selectedModel.value);
		selectedModel.value = null; // 清空当前选中项
		othermodelDialogVisible.value = false;
	} else {
		alert('请选择一个知识领域');
	}
};

const cancelOtherModel = () => {
	othermodelDialogVisible.value = false;
};
</script>

<style>
@import '@/assets/css/components/Bar.scss';
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
.ragnork-container {
	width: 100%;
	padding-left: 2%;
	padding-right: 2%;
	padding-top: 60px;
	margin-top: 5px;
	max-height: 70%;
}

.flow-container {
	width: 100%;
	height: 600px;
	border: 1px solid #ccc;
	margin-top: 20px;
}

.node {
	background-color: #666;
	color: white;
	padding: 10px;
	border-radius: 5px;
}

.vue-flow__node {
	background-color: #f0f0f0;
	border-radius: 5px;
	padding: 10px;
	border-color: #666;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	width: 142px;
	height: 142px;
}

.vue-flow__node .node {
	width: 100px;
	height: 100px;
}

.vue-flow__node .node .node-content {
	height: 96px;
	vertical-align: middle;
	text-align: center;
	font-size: 18px;
	color: #fff;
}

/* 自定义输入节点样式 */
.node.ragnork-input {
	background-color: #f0f0f0; /* 背景颜色 */
	border: 1px solid #ccc; /* 边框颜色 */
	border-radius: 10px; /* 圆角 */
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 阴影 */
	padding: 10px; /* 内边距 */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	cursor: pointer;
	transition: transform 0.2s ease-in-out; /* 鼠标悬停时的缩放效果 */
}

.node.ragnork-input .node-content {
	font-weight: bold;
	color: #333;
	text-align: center;
	margin-bottom: 10px;
}

.node.ragnork-input .node-handles {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.node.ragnork-input .node-handles .vue-flow__handle {
	width: 10px;
	height: 10px;
	background-color: #4caf50; /* 手柄颜色 */
	position: absolute;
	top: 50%;
	cursor: pointer;
}

.node.ragnork-input .node-handles .vue-flow__handle--left {
	left: 0;
}

.node.ragnork-input .node-handles .vue-flow__handle--right {
	right: 0;
}

.node.ragnork-main {
	background-color: #e0e0e0; /* 背景颜色 */
	border: 1px solid #9e9e9e; /* 边框颜色 */
	border-radius: 15px; /* 圆角 */
	box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2); /* 阴影 */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	cursor: pointer;
}

.node.ragnork-main .node-content {
	font-weight: bold;
	color: #333;
	text-align: center;
	margin-bottom: 10px;
}

.node.ragnork-main .node-handles {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.node.ragnork-main .node-handles .vue-flow__handle {
	width: 10px;
	height: 10px;
	background-color: #2196f3; /* 手柄颜色 */
	border-radius: 50%;
	border: 2px solid #fff; /* 手柄边框 */
	position: absolute;
	cursor: pointer;
}

.node.ragnork-main .node-handles .vue-flow__handle--left {
	left: 0;
}

.node.ragnork-main .node-handles .vue-flow__handle--right {
	right: 0;
}

.node.ragnork-output {
	background-color: #f5f5f5; /* 背景颜色 */
	border: 1px solid #dcdcdc; /* 边框颜色 */
	border-radius: 15px; /* 圆角 */
	box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); /* 阴影 */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	cursor: pointer;
}

.node.ragnork-output .node-content {
	font-weight: bold;
	color: #333;
	text-align: center;
	margin-bottom: 10px;
}

.node.ragnork-output .node-handles {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.node.ragnork-output .node-handles .vue-flow__handle {
	width: 10px;
	height: 10px;
	background-color: #ff9800; /* 手柄颜色 */
	border-radius: 50%;
	border: 2px solid #fff; /* 手柄边框 */
	position: absolute;
	cursor: pointer;
}

.node.ragnork-output .node-handles .vue-flow__handle--left {
	left: 0;
}

.node.ragnork-output .node-handles .vue-flow__handle--right {
	right: 0;
}

.input-dialog-footer button,
.main-dialog-footer button,
.buttons button {
	color: white;
	padding: 0.5rem 1rem;
	border-radius: 0.125rem;
	border: none;
	cursor: pointer;
	margin-right: 20px;
	margin-top: 15px;
}

.buttons {
	float: right;
}
</style>
