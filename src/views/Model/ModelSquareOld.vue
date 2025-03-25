<template>
	<upperbar />
	<sidebar />
	<div style="width: 90%">
		<el-container style="height: 80vh">
			<el-aside
				width="250px"
				style="background-color: #f5f7fa; padding: 20px"
			>
				<h2>模型库</h2>
				<div style="height: 20px"></div>
				<!-- 热门任务 -->
				<div>
					<h3>热门任务</h3>
					<el-row :gutter="10">
						<el-col :span="12" v-for="task in hotTasks" :key="task">
							<el-button
								:type="selectedButton === task ? 'primary' : ''"
								@click="toggleSelection(task)"
								style="width: 100%"
							>
								{{ task }}
							</el-button>
						</el-col>
					</el-row>
				</div>
				<div style="height: 20px"></div>
				<!-- 模型类型 -->
				<div>
					<h3>模型类型</h3>
					<el-row :gutter="10">
						<el-col
							:span="12"
							v-for="type in modelTypes"
							:key="type"
						>
							<el-button
								:type="selectedButton === type ? 'primary' : ''"
								@click="toggleSelection(type)"
								style="width: 100%"
							>
								{{ type }}
							</el-button>
						</el-col>
					</el-row>
				</div>
				<div style="height: 20px"></div>
				<!-- 计算机视觉 -->
				<div>
					<h3>计算机视觉</h3>
					<el-row :gutter="10">
						<el-col
							:span="12"
							v-for="vision in visionTasks"
							:key="vision"
						>
							<el-button
								:type="
									selectedButton === vision ? 'primary' : ''
								"
								@click="toggleSelection(vision)"
								style="width: 100%"
							>
								{{ vision }}
							</el-button>
						</el-col>
					</el-row>
				</div>
				<div style="height: 20px"></div>

				<!-- 自然语言处理 -->
				<div>
					<h3>自然语言处理</h3>
					<el-row :gutter="10">
						<el-col :span="12" v-for="nlp in nlpTasks" :key="nlp">
							<el-button
								:type="selectedButton === nlp ? 'primary' : ''"
								@click="toggleSelection(nlp)"
								style="width: 100%"
							>
								{{ nlp }}
							</el-button>
						</el-col>
					</el-row>
				</div>
				<div style="height: 20px"></div>
				<!-- 语音 -->
				<div>
					<h3>语音</h3>
					<el-row :gutter="10">
						<el-col
							:span="12"
							v-for="speech in speechTasks"
							:key="speech"
						>
							<el-button
								:type="
									selectedButton === speech ? 'primary' : ''
								"
								@click="toggleSelection(speech)"
								style="width: 100%"
							>
								{{ speech }}
							</el-button>
						</el-col>
					</el-row>
				</div>
			</el-aside>

			<el-container>
				<el-header
					style="
						background-color: #f5f7fa;
						padding: 10px;
						display: flex;
						align-items: center;
						justify-content: space-between;
					"
				>
					<div style="display: flex; align-items: center">
						<el-input
							placeholder="请输入关键词搜索"
							style="
								width: 300px;
								margin-left: 30px;
								margin-right: 20px;
							"
						></el-input>
						<el-select
							v-model="selected"
							placeholder="选择排序方式"
						>
							<el-option
								label="按综合排序"
								value="综合"
							></el-option>
							<el-option
								label="按更新时间"
								value="更新时间"
							></el-option>
							<el-option
								label="按点赞数量"
								value="点赞数量"
							></el-option>
							<el-option
								label="按浏览量"
								value="浏览量"
							></el-option>
						</el-select>
					</div>
					<el-button type="primary">创建模型</el-button>
				</el-header>

				<el-main style="padding: 20px">
					<div class="model-square">
						<div class="grid">
							<div
								v-for="model in models"
								:key="model.id"
								class="grid-item"
							>
								<ModelCard :model="model" />
							</div>
						</div>
					</div>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import ModelCard from '../../components/ModelCard.vue';
