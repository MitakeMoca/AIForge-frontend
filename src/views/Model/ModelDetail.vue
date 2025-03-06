<template>
  <header class="upperbar">
    <upperbar />
  </header>
  <el-container class="main" style="height: 80vh; min-height: 100%; padding-top: 60px">
    <aside class="sidebar">
      <sidebar />
    </aside>
    <div class="model-detail">
      <header class="model-header">
        <nav class="breadcrumb">
          <router-link to="../square">
            <span>模型库</span>
          </router-link>
          &gt; <span>模型详情</span>
        </nav>
        <div class="header-content">
          <div class="title-section">
            <h1 class="model-name">{{ model.modelName }}</h1>
            <div class="info">
              <!-- <span>{{ model.modelViews }}次观看 </span-->
              <span>{{ formattedDate }}</span>
            </div>
            <div class="model-description">
              <span class="icon">🏆</span>
              <span>{{ model.modelDescription }}</span>
            </div>
            <el-tag v-for="tag in tags" :key="tag">
              {{ tag }}
            </el-tag>
          </div>
          <div class="actions">
            <button class="action-button" @click="handleModelDevelop">模型开发</button>
            <button class="like-button" v-if="isFavor" @click="handleCancelFavor">
              ❤️ {{ modelLikeCount }}
            </button>
            <button class="like-button" v-else @click="handleAddFavor">
              🤍 {{ modelLikeCount }}
            </button>

            <!-- <button class="share-button" @click="handleShareModel">🔗</button> -->
          </div>
        </div>
      </header>
      <nav class="tabs">
        <button
          :class="{ active: activeTab === 'overview' }"
          @click="activeTab = 'overview'"
        >
          模型简介
        </button>
        <!-- <button :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">评论</button> -->
        <!-- <button
            :class="{ active: activeTab === 'trainDataSet' }"
            @click="activeTab = 'trainDataSet'"
          >
            数据集
          </button>
          <button
            :class="{ active: activeTab === 'validationDataSet' }"
            @click="activeTab = 'validationDataSet'"
          >
            验证集
          </button>
          <button
            :class="{ active: activeTab === 'testDataSet' }"
            @click="activeTab = 'testDataSet'"
          >
            测试集
          </button> -->
      </nav>

      <section v-if="activeTab === 'overview'" class="overview">
        <div v-html="renderedMarkdown" class="markdown-content"></div>
      </section>

      <section v-if="activeTab === 'trainDataSet'" class="trainDataSet">
        <h2>数据集</h2>
      </section>

      <section v-if="activeTab === 'validationDataSet'" class="validationDataSet">
        <h2>验证集</h2>
      </section>

      <section v-if="activeTab === 'testDataSet'" class="testDataSet">
        <h2>测试集</h2>
      </section>
    </div>
  </el-container>
</template>
<script>
import Upperbar from "../../components/Upperbar.vue";
import Sidebar from "../../components/Sidebar.vue";
import MarkdownIt from "markdown-it";
import { ref, onMounted, computed } from "vue";
import { getModelDetail } from "@/service/ModelDetail";
import { getModelLikeCount } from "@/service/ModelDetail";
import { getIsFavor, addFavor, cancelFavor } from "@/service/ModelDetail";
import { getLocal, setLocal } from "@/utils/local";
import { useRoute, useRouter } from "vue-router";
import { getAllTagsByModelid } from "@/service/model";
import { ElMessage, ElInput} from "element-plus";
import { createProject } from "@/service/project.js";
import { ElNotification,ElDialog, ElMessageBox} from "element-plus";

