<template>
    <upperbar></upperbar>
    <sidebar></sidebar>
    <div style="width:90%">
    <el-container style="height:85vh;">
      <div class="model-detail">
        <header class="model-header">
          <nav class="breadcrumb">
            <router-link to="../square">
              <span>模型库</span>
            </router-link> &gt; <span>模型详情</span>
          </nav>
          <div class="header-content">
            <div class="title-section">
              <h1 class="model-name">{{ model.name }}</h1>
              <div class="info">
                <span>{{ model.views }}次调用</span>
                <span>{{ model.date }}</span>
              </div>
              <div class="model-description">
                <span class="icon">🏆</span>
                <span>飞桨 {{ model.description }}</span>
              </div>
              <div class="tags">
                <span v-for="tag in model.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
            <div class="actions">
              <button class="action-button">模型开发</button>
              <button class="like-button">❤️ 28</button>
              <button class="share-button">🔗</button>
            </div>
          </div>
        </header>
  
        <nav class="tabs">
          <button :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">模型简介</button>
          <button :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">评论</button>
        </nav>
  
        <section v-if="activeTab === 'overview'" class="overview">
          <div v-html="compiledMarkdown" class="markdown-content"></div>
        </section>
  
        <section v-if="activeTab === 'comments'" class="comments">
          <h2>评论</h2>
        </section>
      </div>
    </el-container>
  </div>
  </template>
  
  <script>
  import Upperbar from '../../components/Upperbar.vue';
  import Sidebar from '../../components/Sidebar.vue';
  import MarkdownIt from 'markdown-it';
  
  export default {
    components: {
      Upperbar,
      Sidebar
    },
    data() {
      return {
        modelId: null,
        activeTab: 'overview',
        model: {
          name: 'ResNet50',
          views: 257,
          date: '2023-06-12 16:50:09',
          description: 'ResNet50是图像分类模型。',
          tags: ['基础模型', '图像识别', '深度学习'],
          overviewMarkdown: `
# ResNet50

## 1. 模型简介
ResNet 系列模型是在 2015 年提出的，一举在 ILSVRC2015 比赛中取得冠军，top5 错误率为 3.57%。
\`\`\`python
# 引入
import torch
import torchvision.models as models
model = models.resnet50(pretrained=True)

\`\`\`
## 2. 技术方案
ResNet模型的主要创新点在于其提出的残差结构，改善了深度网络的退化问题，使得模型能够构建几十上百层网络，大大提高模型的拟合能力。实验表明使用残差结构可以有效地提升收敛速度和精度。详细的技术实现可参考阅读：ResNet。

## 3. 如何使用

### 3.1 数据准备
在完成数据标注工作后，请按照数据集规范说明检查数据组织格式是否满足要求。如果不满足，请参照规范说明进行调整，否则将导致后面的数据校验环节无法通过。

完成数据准备后，点击右上角【创建模型产线】。

在 AI Studio 云端，可以通过挂载数据集的方式来使用自己的数据。模型产线创建和修改窗口可以挂载和管理数据集，如下图所示。数据集挂载成功后，需在开发者模式中查看并解压挂载的数据集，数据集路径查看方式为【开发者模式】-左侧【资源管理器】，在目录 AISTUDIO/data 下，数据集解压方式为【开发者模式】-左侧【菜单】-【终端】-【新建终端】，在【终端】中通过命令行方式解压，并将解压后的数据集路径拷贝到【工具箱模式】-【数据校验】-【数据集路径】。注意：在 AI Studio 云端，data 目录不持久化存储，如需持久化存储，需要将数据解压至其它目录。

在本地端-工具箱模式中，您可以直接在【工具箱模式】-【数据校验】-【数据集路径】中填写本地数据路径来使用自己的数据集。

在配置完成【数据集路径】后，即可点击【开始校验】按钮进行数据集校验。

更多详细说明，请参考在线文档。

### 3.2 模型训练
PaddleX提供 工具箱模式 和 开发者模式 两种开发模式：

- **工具箱模式** 推荐 AI 开发经验较少的开发者使用，高阶开发者也可以使用这个模式来提高开发效率。工具箱模式利用 gradio 搭建 webui 工具链，可以实现无代码 AI 模型开发。主要包含数据校验、模型训练、评估测试和模型部署四个环节。可以根据实际需求选择模型结构、骨干网络及对应的训练参数、优化策略，使得任务效果最佳。关于工具箱模式的完整使用请参考在线文档。注意：工具箱模式中的训练轮次、批大小、学习率等参数的默认值仅适用于官方提供的示例数据集，对于自己的数据集，需要进行针对性的调整。可以参考参数设置经验，例如学习率对训练效果影响较大，建议放缩进行多次尝试，对于难度较大的任务，可以适当增加训练轮次数以获得更佳效果。

- **开发者模式** 推荐 AI 开发经验较丰富的开发者使用，集成了 VSCode IDE 环境，并内置飞桨统一模型开发 API——UAPI，可以使用统一的 API 接口进行开发，仅需 5 行命令即可完成基础模型训练、推理、评估导出以及多模型组合预测。同时，在开发者模式中可以编辑工具箱模式的源码，以实现工具箱模式 DIY。关于开发者模式的完整使用请参考在线文档。

### 3.3 代码示例
\`\`\` python
class ResNet(nn.Module):
 
    def __init__(self, block, layers, num_classes=1000, zero_init_residual=False,
                 groups=1, width_per_group=64, replace_stride_with_dilation=None,
                 norm_layer=None):
        super(ResNet, self).__init__()
        if norm_layer is None:
            norm_layer = nn.BatchNorm2d
        self._norm_layer = norm_layer
 
        self.inplanes = 64
        self.dilation = 1
        if replace_stride_with_dilation is None:
            # each element in the tuple indicates if we should replace
            # the 2x2 stride with a dilated convolution instead
            replace_stride_with_dilation = [False, False, False]
        if len(replace_stride_with_dilation) != 3:
            raise ValueError("replace_stride_with_dilation should be None "
                             "or a 3-element tuple, got {}".format(replace_stride_with_dilation))
        self.groups = groups
        self.base_width = width_per_group
\`\`\`

层定义

\`\`\`python 
        self.conv1 = nn.Conv2d(3, self.inplanes, kernel_size=7, stride=2, padding=3,
                               bias=False)
        self.bn1 = norm_layer(self.inplanes)
        self.relu = nn.ReLU(inplace=True)
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)
        self.layer1 = self._make_layer(block, 64, layers[0])
        self.layer2 = self._make_layer(block, 128, layers[1], stride=2,
                                       dilate=replace_stride_with_dilation[0])
        self.layer3 = self._make_layer(block, 256, layers[2], stride=2,
                                       dilate=replace_stride_with_dilation[1])
        self.layer4 = self._make_layer(block, 512, layers[3], stride=2,
                                       dilate=replace_stride_with_dilation[2])
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(512 * block.expansion, num_classes)
 
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
            elif isinstance(m, (nn.BatchNorm2d, nn.GroupNorm)):
                nn.init.constant_(m.weight, 1)
                nn.init.constant_(m.bias, 0)
 
        # Zero-initialize the last BN in each residual branch,
        # so that the residual branch starts with zeros, and each residual block behaves like an identity.
        # This improves the model by 0.2~0.3% according to https://arxiv.org/abs/1706.02677
        if zero_init_residual:
            for m in self.modules():
                if isinstance(m, Bottleneck):
                    nn.init.constant_(m.bn3.weight, 0)
                elif isinstance(m, BasicBlock):
                    nn.init.constant_(m.bn2.weight, 0)
\`\`\`

根据需要调整每个块的通道数、步长，生成一个包含多个残差块的层

\`\`\`python 
    def _make_layer(self, block, planes, blocks, stride=1, dilate=False):
        norm_layer = self._norm_layer
        downsample = None
        previous_dilation = self.dilation
        if dilate:
            self.dilation *= stride
            stride = 1
        if stride != 1 or self.inplanes != planes * block.expansion:
            downsample = nn.Sequential(
                conv1x1(self.inplanes, planes * block.expansion, stride),
                norm_layer(planes * block.expansion),
            )
 
        layers = []
        layers.append(block(self.inplanes, planes, stride, downsample, self.groups,
                            self.base_width, previous_dilation, norm_layer))
        self.inplanes = planes * block.expansion
        for _ in range(1, blocks):
            layers.append(block(self.inplanes, planes, groups=self.groups,
                                base_width=self.base_width, dilation=self.dilation,
                                norm_layer=norm_layer))
 
        return nn.Sequential(*layers)
\`\`\`

前向传播

\`\`\`python 
    def forward(self, x):
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.maxpool(x)
 
        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)
 
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.fc(x)
 
        return x
\`\`\`


### 3.4 模型部署
使用工具箱或开发者模式完成模型训练后，就可以在工具箱模式进行模型部署了。需注意，目前必须经过导出预测模型后才会产生用于部署的静态图模型。目前提供了模型在不同操作系统、不同部署硬件、不同接口语言条件下的部署包 SDK 获取方式。

本模型目前的部署支持情况如下：

| 操作系统 | 部署硬件 | 接口语言 | 支持情况 |
| -------- | -------- | -------- | -------- |
| Windows  | NV GPU   | C++      | ✅       |
| Windows  | NV GPU   | Python   | ✅       |
| Windows  | X86 CPU  | C++      | ✅       |
| Windows  | X86 CPU  | Python   | ✅       |
| Linux    | NV GPU   | C++      | ✅       |
| Linux    | NV GPU   | Python   | ✅       |
| Linux    | X86 CPU  | C++      | ✅       |
| Linux    | X86 CPU  | Python   | ✅       |

根据实际业务需求选择所需要的操作系统、部署硬件、接口语言等条件后，获取 FastDeploy 部署包，完成之后到开发者模式下进行下载（文件右击选择下载即可），其中包括部署代码和预测模型。

最后就可以参考部署包里面的 README 使用说明，在目标硬件上进行部署啦。

注意：如果需要更新预测模型，可以直接修改部署包中的预测模型。
  `
        }
      };
    },
    computed: {
      compiledMarkdown() {
        const md = new MarkdownIt();
        return md.render(this.model.overviewMarkdown);
      }
    },
    mounted() {
      this.modelId = this.$route.params.id;
    }
  };
  </script>
  
  <style>
  @import "../../assets/css/ModelDetail.scss";
  </style>