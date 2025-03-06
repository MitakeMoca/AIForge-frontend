<template>
  <header class="upperbar">
    <upperbar />
  </header>
  <el-container class="pipeline-container" style="height: 80vh; min-height: 100%; padding-top: 60px">
    <aside class="sidebar">
      <sidebar />
    </aside>

    <el-main>
      <el-tabs v-model="activeTab" class="tabs">
        <!--标签页 我的模型 -->
        <el-tab-pane label="我的模型" name="myModels">

          <!-- 类型选择 -->
          <div class="type_choose">
            <Space vertical>
              <el-checkbox :indeterminate="indeterminate" v-model="checkAll"
                @change="handleCheckAllChange">全选</el-checkbox>
              <div>
                <el-checkbox-group v-model="value" @change="handleCheckedTagsChangeMyModels">
                  <div class="optionandfilter">
                
                    <el-checkbox v-for="option in options" :key="option.value" :label="option.value">{{ option.label
                      }}</el-checkbox>

                    <el-row class="filter-row">

                      <el-col>
                        <el-select v-model="myModelsTimeOrder" placeholder="时间排序" class="select">
                          <el-option label="时间倒序" value="desc"></el-option>
                          <el-option label="时间正序" value="asc"></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </div>
                </el-checkbox-group>

              </div>
            </Space>
          </div>
          <div class="scrollable-pipeline-list">
            <el-row gutter="20">
              <el-col :span="24" v-for="model in filteredMyModels" :key="model.id">
                <el-card class="pipeline-card" shadow="hover" @click="handleClick(model.id)">
                  <div class="card-content">
                    <div class="model-id">ID: {{ model.id }}</div>
                    <div class="model-name">{{ model.name }}</div>
                    <div class="time">
                      <el-tag :style="{ fontSize: '18px' }">创建时间: {{ model.date }}</el-tag>
                    </div>
                    <div class="actions">
                      

                      <div>
                        <el-tag :type="statusColor">{{ model.status }}</el-tag>
                      </div>

                      <el-divider direction="vertical" />

                      <div v-if="model.pub === 0">
                        <el-button type="success" @click.stop="confirmSetPublic(model.id)">设为公开</el-button>
                      </div>
                      <div v-else-if="model.pub === 1 || model.pub === 2">
                        <el-button type="warning" @click.stop="confirmSetPrivate(model.id)">设为私有</el-button>
                      </div>
                              
                      <el-divider direction="vertical" />
                      <el-link type="danger" @click.stop="confirmDelete(model.id)">删除</el-link>
                      
                    </div>
                  </div>
                  <div class="tags">
                    <div v-for="(tag, i) in model.tags" :key="i" :style="{ paddingRight: '20px' }">
                      <el-tag class="tag" :style="{ fontSize: '17px' }">{{ tag }}</el-tag>
                    </div>
                  </div>

                </el-card>

              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <!-- 标签页"基础模型" -->
        <el-tab-pane class="list-1" label="收藏模型" name="created">


          <!-- 类型选择 -->
          <div class="type_choose">
            <Space vertical>
              <el-checkbox :indeterminate="indeterminate" v-model="checkAll"
                @change="handleCheckAllChange">全选</el-checkbox>
              <div>
                <el-checkbox-group v-model="value" @change="handleCheckedTagsChange">
                  <div class="optionandfilter">
                    <el-checkbox v-for="option in options" :key="option.value" :label="option.value">{{ option.label
                      }}</el-checkbox>


                    <el-row class="filter-row">

                      <el-col :span="6">
                        <el-select v-model="timeOrder" placeholder="时间排序" class="select">
                          <el-option label="时间倒序" value="desc"></el-option>
                          <el-option label="时间正序" value="asc"></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </div>
                </el-checkbox-group>
              </div>
            </Space>
          </div>

          <!-- 替换表格为可点击的按钮卡片-->
          <div class="scrollable-pipeline-list">
            <el-row gutter="20">
              <el-col class="model-col" :span="24" v-for="(model, index) in filteredPipelines" :key="index">
                <el-card class="pipeline-card" shadow="hover" @click="handleClick(model.id)">
                  <div class="card-content">
                    <div class="model-id-a">ID: {{ model.id }}</div>
                    <div class="model-name">{{ model.name }}</div>

                    <!-- <div>{{ model.tags }}</div> -->

                    <!-- <div>
                    <el-tag>{{ pipeline.type }}</el-tag>
                    <el-tag>{{ pipeline.category }}</el-tag>
                  </div>
                  <div>Pipeline ID: {{ pipeline.pipelineID }}</div> -->

                    <div class="time">
                      <el-tag :style="{ fontSize: '18px' }">创建时间: {{ model.date }}</el-tag>
                    </div>

                    <div class="actions">
                      <div>
                        <el-tag>{{ statusText }}</el-tag>
                      </div>

                      <el-divider direction="vertical" />
                      <el-link type="danger" @click.stop="confirmDeleteFavor(model.id)">取消收藏</el-link>
                    </div>
                  </div>

                  <div class="tags">
                    <div v-for="(tag, i) in model.tags" :key="i" :style="{ paddingRight: '20px' }">
                      <el-tag class="tag" :style="{ fontSize: '17px' }">{{ tag }}</el-tag>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>


      </el-tabs>
    </el-main>
  </el-container>
