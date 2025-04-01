<template>
	<el-container style="height: 100vh">
		<!-- 返回按钮 -->
		<el-button type="danger" @click="exitDocker()" class="elButtonGoBack">
			退出运行
		</el-button>

		<div class="action-buttons">
			<el-button type="success" @click="startDocker('train')">
				开始训练
			</el-button>
			<el-button type="info" @click="startDocker('test')">
				开始测试
			</el-button>
			<el-button type="danger" @click="deriveModel()">
				导出模型
			</el-button>
		</div>

		<el-aside width="30%">
			<div class="project-filter-container">
				<h2>项目信息</h2>
				<p><strong>名称:</strong> {{ stata.project.project_name }}</p>
				<p><strong>状态:</strong> {{ stata.project.status }}</p>
				<p><strong>描述:</strong> {{ stata.project.description }}</p>
				<p>
					<strong>创建时间:</strong> {{ stata.project.create_time }}
				</p>
				<p>
					<strong>更改时间:</strong> {{ stata.project.update_time }}
				</p>
				<div class="hyperparameters">
					<h2>更改超参</h2>
					<el-row
						v-for="(value, key) in stata.hyperparameters"
						:key="key"
						class="hyperparameter-item"
					>
						<el-col :span="8">
							<strong>{{ key }}</strong>
						</el-col>
						<el-col :span="16">
							<el-input
								v-model="stata.hyperparameters[key]"
								size="small"
								placeholder="请输入值"
							/>
						</el-col>
					</el-row>
					<div class="save-button">
						<el-button
							type="primary"
							@click="saveHyperparameters()"
							style="margin-top: 10px"
							>保存</el-button
						>
					</div>
				</div>
				<h2>项目文件</h2>

				<FolderTree
					:dataSource="fileData"
					@file-clicked="handleFileClicked"
				/>
			</div>
			<div class="download">
				<el-button type="primary" @click="downloadFile('trainData')"
					>下载训练数据</el-button
				>
				<el-button type="primary" @click="downloadFile('testData')"
					>下载测试数据</el-button
				>
			</div>
		</el-aside>

		<el-main>
			<el-tabs v-model="activeTab">
				<el-tab-pane label="文件界面" name="files">
					<div class="tab-content">
						<!-- 文件展示区域 -->
						<div v-if="fileContent">
							<!-- 根据文件类型判断展示方式 -->
							<div v-if="isTextFile" class="file-content">
								<pre><code ref="codeBlock" class="language-python">{{ fileContent }}</code></pre>
							</div>
							<div v-if="isImageFile" class="file-content">
								<img
									:src="fileContent"
									alt="image"
									class="file-image"
								/>
							</div>
						</div>
					</div>
				</el-tab-pane>

				<el-tab-pane label="训练日志" name="logs">
					<TrainingLog :logs="logs" />
				</el-tab-pane>

				<!-- 项目聊天界面 -->
				<el-tab-pane label="项目工作" name="chat">
					<div class="chat-container">
						<!-- Chat Area -->
						<el-main class="chat-main">
							<div
								v-for="msg in messages"
								:key="msg.id"
								class="message"
								:class="msg.type"
							>
								<!--                <p v-if="msg.type === 'text'" class="message-text">-->
								<!--                  <span v-html="md.render(msg.content)"></span>-->
								<!--                </p>-->
								<div
									v-if="msg.type === 'text'"
									v-html="renderMarkdown(msg.content)"
									class="message-text"
								></div>
								<img
									v-if="msg.type === 'image'"
									:src="msg.content"
									alt="Project Response"
									class="message-image"
								/>
								<p
									v-if="msg.type === 'user'"
									class="message-user"
								>
									{{ msg.content }}
								</p>
							</div>
						</el-main>

						<!-- Input Area -->
						<el-footer class="chat-footer">
							<el-input
								v-model="userInput"
								placeholder="聊点什么..."
								@keyup.enter="sendMessage"
								:rows="1"
							/>
							<el-button
								@click="sendMessage"
								type="primary"
								style="height: 100%"
								>发送</el-button
							>
						</el-footer>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-main>
	</el-container>
