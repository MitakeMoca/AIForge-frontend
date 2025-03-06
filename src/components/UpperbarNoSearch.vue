<template>
  <header class="upperbar">
    <div class="upperbar-logo">
      <img
          src="@/static/logo1.png"
          class="upperbar-image"
          alt="AIStart"
          @click="toHome"
      />
      <div class="upperbar-description">更适合新手的AI大模型平台</div>
    </div>
    <div class="upperbar-content">
      <div class="el-dropdown-link" @click="drawer = true">
        <el-avatar :src="userUrl" />
      </div>
      <el-drawer
          v-model="drawer"
          title="个人中心"
          :with-header="false"
          class="drawer"
      >
        <div class="drawer-title">个人中心</div>
        <div class="drawer-upper">
          <el-avatar
              :src="userUrl"
              :size="50"
              class="drawer-upper-avatar"
          />
          <div class="drawer-upper-other">
            <div class="drawer-upper-name">{{ state.username }}</div>
            <div class="drawer-upper-uid">UID: {{ state.userId }}</div>
            <div class="drawer-upper-email">邮箱: {{ state.email }}</div>
            <div class="drawer-upper-vip">VIP等级: {{ state.level }}</div>
          </div>
        </div>
        <el-menu class="drawer-menu">
          <el-menu-item index="a" @click="handleMenuClick('a')"
          >充值</el-menu-item
          >
          <el-menu-item index="b" @click="handleMenuClick('b')"
          >设置</el-menu-item
          >
          <el-menu-item index="c" @click="handleMenuClick('c')"
          >退出登录</el-menu-item
          >
        </el-menu>
      </el-drawer>
    </div>
  </header>
</template>

<script setup>
import { getLocal, setLocal } from "@/utils/local";
import { ref, reactive, onMounted } from "vue";
import { getUser } from "@/service/user";
import router from "@/router";
import { ElMessage } from "element-plus";
import { downloadByUserId } from "@/service/pic";

const drawer = ref(false);
const state = reactive({
  userId: "",
  username: "请先登入",
  email: "",
  password: "",
  level: 0,
});
const userUrl = ref("");

onMounted(async () => {
  state.userId = getLocal("userId");
  if (state.userId != null) {
    const getUserResponse = await getUser({
      UserId: state.userId,
    });
    Object.assign(state, getUserResponse.data);

    const downloadByUserIdResponse = await downloadByUserId({
      UserId: state.userId,
    });
    console.log(downloadByUserIdResponse);
    const blob = downloadByUserIdResponse; // 直接从 response.data 获取 Blob
    if (blob === null || blob.size === 0) {
      userUrl.value = "src/static/logo.png";
    } else {
      userUrl.value = URL.createObjectURL(blob); // 转为 URL 存入 ref
    }
  } else {
    state.username = "请先登入";
  }
});

const toHome = () => {
  router.push({
    path: "/home",
  });
};

const handleMenuClick = (command) => {
  switch (command) {
    case "a":
      // 处理充值点击事件
      router.push({
        path: "/pay",
      });
      break;
    case "b":
      // 处理设置点击事件
      ElMessage.success("敬请期待...")
      break;
    case "c":
      // 处理退出登录点击事件
      state.userId = "";
      state.userUrl = "";
      setLocal("userId", "");
      ElMessage.success("正在退出登录...");
      setTimeout(() => {
        router.push({
          path: "/",
        });
      }, 500);
      break;
    default:
      break;
  }
};
</script>

<style scoped>
.upperbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px; /* 根据实际需要调整高度 */
  background: #ffffff;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0; /* 根据实际需要调整内边距 */
}
.upperbar-logo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}
.upperbar-image {
  max-width: 140px;
  height: auto;
  padding-left: 30px;
  padding-bottom: 10px;
  cursor: pointer;
}
.upperbar-description {
  padding-top: 20px;
  padding-left: 20px;
  font-size: 16px;
  color: #3021a3;
}

.upperbar-content {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

.el-dropdown-link {
  margin: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* 抽屉容器样式 */
.drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
}

.drawer-title {
  font-size: 25px; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  color: #5f2aff; /* 字体颜色 */
  text-align: center; /* 文本居中 */
  padding: 5px 0; /* 上下内边距 */
  margin-bottom: 20px; /* 与下文的间距 */
}

/* 上部区域样式 */
.drawer-upper {
  display: flex;
  align-items: center; /* 垂直居中 */
  padding: 20px; /* 根据需要调整内边距 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 阴影效果 */
  margin-bottom: 20px; /* 与下文的间距 */
}

/* 头像样式 */
.drawer-upper-avatar {
  margin-right: 20px; /* 根据需要调整头像与其他元素之间的间距 */
}

/* 其他信息样式 */
.drawer-upper-other {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: flex-start; /* 子元素左对齐 */
  text-align: left; /* 确保文本内容左对齐 */
}

/* 名字样式 */
.drawer-upper-name {
  font-size: 20px;
  margin-bottom: 2px; /* 根据需要调整名字和UID之间的间距 */
}

/* UID样式 */
.drawer-upper-uid {
  font-size: 14px;
  margin-bottom: 2px;
  color: #666; /* 根据需要调整颜色 */
}

.drawer-upper-email {
  font-size: 14px;
  margin-bottom: 2px;
  color: #666; /* 根据需要调整颜色 */
}

.drawer-upper-vip {
  font-size: 14px;
  color: #8b9741;
}

.drawer-menu {
  flex: 1;
  padding: 0 20px;
}

</style>