</template>

<script setup scoped>
import "element-plus/dist/index.css";
import { ElInput, ElButton } from "element-plus";
import Checkbox from "@/components/Checkbox.vue";
import { ref, onMounted, watch, watchEffect, computed } from "vue";
import { useRouter } from "vue-router"; // 导入路由以进行跳转
import sidebar from "../../components/Sidebar.vue";
import upperbar from "../../components/Upperbar.vue";
import {
  getCollectedMdels,
  deleteFavor,
  getAllTagsByModelid,
  getMyModels,
  setPrivate,
  setWaiting,
  deleteModel,
} from "../../service/model.js";
import { getLocal, setLocal } from "@/utils/local";
import { getAllModelTags } from "../../service/ModelSquare";

// 在组件挂载时调用 fetchPipelines
onMounted(() => {
  fetchPipelines();
  fetchMyModels();
  fetchAllModelTags();
  // if (route.query.activeTab) {
  //   activeTab.value = route.query.activeTab;
  // }
});

const confirmDelete = (id) => {
  ElMessageBox.confirm("确定要删除此模型吗", "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      
      handleDelete(id); // 调用删除处理函数
      
    })
    .catch(() => {
      // 如果点击取消按钮，这里可以处理取消逻辑
    });
};

const handleDelete = async(id) => {
  
  try {

    const response = await deleteModel(id);
    // console.log(response);

    
    ElMessage({
            title: "成功",
            message: `ID 为 ${id} 的模型已删除`,
            type: "success",
            duration: 1500,
            onClose:()=>{
              window.location.reload();
            }
          });
    
  } catch (err) {
    error.value = "Failed to load collected pipelines";
  }
};

const confirmSetPublic = (id) => {
  ElMessageBox.confirm("确定要将此模型设置为“公开”吗？设为“公开”后，模型将对其他用户可见", "设置确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      
      handlePublicAction(id); // 调用删除处理函数
      
    })
    .catch(() => {
      // 如果点击取消按钮，这里可以处理取消逻辑
    });
};

const handlePublicAction = async(id) => {
  
  try {

    const response = await setWaiting({modelId: id});
    // console.log(response);

    ElMessage({
            title: "成功",
            message: `ID 为 ${id} 的模型已设置为“公开”，待审核`,
            type: "success",
            duration: 1500,
            onClose:()=>{
              window.location.reload();
            }
          });
    
    
  } catch (err) {
    error.value = "Failed to load collected pipelines";
  }
};

const confirmSetPrivate = (id) => {
  ElMessageBox.confirm("确定要将此模型设置为“私有”吗？设为“私有”后，模型自其他用户不可见", "设置确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      
      handlePrivateAction(id); // 调用删除处理函数
      
    })
    .catch(() => {
      // 如果点击取消按钮，这里可以处理取消逻辑
    });
};

const handlePrivateAction = async(id) => {
  
  try {

    const response = await setPrivate({modelId: id});
    // console.log(response);

    
    //刷新页面
    
    ElMessage({
            title: "成功",
            message: `ID 为 ${id} 的模型已设置为“私有”`,
            type: "success",
            duration: 1500,
            onClose:()=>{
              window.location.reload();
            }
          });
    
  } catch (err) {
    error.value = "Failed to load collected pipelines";
  }
};


// 获取路由实例
const router = useRouter();

// 定义方法
// 尽是实现了到详情页的跳转，还没有设计导航到对应的模型
const handleClick = (modelId) => {
  router.push({ name: "ModelDetail", params: { modelId } });
};

import { ElMessageBox, ElMessage } from "element-plus";