</template>

<script setup>
import { ref, onMounted, reactive, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FolderTree from '@/components/FolderTree.vue';
import TrainingLog from '@/components/project/TrainingLog.vue';
import { getFolderTree, getProject } from '@/service/project';
import { downloadData } from '@/service/dataset';
import {
	runDocker,
	stopDocker,
	createDocker,
	project2model,
} from '@/service/project';
import {
	findHyparaByPath,
	getHyparasByProjectId,
	addHyparaOfProject,
} from '@/service/hypara';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getLocal } from '@/utils/local';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import { getFile, getPicture } from '@/service/project';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import Blob from 'blob-polyfill';
import axios from 'axios'; // 用于请求文件内容
import MarkdownIt from 'markdown-it';
import texmath from 'markdown-it-texmath';
import katex from 'katex';
import { Client } from '@stomp/stompjs';

const md = new MarkdownIt({
	html: true, // 启用 HTML 标签解析
	linkify: true, // 自动将 URL 转为链接
	typographer: true, // 启用智能排版
}).use(texmath, {
	engine: katex,
	delimiters: [
		'dollars',
		'brackets',
		'doxygen',
		'gitlab',
		'julia',
		'kramdown',
		'beg_end',
	],
	katexOptions: { macros: { '\\RR': '\\mathbb{R}' } },
});
const codeBlockRef = ref(null);
const route = useRoute();
const router = useRouter();
const stata = reactive({
	userId: '',
	project: {
		projectId: 0,
		projectName: 'NAME',
		status: 'init',
		description: 'This is a description of the AI model training project.',
		createTime: '',
		updateTime: '',
		visibility: '',
		storePath: '',
		modelId: 0,
		train_DatasetId: 0,
		test_DatasetId: 0,
	},
	hyperparameters: {},
});

const logs = ref([
	// { id: 1, message: "[12:00:00] - Training started..." },
	// { id: 2, message: "[12:05:00] - Epoch 1 completed." },
	// { id: 3, message: "[12:10:00] - Epoch 2 completed." },
]);
let isConnected = false;

const messages = ref([
	// { id: 1, type: 'text', content: '欢迎使用支持 LaTeX 的 Markdown 聊天！\n\n这里有一些数学公式示例：\n\n$E = mc^2$\n\n这是一个多行数学表达式：\n\n$$\n\\log_2(8) = x \\\\\n2^x = 8 \\\\\nx = \\log_2(8)\n$$\n\n因此，答案是 3。\n\n行内公式：$a \\times b = c$' },
	// { id: 2, type: 'user', content: '这是一条用户消息' },
	// { id: 3, type: 'text', content: 'Qwen: 在数学中，我们定义 \\( \\log_b(a) \\) 表示以 \\( b \\) 为底 \\( a \\) 的对数。对于 \\( a = 8 \\)，我们需要找到一个底数 \\( b \\)，使得 \\( b^a = 8 \\)。\n' +
	//       '\n' +
	//       '首先，我们知道 \\( 2^3 = 8 \\)，因为 \\( 2 \\times 2 \\times 2 = 8 \\)。\n' +
	//       '\n' +
	//       '因此，\\( \\log_2(8) = 3 \\)。\n' +
	//       '\n' +
	//       '所以，\\(\\log_2(8)\\) 等于 3。' },
	// { id: 4, type: 'text', content: '以下是一个表格：\n\n| 列1 | 列2 |\n|-----|-----|\n| 单元格1 | 单元格2 |\n\n这是一个 [链接](https://example.com) 和一些 `行内代码`。' },
]); // 用于存储聊天消息
const userInput = ref(''); // 用户输入的消息
const activeTab = ref('files');

let stompClient = null;
const fileData = ref([]); // 文件树数据
const fileContent = ref(null); // 文件内容
const isTextFile = ref(false);
const isImageFile = ref(false);
let intervalId = null;

