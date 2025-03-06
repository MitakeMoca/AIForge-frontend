<template>
  <el-container class="container">
    <el-header>
      <h1>选择充值方式</h1>
    </el-header>

    <el-main>
      <div class="back" @click="back">
        <el-button type="primary" :icon="Back">返回</el-button>
      </div>
      <el-card v-if="selectedPlan === 'monthly'" class="plan-details">
        <h2>按月付费</h2>
        <p>首月特惠仅￥29.9</p>
      </el-card>
      <el-card v-if="selectedPlan === 'quarterly'" class="plan-details">
        <h2>按季付费</h2>
        <p>加赠精美电脑支架</p>
      </el-card>
      <el-card v-if="selectedPlan === 'annually'" class="plan-details">
        <h2>按年付费</h2>
        <p>买一赠一，再送音箱</p>
      </el-card>

      <el-table :data="tableData" style="width: 100%" v-if="showTable">
        <el-table-column prop="feature" label="功能/权益"></el-table-column>
        <el-table-column prop="free" label="免费版"></el-table-column>
        <el-table-column prop="member" label="会员版"></el-table-column>
      </el-table>

      <div class="plan-selection-buttons">
        <el-button @click="selectPlan('monthly')" type="primary">按月付费</el-button>
        <el-button @click="selectPlan('quarterly')" type="primary">按季付费</el-button>
        <el-button @click="selectPlan('annually')" type="primary">按年付费</el-button>
      </div>
    </el-main>
  </el-container>
</template>
  
  <script setup>
import { ref } from "vue";
import { Back } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const router = useRouter();
const selectedPlan = ref(null);
const showTable = ref(true);

function selectPlan(plan) {
  selectedPlan.value = plan;
}

const tableData = ref([
  {
    feature: "A币",
    free: "-",
    member: "1000个/月",
  },
  {
    feature: "SDK Token",
    free: "-",
    member: "100W/月",
  },
  {
    feature: "算力消耗折扣",
    free: "-",
    member: "最低8折",
  },
  {
    feature: "资源类型",
    free: "-",
    member: "iCoding-云端IDE, A100/多卡GPU",
  },
  {
    feature: "GPU周消耗限时",
    free: "-",
    member: "48小时/周",
  },
  {
    feature: "项目创建数",
    free: "-",
    member: "150个",
  },
]);

const back = () => {
  router.push({
    path: '/home'
  })
}
</script >

<style scoped>
@import "../../assets/css/Pay.scss";
</style>