const options = ref([]);
async function fetchAllModelTags() {
  try {
    const response = await getAllModelTags();
    console.log("here");
    if (response && response.resultCode === 200) {
      
      // 动态生成 options，label 为返回的数据，value 从 1 开始依次递增
      options.value = response.data.map((tag, index) => ({
        label: tag, // 假设返回的数据是标签名称
        value: index + 1,
      }));
    } else {
      error.value = response?.message || "Unexpected error";
    }
  } catch (err) {
    error.value = "Failed to load model tags";
  }
}

const confirmDeleteFavor = (id) => {
  ElMessageBox.confirm("确定要删除此模型吗？", "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      handleDeleteFavor(id); // 调用删除处理函数
    })
    .catch(() => {
      // 如果点击取消按钮，这里可以处理取消逻辑
    });
};

const handleDeleteFavor = async (id) => {
  console.log("删除 ID 为 " + id + " 的产线");
  try {
    const response = await deleteFavor(id, userId);
    // console.log(response);

    ElMessage({
            title: "成功",
            message: `已取消收藏`,
            type: "success",
            duration: 1500,
            onClose:()=>{
              window.location.reload();
            }
          });
    //刷新页面
  } catch (err) {
    error.value = "Failed to load collected pipelines";
  }
};

const activeTab = ref("myModels");
const search = ref("");
const timeOrder = ref("desc");
const typeFilter = ref("all");

//我的模型
const myModels = ref([]);
const myModelsSearch = ref("");
const myModelsTimeOrder = ref("");

// 定义 pipelines 状态
const pipelines = ref([]); // 用于存储从 API 获取的数据
const loading = ref(true); // 加载状态
const error = ref(null); // 错误信息

//获取用户 ID（假设从 localStorage 或其他地方获取）
//const userId = 10;
const userId = getLocal("userId");
const status = "公开";
const statusText = "公开";


async function getTags(modelid) {
  try {
    const response = await getAllTagsByModelid(modelid);
    return response.data;
  } catch (err) {
    error.value = "Failed to get model's tags";
    console.log(error);
  }
}

const getStatus = (pub) => {
  switch (pub) {
    case 0:
      return "私有";
    case 1:
      return "公开";
    default:
      return "审核中";
  }
};
// 获取我的模型并获取标签
async function fetchMyModels() {
  try {
    const response = await getMyModels(userId);
    const modelsWithPendingTags = response.data.map((model) => ({
      id: model.modelId,
      name: model.modelName,
      status: getStatus(model.pub),
      pub: model.pub,
      date: new Date(model.modelDate),
      tags: "", // 初始化为空
    }));

    // 获取所有标签的 Promise 数组
    const tagPromises = modelsWithPendingTags.map((model) =>
      getTags(model.id).then((tags) => ({ id: model.id, tags }))
    );

    // 等待所有标签获取完成
    const tagsResults = await Promise.all(tagPromises);

    // 更新模型的标签
    myModels.value = modelsWithPendingTags.map((model) => {
      const tagsResult = tagsResults.find((result) => result.id === model.id);
      return { ...model, tags: tagsResult ? tagsResult.tags : "" };
    });
  } catch (err) {
    error.value = "Failed to load my models";
  }
}

// 仿照 fetchModels 函数的实现
async function fetchPipelines() {
  try {
    const response = await getCollectedMdels(userId);
    console.log(response.data);
    //首先映射出所有的pipeline，并准备一个数组来存放所有的tags获取请求
    const pipelinesWithPendingTags = response.data.map((model) => ({
      id: model.modelId,
      name: model.modelName,
      date: new Date(model.modelDate), // 格式化日期
      description: model.modelDescription || "无描述", // 处理空描述
      tags: "", // 先设置为空字符串，稍后填充
    }));

    // 创建一个包含所有getTags调用的Promise数组
    const tagPromises = pipelinesWithPendingTags.map((pipeline) =>
      getTags(pipeline.id).then((tags) => ({ id: pipeline.id, tags }))
    );

    // 等待所有getTags调用完成，并根据id更新pipelines中的tags属性
    const tagsResults = await Promise.all(tagPromises);

    // 更新pipelines的tags属性
    pipelines.value = pipelinesWithPendingTags.map((pipeline) => {
      const tagsResult = tagsResults.find((result) => result.id === pipeline.id);
      return { ...pipeline, tags: tagsResult ? tagsResult.tags : "" };
    });

    //console.log(pipelines.value);
  } catch (err) {
    error.value = "Failed to load collected pipelines";
  } finally {
    loading.value = false; // 无论成功或失败，都关闭加载状态
  }
}

// 监听 timeOrder 的变化
watch(timeOrder, (newVal) => {
  if (newVal === "asc" || newVal === "desc") {
    sortPipelines(newVal);
  }
});