onMounted(async () => {
	stata.userId = getLocal('userId');
	// if (stata.userId == null || stata.userId == "") {
	//   router.push("/");
	// }
	await fetchData();
	const getHyparaByProjectIdResponse = await getHyparasByProjectId(
		Number(stata.project.project_id),
	);
	stata.hyperparameters = getHyparaByProjectIdResponse.data;
	console.log(stata.hyperparameters);

	// 定期重新调用 fetchData
	intervalId = setInterval(fetchData, 10000); // 修改间隔时间为需要的毫秒数

	// 在组件挂载后加载 KaTeX CSS
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/katex.min.css';
	document.head.appendChild(link);
	const currentDate = new Date();
	const formattedTime = currentDate.toLocaleTimeString();
	handleLogMessage({
		message_id: 1,
		timestamp: formattedTime,
		message: 'accuracy: 0.02',
		entry: 'system',
	});
	handleLogMessage({
		message_id: 2,
		timestamp: formattedTime,
		message: 'accuracy: 0.03',
		entry: 'info',
	});
	handleLogMessage({
		message_id: 3,
		timestamp: formattedTime,
		message: 'accuracy: 0.03',
		entry: 'error',
	});
	handleLogMessage({
		message_id: 4,
		timestamp: formattedTime,
		message: 'accuracy: 0.03',
		entry: 'warning',
	});
	handleLogMessage({
		message_id: 5,
		timestamp: formattedTime,
		message: 'accuracy: 0.03',
		entry: 'info',
	});
	connectWebSocket();
});

onUnmounted(async () => {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
});

const renderMarkdown = (content) => {
	return md.render(content);
};

const fetchData = async () => {
	try {
		const { id } = route.params;
		stata.project.projectId = id;
		const getProjectResponse = await getProject({
			ProjectId: Number(stata.project.projectId),
		});
		stata.project = getProjectResponse.data;

		const getFolderTreeResponse = await getFolderTree(
			Number(stata.project.project_id),
		);
		fileData.value = getFolderTreeResponse.data;
	} catch (error) {
		console.error('数据获取失败:', error);
	}
};

const saveHyperparameters = async () => {
	const newObject = {
		ProjectId: stata.project.projectId,
		...stata.hyperparameters,
	};
	const addHyparaOfProjectResponse = await addHyparaOfProject(newObject);
	if (addHyparaOfProjectResponse.resultCode == 200) {
		ElMessage.success('保存成功');
	} else {
		ElMessage.error('保存失败');
	}

	await fetchData();
};

let isTrain = false;
const startDocker = async (command) => {
	if (isTrain) {
		ElMessage.error('正在运行中, 请等待运行结束');
		return;
	}
	isTrain = true;
	console.log('command: ' + command);
	console.log('id: ' + stata.project.status);

	activeTab.value = 'logs';
	if (
		stata.project.status == 'init' ||
		stata.project.status == 'stopped' ||
		stata.project.status == 'finished' ||
		stata.project.status == 'wait'
	) {
		const createDockerResponse = await createDocker(
			Number(stata.project.project_id),
		);
		if (
			createDockerResponse.resultCode != 200 &&
			['403'].includes(createDockerResponse.data)
		) {
			ElMessage.error('启动失败, 请重试');
			return;
		}
	} else if (stata.project.status == 'running') {
		// 一般情况下不会出现，出现的时候需要先暂停运行
		const stopDockerResponse = await stopDocker(
			Number(stata.project.projectId),
		);
		const createDockerResponse = await createDocker(
			Number(stata.project.project_id),
		);
		if (createDockerResponse.resultCode != 200) {
			ElMessage.error('启动失败, 请重试');
			return;
		}
	}

	const getHyparaByProjectIdResponse = await getHyparasByProjectId(
		Number(stata.project.project_id),
	);
	console.log(getHyparaByProjectIdResponse);
	if (
		getHyparaByProjectIdResponse.data == null ||
		getHyparaByProjectIdResponse.data.length == 0
	) {
		ElMessage.error('没有超参路径！');
		return;
	}

	const findHyparaByPathResponse = getHyparaByProjectIdResponse;
	if (
		findHyparaByPathResponse.data == null ||
		findHyparaByPathResponse.data == {}
	) {
		ElMessage.error('超参为空！');
		return;
	}

	console.log(`output->`, {
		project_id: Number(stata.project.project_id),
		command: command + '.py',
		hypara: findHyparaByPathResponse.data,
	});
	if (!isConnected) {
		console.log('WebSocket 未连接，正在尝试连接...');
		connectWebSocket();
	}
	const runDockerResponse = await runDocker({
		project_id: Number(stata.project.project_id),
		command: command + '.py',
		hypara: findHyparaByPathResponse.data,
	});
	console.log(runDockerResponse);
	if (runDockerResponse.resultCode == 200) {
		ElMessage.success(command == 'train' ? '开始训练' : '开始测试');
	} else {
		ElMessage.error('无法运行!');
		return;
	}
	await fetchData();

	isTrain = false;
};