import sidebar from '../../components/Sidebar.vue';
import upperbar from '../../components/Upperbar.vue';

export default {
	components: {
		sidebar,
		upperbar,
		ModelCard,
	},
	data() {
		return {
			selectedButton: '',
			selected: '综合',
			hotTasks: ['文心大模型', '大语言模型', '多模态模型'],
			modelTypes: ['基础模型', '产业方案', '创意工坊'],
			visionTasks: [
				'视觉检测跟踪',
				'光学字符识别',
				'视觉分类',
				'视觉分割',
				'视觉编辑',
				'三维视觉',
				'生成式',
			],
			nlpTasks: [
				'文本编辑',
				'生成文本',
				'词语切分',
				'摘要',
				'翻译',
				'文本分析',
				'文本理解',
				'文本对话',
			],
			speechTasks: ['识别', '合成', '声音克隆', '时间戳预测'],
			models: [
				{
					id: 1,
					modelName: 'BERT 中文版',
					modelDescription: '适用于中文自然语言处理的预训练模型。',
					modelTags: ['NLP', '中文', '预训练'],
					support: ['文本分类', '情感分析'],
					author: '百度研究院',
					runCount: 1500,
					likeCount: 350,
					viewCount: 5000,
				},
				{
					id: 2,
					modelName: 'ResNet50 图像分类',
					modelDescription: '用于图像分类任务的深度残差网络。',
					modelTags: ['图像处理', '分类', '深度学习'],
					support: ['图像识别', '特征提取'],
					author: '百度视觉团队',
					runCount: 1200,
					likeCount: 420,
					viewCount: 4800,
				},
				{
					id: 3,
					modelName: 'GPT-3 生成模型',
					modelDescription: '强大的文本生成和理解模型。',
					modelTags: ['生成', 'NLP', '大模型'],
					support: ['对话系统', '文本生成'],
					author: 'OpenAI',
					runCount: 3000,
					likeCount: 800,
					viewCount: 12000,
				},
				{
					id: 4,
					modelName: 'YOLOv5 目标检测',
					modelDescription: '实时目标检测的高效模型。',
					modelTags: ['目标检测', '实时', '深度学习'],
					support: ['视频分析', '监控'],
					author: 'Ultralytics',
					runCount: 2500,
					likeCount: 600,
					viewCount: 10000,
				},
				{
					id: 5,
					modelName: 'Transformer 机器翻译',
					modelDescription: '基于Transformer架构的高效翻译模型。',
					modelTags: ['翻译', 'NLP', 'Transformer'],
					support: ['多语言翻译'],
					author: '谷歌翻译团队',
					runCount: 1800,
					likeCount: 500,
					viewCount: 7500,
				},
				{
					id: 6,
					modelName: 'VGG16 图像识别',
					modelDescription: '用于图像识别的经典卷积神经网络。',
					modelTags: ['图像识别', '卷积网络'],
					support: ['特征提取'],
					author: '牛津大学',
					runCount: 900,
					likeCount: 300,
					viewCount: 4000,
				},
				{
					id: 7,
					modelName: 'DeepSpeech 语音识别',
					modelDescription: '端到端的语音识别模型。',
					modelTags: ['语音识别', '深度学习'],
					support: ['语音转文本'],
					author: '百度语音团队',
					runCount: 1300,
					likeCount: 450,
					viewCount: 6000,
				},
				{
					id: 8,
					modelName: 'FastText 文本分类',
					modelDescription: '快速高效的文本分类工具。',
					modelTags: ['文本分类', 'NLP'],
					support: ['情感分析', '主题分类'],
					author: 'Facebook AI',
					runCount: 1100,
					likeCount: 320,
					viewCount: 5200,
				},
				{
					id: 9,
					modelName: 'StyleGAN 图像生成',
					modelDescription: '生成高质量图像的生成对抗网络。',
					modelTags: ['生成', 'GAN', '图像处理'],
					support: ['图像生成'],
					author: 'NVIDIA',
					runCount: 1600,
					likeCount: 700,
					viewCount: 8500,
				},
				{
					id: 10,
					modelName: 'BART 文本生成',
					modelDescription: '用于文本生成和理解的自回归模型。',
					modelTags: ['生成', 'NLP', '自回归'],
					support: ['文本生成', '摘要'],
					author: 'Facebook AI',
					runCount: 1400,
					likeCount: 400,
					viewCount: 6800,
				},
				{
					id: 11,
					modelName: 'MobileNet 轻量级模型',
					modelDescription: '适用于移动设备的高效卷积神经网络。',
					modelTags: ['轻量级', '移动设备'],
					support: ['图像分类'],
					author: '谷歌',
					runCount: 1000,
					likeCount: 380,
					viewCount: 4500,
				},
				{
					id: 12,
					modelName: 'DistilBERT 压缩模型',
					modelDescription: 'BERT 的轻量级版本，适合快速推理。',
					modelTags: ['NLP', '压缩'],
					support: ['文本分类'],
					author: 'Hugging Face',
					runCount: 900,
					likeCount: 340,
					viewCount: 4300,
				},
				{
					id: 13,
					modelName: 'CycleGAN 图像转换',
					modelDescription: '实现无监督图像到图像转换。',
					modelTags: ['图像处理', 'GAN'],
					support: ['风格转换'],
					author: 'Berkeley AI Research',
					runCount: 800,
					likeCount: 360,
					viewCount: 4100,
				},
				{
					id: 14,
					modelName: 'ALBERT 轻量级NLP',
					modelDescription: '轻量化的BERT模型，提升效率。',
					modelTags: ['NLP', '轻量化'],
					support: ['问答系统'],
					author: '谷歌研究院',
					runCount: 950,
					likeCount: 400,
					viewCount: 4700,
				},
				{
					id: 15,
					modelName: 'UNet 医学图像分割',
					modelDescription: '专为医学图像分割设计的网络。',
					modelTags: ['图像分割', '医学'],
					support: ['医学影像'],
					author: '德国弗赖堡大学',
					runCount: 700,
					likeCount: 310,
					viewCount: 3900,
				},
				{
					id: 16,
					modelName: 'Roberta 文本理解',
					modelDescription: '改进的BERT模型，增强文本理解。',
					modelTags: ['NLP', '文本理解'],
					support: ['情感分析'],
					author: 'Facebook AI',
					runCount: 1050,
					likeCount: 420,
					viewCount: 4900,
				},
				{
					id: 17,
					modelName: 'T5 文本到文本框架',
					modelDescription: '统一的文本到文本转换模型。',
					modelTags: ['NLP', '转换'],
					support: ['翻译', '摘要'],
					author: '谷歌研究院',
					runCount: 1150,
					likeCount: 450,
					viewCount: 5300,
				},
				{
					id: 18,
					modelName: 'DALL-E 图像生成',
					modelDescription: '通过文本描述生成图像的模型。',
					modelTags: ['生成', '图像处理'],
					support: ['图像生成'],
					author: 'OpenAI',
					runCount: 1250,
					likeCount: 480,
					viewCount: 5700,
				},
				{
					id: 19,
					modelName: 'XLNet 自回归模型',
					modelDescription: '结合自回归和自编码的NLP模型。',
					modelTags: ['NLP', '自回归'],
					support: ['文本生成'],
					author: '谷歌AI',
					runCount: 1350,
					likeCount: 500,
					viewCount: 5900,
				},
				{
					id: 20,
					modelName: 'EfficientNet 图像分类',
					modelDescription: '高效的卷积神经网络架构。',
					modelTags: ['图像分类', '效率'],
					support: ['特征提取'],
					author: '谷歌研究院',
					runCount: 1450,
					likeCount: 520,
					viewCount: 6100,
				},
				{
					id: 21,
					modelName: 'BigGAN 图像生成',
					modelDescription: '生成高分辨率图像的GAN模型。',
					modelTags: ['生成', 'GAN'],
					support: ['图像生成'],
					author: 'DeepMind',
					runCount: 1550,
					likeCount: 540,
					viewCount: 6300,
				},
				{
					id: 22,
					modelName: 'LAS 语音识别',
					modelDescription: '基于注意力机制的语音识别模型。',
					modelTags: ['语音识别', '注意力机制'],
					support: ['语音转文本'],
					author: '百度语音团队',
					runCount: 1650,
					likeCount: 560,
					viewCount: 6500,
				},
				{
					id: 23,
					modelName: 'OpenPose 人体姿态估计',
					modelDescription: '用于检测人体姿态的开源模型。',
					modelTags: ['姿态估计', '计算机视觉'],
					support: ['动作识别'],
					author: '卡内基梅隆大学',
					runCount: 1750,
					likeCount: 580,
					viewCount: 6700,
				},
				{
					id: 24,
					modelName: 'Pix2Pix 图像转换',
					modelDescription: '条件生成对抗网络用于图像转换。',
					modelTags: ['图像处理', 'GAN'],
					support: ['图像转换'],
					author: '加州大学伯克利分校',
					runCount: 1850,
					likeCount: 600,
					viewCount: 6900,
				},
				{
					id: 25,
					modelName: 'DeepLab 图像分割',
					modelDescription: '深度卷积网络用于图像分割。',
					modelTags: ['图像分割', '深度学习'],
					support: ['语义分割'],
					author: '谷歌研究院',
					runCount: 1950,
					likeCount: 620,
					viewCount: 7100,
				},
				{
					id: 26,
					modelName: 'TransformerXL 语言建模',
					modelDescription: '长序列语言建模的改进Transformer。',
					modelTags: ['NLP', '语言建模'],
					support: ['文本生成'],
					author: '谷歌AI',
					runCount: 2050,
					likeCount: 640,
					viewCount: 7300,
				},
				{
					id: 27,
					modelName: 'WaveNet 语音生成',
					modelDescription: '生成高质量语音的深度生成模型。',
					modelTags: ['语音生成', '深度学习'],
					support: ['语音合成'],
					author: 'DeepMind',
					runCount: 2150,
					likeCount: 660,
					viewCount: 7500,
				},
				{
					id: 28,
					modelName: 'BART 文本生成',
					modelDescription: '用于文本生成和理解的自回归模型。',
					modelTags: ['生成', 'NLP', '自回归'],
					support: ['文本生成', '摘要'],
					author: 'Facebook AI',
					runCount: 2250,
					likeCount: 680,
					viewCount: 7700,
				},
				{
					id: 29,
					modelName: 'Mask R-CNN 目标检测',
					modelDescription: '用于对象检测和实例分割的深度网络。',
					modelTags: ['目标检测', '实例分割'],
					support: ['视频分析'],
					author: 'Facebook AI Research',
					runCount: 2350,
					likeCount: 700,
					viewCount: 7900,
				},
				{
					id: 30,
					modelName: 'GPT-2 文本生成',
					modelDescription: '用于生成自然语言文本的强大模型。',
					modelTags: ['生成', 'NLP'],
					support: ['对话系统', '文本生成'],
					author: 'OpenAI',
					runCount: 2450,
					likeCount: 720,
					viewCount: 8100,
				},
				// 添加更多模型
			],
		};
	},

	// methods: {
	//   toggleSelection(item) {
	//     this.selectedButton = this.selectedButton === item ? '' : item;
	//   },
	//   handleSort(command) {
	//     console.log(`Sorting by ${command}`);
	//     // 在此处实现排序逻辑
	//   },
	// },
};
</script>

<style scoped>
@import '../../assets/css/ModelSquare.scss';
</style>