//我的模型排序函数
const filteredMyModels = computed(() => {
  let filtered = myModels.value;

  // 搜索过滤
  if (myModelsSearch.value) {
    filtered = filtered.filter(
      (model) =>
        model.name.includes(myModelsSearch.value) ||
        model.id.toString().includes(myModelsSearch.value)
    );
  }

  // 标签过滤
  if (value.value.length > 0) {
    const selectedLabels = value.value.map((val) => tagMap.value.get(Number(val)));
    filtered = filtered.filter((model) =>
      selectedLabels.some((label) => model.tags.includes(label))
    );
  }

  // 时间排序
  if (myModelsTimeOrder.value === "asc") {
    filtered.sort((a, b) => a.date - b.date);
  } else {
    filtered.sort((a, b) => b.date - a.date);
  }

  return filtered;
});
// 排序函数
function sortPipelines(order) {
  if (!pipelines.value || pipelines.value.length === 0) return;

  // 深拷贝 pipelines.value 以避免直接修改原始数据

  const sortedPipelines = [...pipelines.value];

  // 根据 order 参数决定排序方式
  sortedPipelines.sort((a, b) => {
    if (order === "asc") {
      console.log(a.date);
      return a.date - b.date; // 正序
    } else if (order === "desc") {
      return b.date - a.date; // 倒序
    }
  });

  //console.log(sortedPipelines);

  // 更新 pipelines.value
  pipelines.value = sortedPipelines;
}





// // 定义标签选项
// const options = ref([
//   {
//     label: "语言大模型",
//     value: 1,
//   },
//   {
//     label: "视觉大模型",
//     value: 2,
//   },
//   {
//     label: "通用大模型",
//     value: 3,
//   },
//   {
//     label: "图像处理",
//     value: 4,
//   },
//   {
//     label: "多模态",
//     value: 5,
//   },
//   {
//     label: "基础模型",
//     value: 6,
//   },
// ]);



// 创建标签映射对象，用于快速查找 value 对应的 label
const tagMap = computed(() => {
  return new Map(options.value.map((option) => [option.value, option.label]));
});

// 当前选中的标签值
const value = ref([]); // 这里只存储 value，而不是对象

// 全选状态
const checkAll = ref(false);

// 计算 indeterminate 状态
const indeterminate = computed(() => {
  const checkedCount = value.value.length;
  return checkedCount > 0 && checkedCount < options.value.length;
});

// 监听 checkAll 的变化，处理全选/取消全选
watch(checkAll, (to) => {
  if (to) {
    value.value = options.value.map((option) => option.value);
  } else {
    value.value = [];
  }
});

// 监听 value 的变化，更新 checkAll 和 indeterminate 状态
watch(
  value,
  (newValue) => {
    checkAll.value = newValue.length === options.value.length;
    indeterminate.value = newValue.length > 0 && newValue.length < options.value.length;
  },
  { deep: true }
);

function handleCheckedTagsChange() {
  // 确保 value 中的值是数字
  value.value = value.value.map(Number); // 将所有值转换为数字
  console.log("Selected tags:", value.value);
}
function handleCheckedTagsChangeMyModels() {
  // 确保 value 中的值是数字
  value.value = value.value.map(Number); // 将所有值转换为数字
  console.log("Selected tags:", value.value);
}
// 处理全选/取消全选
function handleCheckAllChange(val) {
  checkAll.value = val;
}

const filteredPipelines = computed(() => {
  console.log("Recalculating filteredPipelines");
  console.log("Selected values:", value.value);

  // 将选中的 value 转换为对应的 label，并确保 value 是数字
  const selectedLabels = value.value
    .map((val) => {
      const numVal = Number(val); // 将 val 转换为数字
      const label = tagMap.value.get(numVal);
      console.log(`Mapping value ${val} to label:`, label);
      return label;
    })
    .filter((label) => label !== undefined); // 过滤掉 undefined

  console.log("Selected labels:", selectedLabels);

  if (!selectedLabels.length) {
    return pipelines.value;
  }

  return pipelines.value.filter((model) => {
    console.log(`Checking model ${model.name} with tags:`, model.tags);
    const matches = selectedLabels.some((selectedLabel) =>
      model.tags.includes(selectedLabel)
    );
    console.log(`Model ${model.name} matches:`, matches);
    return matches;
  });
});

const horizontalGap = ref(16);
const verticalGap = ref(8);
</script>

<style scoped>
@import "../../assets/css/models.scss";
@import "../../assets/css/components/Bar.scss";
</style>