const exitDocker = async () => {
	if (
		stata.project.status == 'wait' ||
		stata.project.status == 'finished' ||
		stata.project.status == 'running'
	) {
		ElMessage.success('正在关闭环境, 这可能需要一段时间...');
		const stopDockerResponse = await stopDocker(
			Number(stata.project.projectId),
		);
		if (stopDockerResponse.resultCode != 200) {
			ElMessage.error('停止失败');
		}
	}
	ElMessage.success('停止成功, 正在返回...');
	setTimeout(() => {
		router.go(-1);
	}, 500);
};

const deriveModel = async () => {
	try {
		const confirm = await ElMessageBox.confirm(
			'确定要导出模型吗？此操作可能需要一段时间。',
			'确认操作',
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			},
		);

		// 如果用户点击 "确定"
		if (confirm) {
			const project2modelResponse = await project2model({
				ProjectId: Number(stata.project.projectId),
			});

			if (project2modelResponse.resultCode === 200) {
				ElMessage.success('导出模型成功！');
			} else {
				ElMessage.error(
					`导出模型失败: ${project2modelResponse.message}`,
				);
			}
		}
	} catch (error) {
		// 用户点击 "取消" 或出现异常
		if (error !== 'cancel') {
			console.error('模型推导时出错:', error);
			ElMessage.error('发生错误，请稍后再试！');
		}
	}
};

const connectWebSocket = () => {
	const socketUrl = 'ws://localhost:8084/ws'; // 用 WebSocket 协议
	const socket = new WebSocket(socketUrl);

	// WebSocket 连接成功时的回调
	socket.onopen = () => {
		isConnected = true;
		console.log('Connected to WebSocket');
		socket.send(JSON.stringify({ message: 'Hello from frontend' }));
		// 发送订阅请求或初始化操作
		subscribeToLogs(socket);
		subscribeToChat(socket);
	};

	// WebSocket 收到消息时的回调
	socket.onmessage = (event) => {
		console.log('Message from server:', event.data);
		const message = JSON.parse(event.data);
		if (message.type === 'log') {
			handleLogMessage(message);
		} else if (message.type === 'chat') {
			handleChatMessage(message);
		}
	};

	// WebSocket 连接关闭时的回调
	socket.onclose = () => {
		console.log('WebSocket connection closed');
	};

	// WebSocket 发生错误时的回调
	socket.onerror = (error) => {
		console.log('WebSocket error occurred:', error);
		console.log('Error message:', error.message); // 查看详细错误消息
		console.log('Error stack:', error.stack); // 查看错误的调用栈
	};
};

// 订阅日志消息
const subscribeToLogs = (socket) => {
	const message = JSON.stringify({
		action: 'subscribe',
		channel: `/topic/logs/project_${stata.project.project_id}`,
	});
	socket.send(message); // 发送订阅请求
};

// 订阅聊天消息
const subscribeToChat = (socket) => {
	const message = JSON.stringify({
		action: 'subscribe',
		channel: `/topic/chat/project_${stata.project.project_id}`,
	});
	socket.send(message); // 发送订阅请求
};