export default {
  components: {
    Upperbar,
    Sidebar,
  },

  setup() {
    const userId = ref("larry");
    const activeTab = ref("overview");
    const route = useRoute();
    const modelId = ref(route.params.modelId);
    const model = ref({});
    const tags = ref([]);
    const modelLikeCount = ref(0); // 初始化为 0
    const error = ref(null); // 确保初始化
    console.log("id是" + modelId.value);
    const md = new MarkdownIt();
    const isFavor = ref(true);
    const dialogVisible = ref(false);
    const router = useRouter();

    //获取当前时间
    function formatDateTime(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // 打开对话窗
    const openDialog = () => {
      dialogVisible.value = true;
    };
    //点击模型开发
    
    const handleModelDevelop = () => {
      const userIdValue = userId.value;
      const modelIdValue = parseInt(modelId.value, 10);

      // 第一步：弹出输入项目名称的对话框
      ElMessageBox.prompt('请输入项目名称', '创建项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入项目名称',
      }).then(({ value: projectName }) => {
        // 用户输入了项目名称，继续弹出输入项目描述的对话框
        if (projectName) {
          ElMessageBox.prompt('请输入项目描述', '创建项目', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入项目描述',
            inputType: 'textarea', // 使用多行文本框
          }).then(({ value: projectDescription }) => {
            // 用户输入了项目描述，构建项目数据
            let jsonData = {
              ProjectName: projectName,
              Description: projectDescription,
              UserId: userIdValue,
              CreateTime: formatDateTime(new Date()),
              modelId: modelIdValue,
              Train_DatasetId: -1,
              Test_DatasetId: -1,
              ImageId: -1,
              ProjectType: tags.value.length > 0 ? tags.value[0] : "",
            };

            // 创建项目
            createProject(jsonData).then((res) => {
              ElNotification({
                title: "成功",
                message: "新建项目成功",
                type: "success",
              });

              // 成功后导航到项目配置页面
              router.push(`/project/projectConfig/${res.data.projectId}`);
            }).catch((err) => {
              console.error('Failed to create project:', err);
              ElNotification({
                title: "错误",
                message: "新建项目失败，请检查控制台日志。",
                type: "error",
              });
            });
          }).catch(() => {
            // 用户取消输入项目描述
            ElNotification({
              title: "取消",
              message: "已取消输入项目描述",
              type: "info",
            });
          });
        } else {
          // 用户没有输入项目名称
          ElNotification({
            title: "警告",
            message: "请输入项目名称",
            type: "warning",
          });
        }
      }).catch(() => {
        // 用户取消输入项目名称
        ElNotification({
          title: "取消",
          message: "已取消输入项目名称",
          type: "info",
        });
      });
    };
    //分享模型按钮
    const handleShareModel = () => {
      ElMessage({
        message: "敬请期待",
        type: "success",
        duration: 3000, // 持续时间，毫秒
      });
    };
    const renderedMarkdown = computed(() =>
      md.render(model.value.modelOverviewMarkdown || "")
    );

    const formattedDate = computed(() => {
      const date = new Date(model.value.modelDate);
      return date.toLocaleDateString();
    });

    function checkUserLogin() {
      userId.value = getLocal("userId");

      if (!userId.value) {
        // 用户未登录，跳转到登录界面
        console.log("用户未登录"); // 替换为实际的登录页面路径
        window.location.href = "/home";
      }
    }
    onMounted(async () => {
      checkUserLogin();
      userId.value = getLocal("userId");
      console.log("当前用户是 " + userId.value);
      incrementModelViewCount(modelId.value);
      tags.value = await getTags(modelId.value);
      getWhetherIsFavor(modelId.value, userId.value);

      try {
        const response = await getModelDetail(modelId.value);
        console.log("发送一个请求 " + response.data);
        if (response.resultCode === 200) {
          console.log("Result code is 200");
          model.value = response.data;
          console.log("Model data set:", model.value.modelOverviewMarkdown);
        } else {
          error.value = response.message;
        }
      } catch (err) {
        console.error("Failed to load model details:", err);
        error.value = "Failed to load model details";
      }
      getModelFavorCount(model.value.modelId);
    });

    //获取模型收藏数量
    async function getModelFavorCount(modelId) {
      try {
        // console.log("查询该id的收藏数:" + modelId);
        const likeCountResponse = await getModelLikeCount(modelId);
        if (likeCountResponse.resultCode === 200) {
          modelLikeCount.value = likeCountResponse.data; // 确保数据结构正确
        } else {
          console.error("Error fetching like count:", likeCountResponse.message);
        }
      } catch (err) {
        console.error("Failed to load model 收藏数:", err);
      }
    }
    //获取模型标签
    async function getTags(modelId) {
      try {
        const response = await getAllTagsByModelid(modelId);
        return response.data;
      } catch (err) {
        error.value = "Failed to get model's tags";
        console.log(error);
      }
    }
    //查询当前用户是否收藏当前模型
    async function getWhetherIsFavor(modelId, userId) {
      console.log("查询用户：" + userId + "是否收藏了模型：" + modelId);
      try {
        const response = await getIsFavor(modelId, userId);
        isFavor.value = response.data;
        return response.data;
      } catch (err) {
        error.value = "查询用户是否收藏时出错";
        console.log(error);
      }
    }
    // 处理添加收藏模型
    async function handleAddFavor() {
      console.log(userId.value + "把" + model.value.modelId + "添加收藏");
      try {
        const response = await addFavor(model.value.modelId, userId.value);
        if (response.resultCode === 200) {
          console.log(
            userId.value + "把" + model.value.modelId + "添加收藏成功:",
            response.message
          );
          isFavor.value = true;
        } else {
          console.error("添加收藏失败，响应码:", response.message);
        }
      } catch (error) {
        console.error("添加收藏时出错:", error);
      }
      getModelFavorCount(model.value.modelId);
    }

    // 处理取消收藏模型
    async function handleCancelFavor() {
      console.log(userId.value + "把" + model.value.modelId + "取消收藏");
      try {
        const response = await cancelFavor(model.value.modelId, userId.value);
        if (response.resultCode === 200) {
          console.log(
            userId.value + "把" + model.value.modelId + "取消收藏成功:",
            response.message + " " + response.resultCode
          );
          isFavor.value = false;
        } else {
          console.error(
            "取消收藏失败，响应码:" + " " + response.message + " " + response.resultCode
          );
        }
      } catch (error) {
        console.error("取消收藏时出错:", error);
      }
      getModelFavorCount(model.value.modelId);
    }
    //检查当前用户是否收藏了当前模型

    //增加模型浏览量
    async function incrementModelViewCount(modelId) {
      try {
        const response = await fetch(
          `/Model/model/${modelId}/incrementModelViewCount?modelId=${modelId}`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Model view count updated:", data);
      } catch (error) {
        console.error("Error updating model view count:", error);
      }
    }
    return {
      activeTab,
      model,
      error,
      renderedMarkdown,
      formattedDate,
      tags,
      modelLikeCount,
      handleAddFavor,
      handleCancelFavor,
      handleShareModel,
      handleModelDevelop,
      isFavor,
    };
  },
};
</script>

<style scoped>
@import "../../assets/css/ModelDetail.scss";
</style>