let logsSet = new Set();
// 处理日志消息
const handleLogMessage = (message) => {
	console.log(`output->messgea`, message);
	const newLog = message;
	if (logsSet.has(newLog.message_id)) return;
	logs.value.push({
		id: logs.value.length + 1,
		timestamp: newLog.timestamp,
		message: newLog.message,
		entry: newLog.entry,
	});
	logsSet.add(newLog.message_id);
	console.log(`output->logs`, logs);
};

// 处理聊天消息
const handleChatMessage = (message) => {
	const response = message;
	console.log(response.message);
	messages.value.push({
		id: Date.now(),
		type: 'text',
		content: response.message,
	});
};

// 发送消息
const sendMessage = async () => {
	if (stata.project.status == 'init' || stata.project.status == 'stopped') {
		const createDockerResponse = await createDocker(
			Number(stata.project.project_id),
		);
		if (
			createDockerResponse.resultCode != 200 &&
			['403'].includes(createDockerResponse.data)
		) {
			ElMessage.error('启动失败, 请重试');
			return;
		}
	} else if (stata.project.status == 'running') {
		ElMessage.error('项目正在工作, 请稍后再试');
		return;
	}
	if (!isConnected) {
		console.log('WebSocket 未连接，正在尝试连接...');
		connectWebSocket(); // 尝试连接 WebSocket
	}
	if (userInput.value.trim()) {
		const runDockerResponse = await runDocker({
			Project_id: Number(stata.project.projectId),
			command: 'predict.py',
			hypara: { message: userInput.value },
		});
		console.log(runDockerResponse);

		// 将用户输入添加到聊天记录
		messages.value.push({
			id: Date.now(),
			type: 'user',
			content: userInput.value,
		});
		userInput.value = ''; // 清空输入框
	}
};

// 文件点击事件
const handleFileClicked = async (fileInfo) => {
	activeTab.value = 'files';

	const filePath = fileInfo.path;
	const fileExtension = filePath.split('.').pop();

	try {
		if (fileExtension === 'py' || fileExtension === 'txt') {
			const response = await getFile({
				FilePath: 'project/' + stata.project.projectId + '/' + filePath,
			});
			fileContent.value = response.data.fileContent;
			isTextFile.value = true;
			isImageFile.value = false;

			nextTick(() => {
				const codeBlock = codeBlockRef.value; // 使用 ref 引用 code 标签
				if (codeBlock) {
					hljs.highlightElement(codeBlock);
				}
			});
		} else if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
			const response = await getPicture({
				Path: 'project/' + stata.project.projectId + '/' + filePath,
			});
			console.log(response);
			// 将响应内容作为 Blob 数据处理
			const blob = response; // 直接从 response 获取 Blob
			fileContent.value = URL.createObjectURL(blob); // 转为 URL 存入 ref
			isTextFile.value = false;
			isImageFile.value = true;
		} else {
			ElMessage.error('不支持的文件类型');
		}
	} catch (error) {
		ElMessage.error('无法加载文件内容');
	}
};

// 文件下载逻辑
const downloadFile = async (type) => {
	try {
		let downloadDataResponse;
		if (type == 'trainData') {
			downloadDataResponse = await downloadData({
				DatasetId: stata.project.train_DatasetId,
			});
		} else {
			downloadDataResponse = await downloadData({
				DatasetId: stata.project.test_DatasetId,
			});
		}

		const link = document.createElement('a');
		link.href = URL.createObjectURL(downloadDataResponse);
		link.download = `${
			type === 'trainData'
				? stata.project.train_DatasetId
				: stata.project.test_DatasetId
		}.zip`;
		link.click();

		// 释放 URL 对象
		URL.revokeObjectURL(link.href);
	} catch (error) {
		ElMessage.error('下载失败');
	}
};
</script>

<style scoped>
.elButtonGoBack {
	position: fixed;
	left: 15px;
	top: 10px;
	z-index: 10;
	/* 确保按钮在最上层 */
}

.action-buttons {
	position: fixed;
	top: 10px;
	right: 10px;
	display: flex;
	gap: 10px;
	z-index: 10;
}

.el-aside {
	display: flex;
	flex-direction: column;
	background-color: #f4f4f4;
	padding: 20px;
	overflow-y: auto;
	justify-content: space-between;
}

.action-button {
	padding: 10px;
}

.el-main {
	background-color: #fff;
	padding: 20px;
	overflow-y: auto;
}

.project-filter-container {
	margin-bottom: 20px;
}

.hyperparameters {
	padding: 10px;
}

.download {
	justify-content: flex-end;
}
.tab-content {
	padding: 20px;
	background-color: #f9f9f9;
	border-radius: 5px;
}

.action-button {
	padding: 10px;
}

.file-content {
	white-space: pre-wrap;
	/* 保持空白符，自动换行 */
	word-wrap: break-word;
	/* 长单词或URL自动换行 */
	background-color: #f5f5f5;
	/* 背景色 */
	padding: 20px;
	/* 内边距 */
	border: 1px solid #ddd;
	/* 边框 */
	border-radius: 4px;
	/* 边框圆角 */
	overflow: auto;
	/* 超出部分显示滚动条 */
	max-height: 500px;
	/* 最大高度 */
	line-height: 1.6;
	/* 行高 */
	font-size: 14px;
	/* 字体大小 */
	text-align: left;
	/* 文本左对齐 */
}

.file-image {
	max-width: 100%;
	/* 图片最大宽度为容器宽度 */
	height: auto;
	/* 高度自适应，保持图片比例 */
	display: block;
	/* 去除图片下方的空白间隙 */
	margin: 0 auto;
	/* 图片居中显示 */
	border-radius: 4px;
	/* 图片圆角 */
	border: 1px solid #ddd;
	/* 图片边框 */
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	/* 图片阴影 */
	transition: all 0.3s ease;
	/* 图片过渡效果 */
}

.file-image:hover {
	transform: scale(1.05);
	/* 鼠标悬停时图片放大 */
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	/* 鼠标悬停时阴影加深 */
}

.chat-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	margin-bottom: 48px;
}

.chat-main {
	flex-grow: 1;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	/* Ensure space for footer */
}

.chat-footer {
	padding: 10px;
	width: 67%;
	background: #fff;
	border-top: 1px solid #ddd;
	position: fixed;
	bottom: 0;
	display: flex;
}

.message {
	padding: 3px 13px;
	border-radius: 10px;
	max-width: 70%;
	word-wrap: break-word;
	white-space: pre-wrap;
}

.message.text {
	background-color: #f1f1f1;
	color: black;
	text-align: left;
	align-self: flex-start;
	margin: 6px 0px 12px;
	/* 回答消息靠左 */
}

.message.image img {
	max-width: 100%;
	height: auto;
	text-align: left;
	align-self: flex-start;
	margin: 6px 0px 12px;
	/* 回答消息靠左 */
}

.message.user {
	background-color: #007bff;
	color: white;
	text-align: left;
	align-self: flex-end;
	margin-bottom: 12px;
	/* 用户消息靠右 */
}

.el-button {
	margin-left: 10px;
}

/* 添加一些基本的 Markdown 样式 */
:deep(.message-text) {
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin-top: 1em;
		margin-bottom: 0.5em;
	}

	p {
		margin-bottom: 1em;
	}

	code {
		background-color: #f0f0f0;
		padding: 2px 4px;
		border-radius: 4px;
	}

	pre {
		background-color: #f0f0f0;
		padding: 10px;
		border-radius: 4px;
		overflow-x: auto;
	}

	table {
		border-collapse: collapse;
		width: 100%;
	}

	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
	}

	th {
		background-color: #f2f2f2;
	}

	/* 添加数学公式样式 */
	.katex-display {
		margin: 1em 0;
		overflow-x: auto;
		overflow-y: hidden;
	}
}
</style>
